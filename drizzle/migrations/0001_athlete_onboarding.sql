create type public.app_role as enum ('admin', 'moderator', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.cities (
  id text primary key,
  name text not null,
  region text,
  country_code char(2) not null,
  lat numeric(8,5),
  lng numeric(8,5),
  unique (name, region, country_code)
);
grant select on public.cities to anon, authenticated;
grant all on public.cities to service_role;
alter table public.cities enable row level security;
create policy "Cities are public" on public.cities for select to anon, authenticated using (true);

insert into public.cities (id, name, region, country_code, lat, lng) values
('it-roma','Roma','Lazio','IT',41.9028,12.4964),
('it-milano','Milano','Lombardia','IT',45.4642,9.19),
('it-napoli','Napoli','Campania','IT',40.8518,14.2681),
('it-torino','Torino','Piemonte','IT',45.0703,7.6869),
('it-palermo','Palermo','Sicilia','IT',38.1157,13.3615),
('it-genova','Genova','Liguria','IT',44.4056,8.9463),
('it-bologna','Bologna','Emilia-Romagna','IT',44.4949,11.3426),
('it-firenze','Firenze','Toscana','IT',43.7696,11.2558),
('it-bari','Bari','Puglia','IT',41.1171,16.8719),
('it-catania','Catania','Sicilia','IT',37.5079,15.083),
('it-venezia','Venezia','Veneto','IT',45.4408,12.3155),
('it-verona','Verona','Veneto','IT',45.4384,10.9916),
('it-messina','Messina','Sicilia','IT',38.1938,15.554),
('it-padova','Padova','Veneto','IT',45.4064,11.8768),
('it-trieste','Trieste','Friuli-Venezia Giulia','IT',45.6495,13.7768),
('it-brescia','Brescia','Lombardia','IT',45.5416,10.2118),
('it-parma','Parma','Emilia-Romagna','IT',44.8015,10.3279),
('it-taranto','Taranto','Puglia','IT',40.4644,17.247),
('it-prato','Prato','Toscana','IT',43.8777,11.1022),
('it-modena','Modena','Emilia-Romagna','IT',44.6471,10.9252),
('it-reggio-calabria','Reggio Calabria','Calabria','IT',38.1113,15.6473),
('it-reggio-emilia','Reggio Emilia','Emilia-Romagna','IT',44.6983,10.6312),
('it-perugia','Perugia','Umbria','IT',43.1107,12.3908),
('it-ravenna','Ravenna','Emilia-Romagna','IT',44.4184,12.2035),
('it-livorno','Livorno','Toscana','IT',43.5485,10.3106),
('it-cagliari','Cagliari','Sardegna','IT',39.2238,9.1217),
('it-foggia','Foggia','Puglia','IT',41.4622,15.5446),
('it-rimini','Rimini','Emilia-Romagna','IT',44.0678,12.5695),
('it-salerno','Salerno','Campania','IT',40.6824,14.7681),
('it-ferrara','Ferrara','Emilia-Romagna','IT',44.8381,11.6198),
('it-sassari','Sassari','Sardegna','IT',40.7259,8.5557),
('it-latina','Latina','Lazio','IT',41.4676,12.9037),
('it-monza','Monza','Lombardia','IT',45.5845,9.2744),
('it-bergamo','Bergamo','Lombardia','IT',45.6983,9.6773),
('it-pescara','Pescara','Abruzzo','IT',42.4618,14.216),
('it-trento','Trento','Trentino-Alto Adige','IT',46.0748,11.1217),
('it-bolzano','Bolzano','Trentino-Alto Adige','IT',46.4983,11.3548),
('it-vicenza','Vicenza','Veneto','IT',45.5455,11.5354),
('it-treviso','Treviso','Veneto','IT',45.6669,12.243),
('it-novara','Novara','Piemonte','IT',45.4469,8.6222),
('it-como','Como','Lombardia','IT',45.8081,9.0852),
('it-varese','Varese','Lombardia','IT',45.8206,8.8251),
('it-udine','Udine','Friuli-Venezia Giulia','IT',46.0711,13.2346),
('it-ancona','Ancona','Marche','IT',43.6158,13.5189),
('it-lecce','Lecce','Puglia','IT',40.3515,18.175),
('it-pisa','Pisa','Toscana','IT',43.7228,10.4017),
('it-siena','Siena','Toscana','IT',43.3188,11.3308),
('it-lucca','Lucca','Toscana','IT',43.8429,10.5027),
('it-arezzo','Arezzo','Toscana','IT',43.4633,11.8796),
('it-cuneo','Cuneo','Piemonte','IT',44.3845,7.5427),
('it-aosta','Aosta','Valle d''Aosta','IT',45.7375,7.3201),
('it-lecco','Lecco','Lombardia','IT',45.8566,9.3977),
('it-sondrio','Sondrio','Lombardia','IT',46.1699,9.8715),
('it-belluno','Belluno','Veneto','IT',46.1425,12.2167),
('it-laquila','L''Aquila','Abruzzo','IT',42.3498,13.3995),
('it-potenza','Potenza','Basilicata','IT',40.6401,15.8051),
('it-matera','Matera','Basilicata','IT',40.6664,16.6043),
('it-campobasso','Campobasso','Molise','IT',41.5603,14.6627),
('it-catanzaro','Catanzaro','Calabria','IT',38.9098,16.5877),
('it-cosenza','Cosenza','Calabria','IT',39.2983,16.2537),
('it-siracusa','Siracusa','Sicilia','IT',37.0755,15.2866),
('it-olbia','Olbia','Sardegna','IT',40.9234,9.4983),
('it-mantova','Mantova','Lombardia','IT',45.1564,10.7914),
('it-cremona','Cremona','Lombardia','IT',45.1332,10.0227),
('it-pavia','Pavia','Lombardia','IT',45.1847,9.1582),
('it-piacenza','Piacenza','Emilia-Romagna','IT',45.0526,9.693),
('it-forli','Forlì','Emilia-Romagna','IT',44.2227,12.0407),
('it-cesena','Cesena','Emilia-Romagna','IT',44.1391,12.2431),
('it-pesaro','Pesaro','Marche','IT',43.9098,12.9131),
('it-terni','Terni','Umbria','IT',42.5636,12.6427),
('it-viterbo','Viterbo','Lazio','IT',42.4207,12.1077),
('it-caserta','Caserta','Campania','IT',41.0742,14.3329),
('it-asti','Asti','Piemonte','IT',44.9008,8.2064),
('it-alessandria','Alessandria','Piemonte','IT',44.9133,8.6157),
('it-biella','Biella','Piemonte','IT',45.5629,8.0583),
('it-la-spezia','La Spezia','Liguria','IT',44.1025,9.8241),
('it-savona','Savona','Liguria','IT',44.3091,8.4772),
('it-sanremo','Sanremo','Liguria','IT',43.8159,7.7761),
('it-pordenone','Pordenone','Friuli-Venezia Giulia','IT',45.9564,12.6615),
('it-rovigo','Rovigo','Veneto','IT',45.0698,11.7902),
('ch-lugano','Lugano','Ticino','CH',46.0037,8.9511),
('ch-zurich','Zürich','Zürich','CH',47.3769,8.5417),
('ch-geneve','Genève','Genève','CH',46.2044,6.1432),
('sm-san-marino','San Marino',null,'SM',43.9424,12.4578),
('fr-paris','Paris','Île-de-France','FR',48.8566,2.3522),
('fr-nice','Nice','Provence-Alpes-Côte d''Azur','FR',43.7102,7.262),
('fr-lyon','Lyon','Auvergne-Rhône-Alpes','FR',45.764,4.8357),
('es-madrid','Madrid','Comunidad de Madrid','ES',40.4168,-3.7038),
('es-barcelona','Barcelona','Cataluña','ES',41.3874,2.1686),
('de-berlin','Berlin','Berlin','DE',52.52,13.405),
('de-munchen','München','Bayern','DE',48.1351,11.582),
('at-wien','Wien','Wien','AT',48.2082,16.3738),
('at-innsbruck','Innsbruck','Tirol','AT',47.2692,11.4041),
('gb-london','London','England','GB',51.5072,-0.1276),
('nl-amsterdam','Amsterdam','Noord-Holland','NL',52.3676,4.9041),
('be-bruxelles','Bruxelles','Bruxelles-Capitale','BE',50.8503,4.3517),
('pt-lisboa','Lisboa','Lisboa','PT',38.7223,-9.1393),
('si-ljubljana','Ljubljana',null,'SI',46.0569,14.5058),
('hr-zagreb','Zagreb',null,'HR',45.815,15.9819),
('us-new-york','New York','New York','US',40.7128,-74.006);

create table public.athlete_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text,
  nationality char(2),
  city_id text references public.cities(id),
  discipline text check (discipline in ('run','bike','both')),
  bib_number integer unique check (bib_number between 1 and 9999),
  bib_variant text not null default 'classic',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username is null or username ~ '^[a-z0-9_.]{3,20}$')
);
create unique index athlete_profiles_username_key on public.athlete_profiles (lower(username));
grant select on public.athlete_profiles to authenticated;
grant all on public.athlete_profiles to service_role;
alter table public.athlete_profiles enable row level security;
create policy "Athletes read own profile" on public.athlete_profiles for select to authenticated using (user_id = auth.uid());

create table public.athlete_private (
  user_id uuid primary key references public.athlete_profiles(user_id) on delete cascade,
  date_of_birth date not null,
  gender text not null check (gender in ('male','female','non_binary','undisclosed')),
  updated_at timestamptz not null default now()
);
grant select on public.athlete_private to authenticated;
grant all on public.athlete_private to service_role;
alter table public.athlete_private enable row level security;
create policy "Athletes read own private data" on public.athlete_private for select to authenticated using (user_id = auth.uid());

create table public.athlete_performance (
  user_id uuid primary key references public.athlete_profiles(user_id) on delete cascade,
  run_distance_km smallint check (run_distance_km in (5,10)),
  run_time_seconds integer check (run_time_seconds > 0),
  bike_wkg numeric(4,2) check (bike_wkg > 0 and bike_wkg <= 8),
  updated_at timestamptz not null default now(),
  constraint run_pair check ((run_distance_km is null) = (run_time_seconds is null))
);
grant select on public.athlete_performance to authenticated;
grant all on public.athlete_performance to service_role;
alter table public.athlete_performance enable row level security;
create policy "Athletes read own performance" on public.athlete_performance for select to authenticated using (user_id = auth.uid());

create table public.athlete_ratings (
  user_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  discipline text not null check (discipline in ('run','bike')),
  rating integer not null default 300,
  league text not null default 'collina' check (league in ('valle','collina','passo','cresta','vetta','peaq')),
  provisional boolean not null default true,
  placement_races_completed smallint not null default 0,
  placement_races_required smallint not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, discipline)
);
grant select on public.athlete_ratings to authenticated;
grant all on public.athlete_ratings to service_role;
alter table public.athlete_ratings enable row level security;
create policy "Athletes read own ratings" on public.athlete_ratings for select to authenticated using (user_id = auth.uid());

create table public.athlete_progression (
  user_id uuid primary key references public.athlete_profiles(user_id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  events_completed integer not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.athlete_progression to authenticated;
grant all on public.athlete_progression to service_role;
alter table public.athlete_progression enable row level security;
create policy "Athletes read own progression" on public.athlete_progression for select to authenticated using (user_id = auth.uid());

create table public.athlete_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  doc_type text not null check (doc_type in ('medical_certificate','membership_card')),
  organization text check (organization in ('FIDAL','UISP','CSI','FCI','RUNCARD','OTHER')),
  card_number text check (char_length(card_number) <= 40),
  expires_on date,
  storage_path text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','expired')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, delete on public.athlete_documents to authenticated;
grant all on public.athlete_documents to service_role;
alter table public.athlete_documents enable row level security;
create policy "Athletes read own documents" on public.athlete_documents for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Athletes add pending documents" on public.athlete_documents for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending' and reviewed_by is null and reviewed_at is null
    and (storage_path is null or storage_path like auth.uid()::text || '/%'));
create policy "Athletes remove pending documents" on public.athlete_documents for delete to authenticated using (user_id = auth.uid() and status = 'pending');

create table public.notification_preferences (
  user_id uuid primary key default auth.uid(),
  new_events boolean not null default false,
  lobby_opening boolean not null default false,
  results boolean not null default false,
  decided_at timestamptz not null default now()
);
grant select, insert, update on public.notification_preferences to authenticated;
grant all on public.notification_preferences to service_role;
alter table public.notification_preferences enable row level security;
create policy "Own prefs read" on public.notification_preferences for select to authenticated using (user_id = auth.uid());
create policy "Own prefs insert" on public.notification_preferences for insert to authenticated with check (user_id = auth.uid());
create policy "Own prefs update" on public.notification_preferences for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.onboarding_progress (
  user_id uuid primary key default auth.uid(),
  current_step smallint not null default 1 check (current_step between 1 and 9),
  draft jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.onboarding_progress to authenticated;
grant all on public.onboarding_progress to service_role;
alter table public.onboarding_progress enable row level security;
create policy "Own progress read" on public.onboarding_progress for select to authenticated using (user_id = auth.uid());
create policy "Own progress insert" on public.onboarding_progress for insert to authenticated with check (user_id = auth.uid());
create policy "Own progress update" on public.onboarding_progress for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.username_available(_username text)
returns boolean language sql stable security definer set search_path = public as $$
  select lower(_username) ~ '^[a-z0-9_.]{3,20}$'
    and not exists (select 1 from public.athlete_profiles where lower(username) = lower(_username) and user_id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid))
$$;

create or replace function public.save_personal_info(_username text, _dob date, _gender text, _nationality text, _city_id text)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); existing text; done timestamptz;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  _username := lower(trim(_username));
  if _username !~ '^[a-z0-9_.]{3,20}$' then raise exception 'invalid_username'; end if;
  if _dob is null or _dob > (current_date - interval '18 years')::date or _dob < date '1900-01-01' then raise exception 'underage'; end if;
  if _gender not in ('male','female','non_binary','undisclosed') then raise exception 'invalid_gender'; end if;
  if _nationality !~ '^[A-Z]{2}$' then raise exception 'invalid_nationality'; end if;
  if not exists (select 1 from public.cities where id = _city_id) then raise exception 'invalid_city'; end if;
  select username, onboarding_completed_at into existing, done from public.athlete_profiles where user_id = uid;
  if done is not null and existing is distinct from _username then raise exception 'username_locked'; end if;
  begin
    insert into public.athlete_profiles (user_id, username, nationality, city_id)
    values (uid, _username, _nationality, _city_id)
    on conflict (user_id) do update set username = excluded.username, nationality = excluded.nationality, city_id = excluded.city_id, updated_at = now();
  exception when unique_violation then raise exception 'username_taken';
  end;
  insert into public.athlete_private (user_id, date_of_birth, gender) values (uid, _dob, _gender)
  on conflict (user_id) do update set date_of_birth = excluded.date_of_birth, gender = excluded.gender, updated_at = now();
end $$;

create or replace function public.set_discipline(_discipline text)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if _discipline not in ('run','bike','both') then raise exception 'invalid_discipline'; end if;
  update public.athlete_profiles set discipline = _discipline, updated_at = now() where user_id = uid;
  if not found then raise exception 'profile_missing'; end if;
  if _discipline in ('run','both') then
    insert into public.athlete_ratings (user_id, discipline) values (uid, 'run') on conflict do nothing;
  end if;
  if _discipline in ('bike','both') then
    insert into public.athlete_ratings (user_id, discipline) values (uid, 'bike') on conflict do nothing;
  end if;
end $$;

create or replace function public.bib_status(_number integer)
returns text language sql stable security definer set search_path = public as $$
  select case
    when _number is null or _number < 1 or _number > 9999 then 'invalid'
    when _number <= 100 then 'reserved'
    when exists (select 1 from public.athlete_profiles where bib_number = _number and user_id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)) then 'taken'
    else 'available' end
$$;

create or replace function public.random_available_bib()
returns integer language plpgsql volatile security definer set search_path = public as $$
declare n integer; i integer := 0;
begin
  loop
    n := 101 + floor(random() * 9899)::int;
    exit when not exists (select 1 from public.athlete_profiles where bib_number = n);
    i := i + 1;
    if i > 200 then
      select s into n from generate_series(101, 9999) s
      where not exists (select 1 from public.athlete_profiles where bib_number = s) limit 1;
      exit;
    end if;
  end loop;
  return n;
end $$;

create or replace function public.claim_bib(_number integer)
returns integer language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); current_bib integer;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if _number is null or _number < 101 or _number > 9999 then
    if _number between 1 and 100 then raise exception 'reserved'; end if;
    raise exception 'invalid_number';
  end if;
  select bib_number into current_bib from public.athlete_profiles where user_id = uid for update;
  if not found then raise exception 'profile_missing'; end if;
  if current_bib is not null then
    if current_bib = _number then return current_bib; end if;
    raise exception 'already_assigned';
  end if;
  begin
    update public.athlete_profiles set bib_number = _number, updated_at = now() where user_id = uid and bib_number is null;
  exception when unique_violation then raise exception 'taken';
  end;
  return _number;
end $$;

create or replace function public.save_performance(_run_distance_km integer, _run_time_seconds integer, _bike_wkg numeric)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if (_run_distance_km is null) <> (_run_time_seconds is null) then raise exception 'invalid_run'; end if;
  if _run_distance_km is not null then
    if _run_distance_km not in (5,10) then raise exception 'invalid_run'; end if;
    if _run_time_seconds < _run_distance_km * 150 or _run_time_seconds > _run_distance_km * 600 then raise exception 'implausible_run'; end if;
  end if;
  if _bike_wkg is not null and (_bike_wkg < 0.5 or _bike_wkg > 7.5) then raise exception 'implausible_bike'; end if;
  insert into public.athlete_performance (user_id, run_distance_km, run_time_seconds, bike_wkg)
  values (uid, _run_distance_km, _run_time_seconds, _bike_wkg)
  on conflict (user_id) do update set run_distance_km = excluded.run_distance_km, run_time_seconds = excluded.run_time_seconds, bike_wkg = excluded.bike_wkg, updated_at = now();
end $$;

create or replace function public.complete_onboarding()
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); p public.athlete_profiles;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  select * into p from public.athlete_profiles where user_id = uid;
  if not found or p.username is null or p.discipline is null or p.bib_number is null then raise exception 'incomplete_profile'; end if;
  insert into public.athlete_progression (user_id) values (uid) on conflict do nothing;
  update public.athlete_profiles set onboarding_completed_at = coalesce(onboarding_completed_at, now()), updated_at = now() where user_id = uid;
end $$;

create or replace function public.review_document(_id uuid, _status text, _note text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  if _status not in ('approved','rejected','expired','pending') then raise exception 'invalid_status'; end if;
  update public.athlete_documents set status = _status, review_note = _note, reviewed_by = auth.uid(), reviewed_at = now(), updated_at = now() where id = _id;
end $$;

revoke execute on function public.save_personal_info(text,date,text,text,text), public.set_discipline(text), public.claim_bib(integer),
  public.random_available_bib(), public.save_performance(integer,integer,numeric), public.complete_onboarding(),
  public.review_document(uuid,text,text), public.username_available(text), public.bib_status(integer) from public, anon;
grant execute on function public.save_personal_info(text,date,text,text,text), public.set_discipline(text), public.claim_bib(integer),
  public.random_available_bib(), public.save_performance(integer,integer,numeric), public.complete_onboarding(),
  public.review_document(uuid,text,text), public.username_available(text), public.bib_status(integer) to authenticated;

create policy "Athletes upload own docs" on storage.objects for insert to authenticated
  with check (bucket_id = 'athlete-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Athletes read own docs" on storage.objects for select to authenticated
  using (bucket_id = 'athlete-documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.has_role(auth.uid(),'admin')));
create policy "Athletes delete own docs" on storage.objects for delete to authenticated
  using (bucket_id = 'athlete-documents' and (storage.foldername(name))[1] = auth.uid()::text);