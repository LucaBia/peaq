-- PEAQ · blocco 4 · correzioni dopo la rilettura di sicurezza dei blocchi 1-3
-- Tocca solo oggetti creati nei blocchi 1-3.
begin;

-- 1. Conferme della gara pilota CHIUSE finche' non si decide di aprirle: l'interruttore nell'app non bastava,
--    la funzione era gia' chiamabile da chiunque avesse un account. Per aprirle:
--    grant execute on function public.confirm_pilot_presence(text) to authenticated;
revoke execute on function public.confirm_pilot_presence(text) from authenticated;

-- Stessa funzione, ma scrive nel registro solo quando cambia davvero qualcosa.
create or replace function public.confirm_pilot_presence(_start text)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); had text;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if _start is null or _start not in ('valle','collina','passo') then raise exception 'invalid_start'; end if;
  if not exists (select 1 from public.athlete_profiles where user_id = uid and onboarding_completed_at is not null) then raise exception 'incomplete_profile'; end if;
  perform pg_advisory_xact_lock(hashtext('peaq_pilot_confirmations'));
  select start_league into had from public.pilot_confirmations where user_id = uid;
  if had is null and (select count(*) from public.pilot_confirmations) >= 40 then raise exception 'full'; end if;
  if had is not distinct from _start then return; end if;
  insert into public.pilot_confirmations (user_id, start_league) values (uid, _start)
  on conflict (user_id) do update set start_league = excluded.start_league, updated_at = now();
  perform public.log_activity(case when had is null then 'pilot.confirm' else 'pilot.change_start' end, 'pilot_confirmation', uid::text, jsonb_build_object('start', _start, 'before', had));
end $$;

-- 2. Cancellare una gara non deve piu' cancellare in silenzio iscrizioni e risultati: ora la cancellazione viene rifiutata.
alter table public.registrations drop constraint registrations_event_id_fkey, add constraint registrations_event_id_fkey foreign key (event_id) references public.events(id);
alter table public.results drop constraint results_event_id_fkey, add constraint results_event_id_fkey foreign key (event_id) references public.events(id);

-- 4. Le liste tengono l'ordine in cui arrivano (i piu' recenti prima; nella ricerca prima chi inizia con il testo).
create or replace function public.athlete_rows(_ids uuid[])
returns table (user_id uuid, username text, bib_number integer, league text, discipline text, city text, following boolean)
language sql stable security definer set search_path = public as $$
  select p.user_id, p.username, p.bib_number,
    (select r.league from public.athlete_ratings r where r.user_id = p.user_id and r.discipline = case when p.discipline = 'bike' then 'bike' else 'run' end),
    p.discipline, c.name,
    exists (select 1 from public.follows f where f.follower_id = auth.uid() and f.followed_id = p.user_id)
  from unnest(_ids) with ordinality as u(id, ord)
  join public.athlete_profiles p on p.user_id = u.id
  left join public.cities c on c.id = p.city_id
  where public.athlete_visible(p.user_id)
  order by u.ord;
$$;

-- 5. Seguire e bloccare la stessa coppia di atleti non possono piu' accavallarsi.
create or replace function public.follow_athlete(_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if _user_id is null or _user_id = uid then raise exception 'invalid_user'; end if;
  if not exists (select 1 from public.athlete_profiles where user_id = uid and onboarding_completed_at is not null) then raise exception 'incomplete_profile'; end if;
  perform pg_advisory_xact_lock(hashtextextended(least(uid, _user_id)::text || greatest(uid, _user_id)::text, 0));
  if not public.athlete_visible(_user_id) then raise exception 'user_not_found'; end if;
  insert into public.follows (follower_id, followed_id) values (uid, _user_id) on conflict do nothing;
  if found then perform public.log_activity('athlete.follow', 'athlete', _user_id::text); end if;
end $$;

create or replace function public.block_athlete(_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); fresh boolean;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if _user_id is null or _user_id = uid then raise exception 'invalid_user'; end if;
  if not exists (select 1 from public.athlete_profiles where user_id = _user_id) then raise exception 'user_not_found'; end if;
  perform pg_advisory_xact_lock(hashtextextended(least(uid, _user_id)::text || greatest(uid, _user_id)::text, 0));
  insert into public.athlete_blocks (blocker_id, blocked_id) values (uid, _user_id) on conflict do nothing;
  fresh := found;
  delete from public.follows where (follower_id = uid and followed_id = _user_id) or (follower_id = _user_id and followed_id = uid);
  if fresh then perform public.log_activity('athlete.block', 'athlete', _user_id::text); end if;
end $$;

-- 6. Un blocco si puo' togliere, e ognuno puo' leggere l'elenco di chi ha bloccato.
create or replace function public.unblock_athlete(_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  delete from public.athlete_blocks where blocker_id = uid and blocked_id = _user_id;
  if found then perform public.log_activity('athlete.unblock', 'athlete', _user_id::text); end if;
end $$;
revoke execute on function public.unblock_athlete(uuid) from public, anon;
grant execute on function public.unblock_athlete(uuid) to authenticated;
grant select on public.athlete_blocks to authenticated;
create policy "Own blocks read" on public.athlete_blocks for select to authenticated using (blocker_id = auth.uid());

-- 7. Chi e' stato bloccato non legge piu' nemmeno i numeri di follower e seguiti di chi lo ha bloccato.
create or replace function public.follow_counts(_user_id uuid)
returns table (followers integer, following integer)
language sql stable security definer set search_path = public as $$
  select (select count(*)::int from public.follows where followed_id = _user_id),
         (select count(*)::int from public.follows where follower_id = _user_id)
  where auth.uid() is not null and (_user_id = auth.uid() or public.athlete_visible(_user_id));
$$;

-- 8. Vincoli che mancavano: un solo risultato pubblicato per atleta e gara, un solo capitano per club,
--    e i membri si leggono solo per i club che si possono vedere.
create unique index results_one_published on public.results (event_id, user_id) where state = 'published';
create unique index club_members_one_captain on public.club_members (club_id) where role = 'captain';
drop policy "Club members are readable" on public.club_members;
create policy "Members of visible clubs are readable" on public.club_members for select to authenticated
  using (exists (select 1 from public.clubs c where c.id = club_members.club_id));

commit;
