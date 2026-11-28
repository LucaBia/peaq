# Seguire altri atleti, ricerca e profili: note per Luca

Aggiornato al 28 novembre 2026. Riguarda Follower e Seguiti (Figma B6), la ricerca atleti e il profilo degli altri atleti (Figma B9) con «Segnala o blocca».

## Stato

La parte visiva è fatta e provata con atleti finti. **Nell'app è spenta**: `SOCIAL_OPEN = false` in `src/lib/app/social.ts`. Finché è spenta il Profilo mostra i tre contatori sotto il pettorale con Follower 0 e Seguiti 0 (è vero: nessuno segue ancora nessuno) ma non si toccano, le pagine `/app/athletes…` rimandano al Profilo e i nomi nelle Classifiche non sono cliccabili.

Serve il database: oggi non esiste una tabella di chi segue chi, e ogni atleta può leggere solo il proprio profilo (RLS), quindi né ricerca né profili altrui possono funzionare.

## Cosa c'è nel codice

| File | Cosa fa |
|---|---|
| `src/lib/app/social.ts` | `SOCIAL_OPEN`, tipi `AthleteRow` e `AthletePublic`, `socialService` con le chiamate ancora vuote |
| `src/components/app/Athletes.tsx` | `AthletesScreen` (Follower / Seguiti con la ricerca), `AthleteScreen` (profilo di un altro atleta, Segui, Segnala o blocca), `Counters`, `AthleteLink` |
| `src/routes/_authenticated/app.athletes.tsx` | `/app/athletes?tab=followers` oppure `following` |
| `src/routes/_authenticated/app.athletes_.$userId.tsx` | `/app/athletes/:userId` |
| `Profile.tsx`, `app.index.tsx` | Contatori Gare / Follower / Seguiti sotto il pettorale; diventano collegamenti quando è acceso |
| `Rankings.tsx`, `RankingsMountain.tsx` | I nomi aprono il profilo dell'atleta, quando è acceso |
| `src/lib/app/i18n.tsx` | Testi: blocco `soc`, italiano e inglese |

## Cosa serve dal database

Proposta, nello stile delle funzioni che ci sono già (tabelle in sola lettura, scritture solo da funzioni `security definer`):

```sql
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
  primary key (blocker_id, blocked_id)
);

create table public.athlete_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid(),
  reported_id uuid not null references public.athlete_profiles(user_id) on delete cascade,
  status text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at timestamptz not null default now()
);
-- RLS attiva su tutte e tre, nessuna policy per i client: si passa solo dalle funzioni.
```

Funzioni che `socialService` si aspetta (nomi liberi, basta collegarli):

| Funzione | Restituisce |
|---|---|
| `follow_athlete(_user_id)`, `unfollow_athlete(_user_id)` | niente; rifiuta se uno dei due ha bloccato l'altro |
| `follow_counts(_user_id)` | `followers`, `following` |
| `list_followers(_user_id)`, `list_following(_user_id)` | righe atleta (vedi sotto) |
| `search_athletes(_q)` | righe atleta il cui nome utente contiene `_q`, massimo 20 |
| `athlete_public(_user_id)` | riga atleta + rating per sport, Tappa, XP, gare finite, numero di follower e seguiti |
| `report_athlete(_user_id)`, `block_athlete(_user_id)` | niente; il blocco toglie anche i due «segui» |

Una **riga atleta** contiene solo dati pubblici per regola di prodotto: `user_id`, `username`, `bib_number`, lega (dello sport principale), `discipline`, nome della città, e `following` (se chi chiama lo segue). Mai email, data di nascita, genere, documenti.

Tutte le funzioni di lettura devono escludere chi non ha finito la registrazione e chi ha bloccato o è stato bloccato da chi chiama.

## Da decidere con Giovanni

- **Nome e cognome**: la regola dice «pubblici di partenza, con un interruttore per nasconderli». Oggi il profilo non li raccoglie, quindi le schermate mostrano solo il nome utente.
- **Segnalazioni**: dove le vede chi modera (pannello admin) e in quanto tempo si risponde. Apple chiede segnala e blocca per i contenuti degli utenti.
- **Notifiche** di chi ti segue e dei sorpassi «solo da chi segui».

## Non ancora fatto

Rispetto a Figma mancano, perché servono altri dati: «+22 nell'ultima gara», «Prossima gara · ci siete tutti e due», «Le sue ultime gare», la riga del club, il filtro «Seguiti» nelle Classifiche.
