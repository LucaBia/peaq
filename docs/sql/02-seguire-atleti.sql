-- PEAQ · blocco 2 · seguire altri atleti, ricerca, profilo pubblico, segnala e blocca
-- Solo oggetti nuovi. Le tre tabelle non hanno policy per l'app: si passa solo dalle funzioni. Richiede il blocco 1 (log_activity).
begin;

create table public.follows (
  follower_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  followed_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  check (follower_id <> followed_id)
);
create index follows_followed_idx on public.follows (followed_id);

create table public.athlete_blocks (
  blocker_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  blocked_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index athlete_blocks_blocked_idx on public.athlete_blocks (blocked_id);

create table public.athlete_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  reported_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  status text not null default 'open' check (status in ('open','reviewed','dismissed')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check (reporter_id <> reported_id)
);
create unique index athlete_reports_one_open on public.athlete_reports (reporter_id, reported_id) where status = 'open';

grant all on public.follows, public.athlete_blocks, public.athlete_reports to service_role;
grant select on public.athlete_reports to authenticated;
alter table public.follows enable row level security;
alter table public.athlete_blocks enable row level security;
alter table public.athlete_reports enable row level security;
create policy "Admins read athlete reports" on public.athlete_reports for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- Interna: true se chi chiama può vedere quell'atleta (registrazione finita, nessun blocco in un senso o nell'altro).
create or replace function public.athlete_visible(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.athlete_profiles p where p.user_id = _user_id and p.onboarding_completed_at is not null)
    and not exists (select 1 from public.athlete_blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = _user_id) or (b.blocker_id = _user_id and b.blocked_id = auth.uid()));
$$;

-- Interna: le righe pubbliche di un gruppo di atleti. Mai email, data di nascita, genere o documenti.
create or replace function public.athlete_rows(_ids uuid[])
returns table (user_id uuid, username text, bib_number integer, league text, discipline text, city text, following boolean)
language sql stable security definer set search_path = public as $$
  select p.user_id, p.username, p.bib_number,
    (select r.league from public.athlete_ratings r where r.user_id = p.user_id and r.discipline = case when p.discipline = 'bike' then 'bike' else 'run' end),
    p.discipline, c.name,
    exists (select 1 from public.follows f where f.follower_id = auth.uid() and f.followed_id = p.user_id)
  from public.athlete_profiles p left join public.cities c on c.id = p.city_id
  where p.user_id = any(_ids) and public.athlete_visible(p.user_id)
  order by p.username;
$$;
revoke execute on function public.athlete_visible(uuid), public.athlete_rows(uuid[]) from public, anon, authenticated;

create or replace function public.follow_athlete(_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if _user_id is null or _user_id = uid then raise exception 'invalid_user'; end if;
  if not exists (select 1 from public.athlete_profiles where user_id = uid and onboarding_completed_at is not null) then raise exception 'incomplete_profile'; end if;
  if not public.athlete_visible(_user_id) then raise exception 'user_not_found'; end if;
  insert into public.follows (follower_id, followed_id) values (uid, _user_id) on conflict do nothing;
  if found then perform public.log_activity('athlete.follow', 'athlete', _user_id::text); end if;
end $$;

create or replace function public.unfollow_athlete(_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  delete from public.follows where follower_id = uid and followed_id = _user_id;
  if found then perform public.log_activity('athlete.unfollow', 'athlete', _user_id::text); end if;
end $$;

create or replace function public.follow_counts(_user_id uuid)
returns table (followers integer, following integer)
language sql stable security definer set search_path = public as $$
  select (select count(*)::int from public.follows where followed_id = _user_id),
         (select count(*)::int from public.follows where follower_id = _user_id)
  where auth.uid() is not null;
$$;

create or replace function public.list_followers(_user_id uuid)
returns table (user_id uuid, username text, bib_number integer, league text, discipline text, city text, following boolean)
language sql stable security definer set search_path = public as $$
  select * from public.athlete_rows(array(select f.follower_id from public.follows f where f.followed_id = _user_id order by f.created_at desc limit 500))
  where auth.uid() is not null and (_user_id = auth.uid() or public.athlete_visible(_user_id));
$$;

create or replace function public.list_following(_user_id uuid)
returns table (user_id uuid, username text, bib_number integer, league text, discipline text, city text, following boolean)
language sql stable security definer set search_path = public as $$
  select * from public.athlete_rows(array(select f.followed_id from public.follows f where f.follower_id = _user_id order by f.created_at desc limit 500))
  where auth.uid() is not null and (_user_id = auth.uid() or public.athlete_visible(_user_id));
$$;

-- Atleti il cui nome utente contiene il testo cercato: almeno 2 caratteri, massimo 20 risultati, mai chi cerca.
create or replace function public.search_athletes(_q text)
returns table (user_id uuid, username text, bib_number integer, league text, discipline text, city text, following boolean)
language sql stable security definer set search_path = public as $$
  select * from public.athlete_rows(array(
    select p.user_id from public.athlete_profiles p
    where auth.uid() is not null and char_length(trim(coalesce(_q, ''))) >= 2
      and p.user_id <> auth.uid() and p.onboarding_completed_at is not null
      and lower(p.username) like '%' || replace(replace(replace(lower(trim(_q)), '\', '\\'), '%', '\%'), '_', '\_') || '%'
    order by (lower(p.username) like replace(replace(replace(lower(trim(_q)), '\', '\\'), '%', '\%'), '_', '\_') || '%') desc, p.username
    limit 20));
$$;

-- Il profilo pubblico di un atleta: una riga, oppure nessuna se non si può vedere.
create or replace function public.athlete_public(_user_id uuid)
returns table (user_id uuid, username text, bib_number integer, league text, discipline text, city text, following boolean,
  run_rating integer, run_league text, bike_rating integer, bike_league text, level integer, xp integer, races_done integer, followers integer, following_count integer)
language sql stable security definer set search_path = public as $$
  select a.user_id, a.username, a.bib_number, a.league, a.discipline, a.city, a.following,
    run.rating, run.league, bike.rating, bike.league,
    coalesce(g.level, 1), coalesce(g.xp, 0), coalesce(g.events_completed, 0),
    (select count(*)::int from public.follows f where f.followed_id = a.user_id),
    (select count(*)::int from public.follows f where f.follower_id = a.user_id)
  from public.athlete_rows(array[_user_id]) a
  left join public.athlete_ratings run on run.user_id = a.user_id and run.discipline = 'run'
  left join public.athlete_ratings bike on bike.user_id = a.user_id and bike.discipline = 'bike'
  left join public.athlete_progression g on g.user_id = a.user_id
  where auth.uid() is not null;
$$;

create or replace function public.report_athlete(_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if _user_id is null or _user_id = uid then raise exception 'invalid_user'; end if;
  if not exists (select 1 from public.athlete_profiles where user_id = _user_id) then raise exception 'user_not_found'; end if;
  insert into public.athlete_reports (reporter_id, reported_id) values (uid, _user_id) on conflict do nothing;
  if found then perform public.log_activity('athlete.report', 'athlete', _user_id::text); end if;
end $$;

-- Bloccare toglie anche i due «segui».
create or replace function public.block_athlete(_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if _user_id is null or _user_id = uid then raise exception 'invalid_user'; end if;
  if not exists (select 1 from public.athlete_profiles where user_id = _user_id) then raise exception 'user_not_found'; end if;
  insert into public.athlete_blocks (blocker_id, blocked_id) values (uid, _user_id) on conflict do nothing;
  delete from public.follows where (follower_id = uid and followed_id = _user_id) or (follower_id = _user_id and followed_id = uid);
  perform public.log_activity('athlete.block', 'athlete', _user_id::text);
end $$;

revoke execute on function public.follow_athlete(uuid), public.unfollow_athlete(uuid), public.follow_counts(uuid), public.list_followers(uuid),
  public.list_following(uuid), public.search_athletes(text), public.athlete_public(uuid), public.report_athlete(uuid), public.block_athlete(uuid) from public, anon;
grant execute on function public.follow_athlete(uuid), public.unfollow_athlete(uuid), public.follow_counts(uuid), public.list_followers(uuid),
  public.list_following(uuid), public.search_athletes(text), public.athlete_public(uuid), public.report_athlete(uuid), public.block_athlete(uuid) to authenticated;

commit;
