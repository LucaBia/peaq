-- PEAQ · blocco 3 · struttura per il resto della v1: gare e iscrizioni, pagamenti, risultati, regole, club, inviti, lobby
-- Tabelle nuove, piu' alcune colonne facoltative aggiunte a public.events (nessuna colonna esistente cambia).
-- Qui c'e' la STRUTTURA, non i flussi: l'app puo' solo leggere (dove indicato). Le scritture arriveranno con funzioni
-- dedicate quando ci saranno schermate e decisioni (fornitore dei pagamenti, parametri del rating).
-- Importi in centesimi, date in UTC, stati come elenchi chiusi. Tutto o niente.
begin;

-- ── Regole di gioco: un solo punto, con numero di versione. Ogni gara salva la versione usata.
create table public.game_rules (
  version integer primary key check (version > 0),
  rules jsonb not null,
  note text check (char_length(note) <= 500),
  active boolean not null default false,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create unique index game_rules_one_active on public.game_rules (active) where active;

-- ── Gare: campi in piu' (tutti facoltativi o con un valore di partenza).
alter table public.events
  add column image_path text check (char_length(image_path) <= 300),
  add column invite_only boolean not null default false,
  add column price_cents integer not null default 0 check (price_cents >= 0),
  add column format text not null default 'classic' check (format in ('classic','elimination')),
  add column distance_m integer check (distance_m > 0),
  add column laps integer check (laps > 0),
  add column lap_m integer check (lap_m > 0),
  add column min_participants integer check (min_participants > 0),
  add column meeting_point text check (char_length(meeting_point) <= 200),
  add column briefing text check (char_length(briefing) <= 4000),
  add column registration_opens_at timestamptz,
  add column registration_closes_at timestamptz,
  add column rules_version integer references public.game_rules(version);

-- Partenze per lega di una gara.
create table public.event_waves (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  number smallint not null check (number > 0),
  leagues text[] not null check (leagues <@ array['valle','collina','passo','cresta','vetta','peaq']::text[] and cardinality(leagues) > 0),
  starts_at timestamptz,
  published_at timestamptz,
  unique (event_id, number)
);

-- Iscrizioni: il centro di tutto. Una per atleta e gara.
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  status text not null check (status in ('pending_payment','confirmed','checked_in','finished','dnf','dns','cancelled_by_user','cancelled_event','waiting','offered','expired')),
  source text not null default 'app' check (source in ('app','admin')),
  rating_snapshot integer,
  league_snapshot text check (league_snapshot in ('valle','collina','passo','cresta','vetta','peaq')),
  wave_id uuid references public.event_waves(id) on delete set null,
  wave_manual boolean not null default false,
  emergency_contact_name text check (char_length(emergency_contact_name) <= 120),
  emergency_contact_phone text check (char_length(emergency_contact_phone) <= 30),
  photo_consent boolean,
  offered_until timestamptz,
  checked_in_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);
create index registrations_event_status_idx on public.registrations (event_id, status);
create index registrations_user_idx on public.registrations (user_id);

-- Pagamenti: il fornitore e' la fonte di verita'. Qui solo riferimento e stato, mai dati di carta.
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.athlete_profiles(user_id) on delete set null,
  registration_id uuid references public.registrations(id) on delete set null,
  provider text not null check (char_length(provider) <= 40),
  provider_ref text not null check (char_length(provider_ref) <= 200),
  amount_cents integer not null check (amount_cents >= 0),
  refunded_cents integer not null default 0 check (refunded_cents >= 0),
  currency char(3) not null default 'EUR',
  method_label text check (char_length(method_label) <= 60),
  status text not null default 'pending' check (status in ('pending','paid','failed','to_refund','refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_ref),
  check (refunded_cents <= amount_cents)
);
create index payments_user_idx on public.payments (user_id);

-- Crediti: gare gratis e a meta' prezzo (inviti, premi delle Tappe).
create table public.race_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  source text not null check (source in ('invite','stage_reward','invited_first_race')),
  kind text not null check (kind in ('free','half_price')),
  used_registration_id uuid references public.registrations(id) on delete set null,
  used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index race_credits_user_idx on public.race_credits (user_id);

-- Risultati: una riga per atleta e gara; una correzione e' una versione nuova, la vecchia resta.
create table public.results (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references public.athlete_profiles(user_id) on delete set null,
  wave_id uuid references public.event_waves(id) on delete set null,
  discipline text not null check (discipline in ('run','bike')),
  status text not null check (status in ('finished','dnf','dns','dsq')),
  finish_time_ms integer check (finish_time_ms > 0),
  eliminated_lap smallint check (eliminated_lap > 0),
  position_wave integer check (position_wave > 0),
  position_overall integer check (position_overall > 0),
  rating_before integer,
  rating_after integer,
  xp_earned integer check (xp_earned >= 0),
  version integer not null default 1 check (version > 0),
  state text not null default 'preview' check (state in ('preview','published','corrected')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (event_id, user_id, version)
);
create index results_user_idx on public.results (user_id);

create table public.rating_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  discipline text not null check (discipline in ('run','bike')),
  event_id uuid references public.events(id) on delete set null,
  rating_before integer not null,
  rating_after integer not null,
  reason text not null check (reason in ('race','correction','manual')),
  note text check (char_length(note) <= 500),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index rating_history_user_idx on public.rating_history (user_id, discipline, created_at desc);

-- Tutto cio' che succede a un orario (apertura iscrizioni, chiusura, lobby...) e' un lavoro del server.
create table public.event_jobs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  kind text not null check (char_length(kind) <= 60),
  run_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','done','failed','cancelled')),
  done_at timestamptz,
  error text check (char_length(error) <= 1000),
  created_at timestamptz not null default now(),
  unique (event_id, kind)
);

-- Lobby: chat tra iscritti e messaggi dell'organizzatore.
create table public.lobby_messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  author_id uuid references public.athlete_profiles(user_id) on delete set null,
  body text not null check (char_length(body) between 1 and 1000),
  is_announcement boolean not null default false,
  pinned boolean not null default false,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index lobby_messages_event_idx on public.lobby_messages (event_id, created_at);

-- ── Club: uno per persona.
create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 40),
  city_id text references public.cities(id),
  created_by uuid references public.athlete_profiles(user_id) on delete set null,
  status text not null default 'active' check (status in ('active','hidden')),
  created_at timestamptz not null default now()
);
create unique index clubs_name_key on public.clubs (lower(name));

create table public.club_members (
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null unique references public.athlete_profiles(user_id) on delete cascade,
  role text not null default 'member' check (role in ('captain','vice','og','member')),
  joined_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

create table public.club_join_requests (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','cancelled')),
  decided_by uuid,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index club_join_requests_one_pending on public.club_join_requests (club_id, user_id) where status = 'pending';

create table public.club_posts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  author_id uuid references public.athlete_profiles(user_id) on delete set null,
  body text not null check (char_length(body) between 1 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index club_posts_club_idx on public.club_posts (club_id, created_at desc);

-- Segnalazioni di club, post e messaggi della lobby (richieste da Apple).
create table public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  target_type text not null check (target_type in ('club','club_post','lobby_message')),
  target_id uuid not null,
  status text not null default 'open' check (status in ('open','reviewed','dismissed')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index content_reports_one_open on public.content_reports (reporter_id, target_type, target_id) where status = 'open';

-- ── Inviti: un codice personale per atleta; un invitato ha un solo invitante.
create table public.invite_codes (
  user_id uuid primary key references public.athlete_profiles(user_id) on delete cascade,
  code text not null unique check (code ~ '^[a-z0-9]{6,12}$'),
  created_at timestamptz not null default now()
);

create table public.invites (
  inviter_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  invited_user_id uuid primary key references public.athlete_profiles(user_id) on delete cascade,
  status text not null default 'signed_up' check (status in ('signed_up','raced','credited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (inviter_id <> invited_user_id)
);
create index invites_inviter_idx on public.invites (inviter_id);

-- ── Pettorali da 1 a 100: riservati (premi, amici, organizzatori).
create table public.reserved_numbers (
  number integer primary key check (number between 1 and 100),
  status text not null default 'free' check (status in ('free','held','given')),
  user_id uuid references public.athlete_profiles(user_id) on delete set null,
  reason text check (char_length(reason) <= 200),
  updated_at timestamptz not null default now()
);

-- ── Permessi: niente per i visitatori; l'app legge solo quello che le policy qui sotto permettono; nessuna scrittura diretta.
revoke all on public.game_rules, public.event_waves, public.registrations, public.payments, public.race_credits, public.results, public.rating_history,
  public.event_jobs, public.lobby_messages, public.clubs, public.club_members, public.club_join_requests, public.club_posts, public.content_reports,
  public.invite_codes, public.invites, public.reserved_numbers from anon, authenticated;
grant all on public.game_rules, public.event_waves, public.registrations, public.payments, public.race_credits, public.results, public.rating_history,
  public.event_jobs, public.lobby_messages, public.clubs, public.club_members, public.club_join_requests, public.club_posts, public.content_reports,
  public.invite_codes, public.invites, public.reserved_numbers to service_role;
grant select on public.game_rules, public.event_waves, public.registrations, public.payments, public.race_credits, public.results, public.rating_history,
  public.event_jobs, public.lobby_messages, public.clubs, public.club_members, public.club_join_requests, public.club_posts, public.content_reports,
  public.invite_codes, public.invites, public.reserved_numbers to authenticated;

alter table public.game_rules enable row level security;
alter table public.event_waves enable row level security;
alter table public.registrations enable row level security;
alter table public.payments enable row level security;
alter table public.race_credits enable row level security;
alter table public.results enable row level security;
alter table public.rating_history enable row level security;
alter table public.event_jobs enable row level security;
alter table public.lobby_messages enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.club_join_requests enable row level security;
alter table public.club_posts enable row level security;
alter table public.content_reports enable row level security;
alter table public.invite_codes enable row level security;
alter table public.invites enable row level security;
alter table public.reserved_numbers enable row level security;

create policy "Active rules are readable" on public.game_rules for select to authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "Published waves are readable" on public.event_waves for select to authenticated using (published_at is not null or public.has_role(auth.uid(),'admin'));
create policy "Own registrations read" on public.registrations for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Own payments read" on public.payments for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Own credits read" on public.race_credits for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Published results are readable" on public.results for select to authenticated using (state = 'published' or public.has_role(auth.uid(),'admin'));
create policy "Own rating history read" on public.rating_history for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Admins read event jobs" on public.event_jobs for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Registered athletes read the lobby" on public.lobby_messages for select to authenticated
  using (public.has_role(auth.uid(),'admin') or (not hidden and exists (select 1 from public.registrations r
    where r.event_id = lobby_messages.event_id and r.user_id = auth.uid() and r.status in ('confirmed','checked_in','finished','dnf'))));
create policy "Active clubs are readable" on public.clubs for select to authenticated using (status = 'active' or public.has_role(auth.uid(),'admin'));
create policy "Club members are readable" on public.club_members for select to authenticated using (true);
create policy "Own or managed join requests read" on public.club_join_requests for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin') or exists (select 1 from public.club_members m
    where m.club_id = club_join_requests.club_id and m.user_id = auth.uid() and m.role in ('captain','vice')));
create policy "Members read club posts" on public.club_posts for select to authenticated
  using (public.has_role(auth.uid(),'admin') or (not hidden and exists (select 1 from public.club_members m where m.club_id = club_posts.club_id and m.user_id = auth.uid())));
create policy "Admins read content reports" on public.content_reports for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Own invite code read" on public.invite_codes for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Own invites read" on public.invites for select to authenticated using (inviter_id = auth.uid() or invited_user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Admins read reserved numbers" on public.reserved_numbers for select to authenticated using (public.has_role(auth.uid(),'admin'));

commit;
