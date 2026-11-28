-- PEAQ · blocco 1 · registro attività, conferma presenza alla gara pilota, classifica di città
-- Solo oggetti nuovi: non modifica tabelle né funzioni esistenti. Tutto o niente (begin/commit).
begin;

-- ── Registro attività: ogni modifica fatta dalle funzioni qui sotto lascia una riga. Solo aggiunta, lo leggono gli admin.
create table public.activity_log (
  id bigint generated always as identity primary key,
  actor_id uuid default auth.uid(),
  action text not null check (char_length(action) between 1 and 80),
  target_type text check (char_length(target_type) <= 40),
  target_id text check (char_length(target_id) <= 80),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index activity_log_created_idx on public.activity_log (created_at desc);
grant select on public.activity_log to authenticated;
grant all on public.activity_log to service_role;
alter table public.activity_log enable row level security;
create policy "Admins read activity log" on public.activity_log for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- Interna: la chiamano solo le altre funzioni, mai l'app.
create or replace function public.log_activity(_action text, _target_type text default null, _target_id text default null, _details jsonb default '{}'::jsonb)
returns void language sql security definer set search_path = public as $$
  insert into public.activity_log (actor_id, action, target_type, target_id, details)
  values (auth.uid(), _action, _target_type, _target_id, coalesce(_details, '{}'::jsonb));
$$;
revoke execute on function public.log_activity(text, text, text, jsonb) from public, anon, authenticated;

-- ── Gara pilota: chi ha confermato e con quale partenza. Massimo 40 posti.
create table public.pilot_confirmations (
  user_id uuid primary key references public.athlete_profiles(user_id) on delete cascade,
  start_league text not null check (start_league in ('valle','collina','passo')),
  confirmed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.pilot_confirmations to authenticated;
grant all on public.pilot_confirmations to service_role;
alter table public.pilot_confirmations enable row level security;
create policy "Own pilot confirmation read" on public.pilot_confirmations for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- La partenza con cui ho confermato, o null.
create or replace function public.my_pilot_start()
returns text language sql stable security definer set search_path = public as $$
  select start_league from public.pilot_confirmations where user_id = auth.uid();
$$;

-- Conferma, o cambia partenza se ho già confermato. Errori: not_authenticated, invalid_start, incomplete_profile, full.
create or replace function public.confirm_pilot_presence(_start text)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); had text;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if _start is null or _start not in ('valle','collina','passo') then raise exception 'invalid_start'; end if;
  if not exists (select 1 from public.athlete_profiles where user_id = uid and onboarding_completed_at is not null) then raise exception 'incomplete_profile'; end if;
  -- Una conferma alla volta, così due persone non prendono insieme l'ultimo posto.
  perform pg_advisory_xact_lock(hashtext('peaq_pilot_confirmations'));
  select start_league into had from public.pilot_confirmations where user_id = uid;
  if had is null and (select count(*) from public.pilot_confirmations) >= 40 then raise exception 'full'; end if;
  insert into public.pilot_confirmations (user_id, start_league) values (uid, _start)
  on conflict (user_id) do update set start_league = excluded.start_league, updated_at = now();
  perform public.log_activity(case when had is null then 'pilot.confirm' else 'pilot.change_start' end, 'pilot_confirmation', uid::text, jsonb_build_object('start', _start, 'before', had));
end $$;

create or replace function public.cancel_pilot_presence()
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); had text;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  delete from public.pilot_confirmations where user_id = uid returning start_league into had;
  if had is not null then perform public.log_activity('pilot.cancel', 'pilot_confirmation', uid::text, jsonb_build_object('start', had)); end if;
end $$;

-- Per il pannello admin: l'elenco dei confermati con pettorale e partenza.
create or replace function public.admin_list_pilot_confirmations()
returns table (user_id uuid, email text, username text, bib_number integer, start_league text, confirmed_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  return query
    select c.user_id, u.email::text, p.username, p.bib_number, c.start_league, c.confirmed_at
    from public.pilot_confirmations c join public.athlete_profiles p on p.user_id = c.user_id join auth.users u on u.id = c.user_id
    order by c.start_league, p.bib_number;
end $$;

-- ── Classifica di una città per uno sport. Espone solo nome utente, rating e lega; entra chi ha corso almeno una gara.
create or replace function public.city_ranking(_discipline text, _city_id text)
returns table (user_id uuid, username text, rating integer, league text, rank bigint)
language sql stable security definer set search_path = public as $$
  select p.user_id, p.username, r.rating, r.league, rank() over (order by r.rating desc) as rank
  from public.athlete_ratings r join public.athlete_profiles p on p.user_id = r.user_id
  where auth.uid() is not null
    and r.discipline = _discipline and p.city_id = _city_id
    and p.onboarding_completed_at is not null
    and r.placement_races_completed > 0
  order by r.rating desc, p.username
  limit 200;
$$;

revoke execute on function public.my_pilot_start(), public.confirm_pilot_presence(text), public.cancel_pilot_presence(),
  public.admin_list_pilot_confirmations(), public.city_ranking(text, text) from public, anon;
grant execute on function public.my_pilot_start(), public.confirm_pilot_presence(text), public.cancel_pilot_presence(),
  public.admin_list_pilot_confirmations(), public.city_ranking(text, text) to authenticated;

commit;
