# Database: cosa è stato creato il 28 novembre (note per Luca)

Giovanni, con il tuo via libera, ha fatto eseguire quattro script sul progetto Supabase **Peaq** (`fojkkqefafmfkalyjabp`, quello di peaqrace.com) dall'editor SQL. Sono in `docs/sql/`, nell'ordine in cui sono stati eseguiti, identici carattere per carattere (controllato con l'impronta SHA-256 prima di ogni esecuzione).

**Non sono passati da Lovable né dall'elenco delle migrazioni di Supabase**: nella pagina Migrations vedi ancora solo le tue due. Se vuoi tenerle allineate, registra questi quattro file come migrazioni e rigenera `src/integrations/supabase/types.ts`. Finché non lo fai, l'app chiama le funzioni nuove con un piccolo aiuto senza tipi (`src/lib/app/rpc.ts`).

Al momento dell'esecuzione il database era quasi vuoto: 1 utente non confermato, nessun profilo, nessun evento, nessun admin. **Il progetto non ha backup** (piano gratuito).

## Cosa c'è ora

| Script | Cosa crea | Usato dall'app |
|---|---|---|
| `01-registro-pilota-classifica.sql` | `activity_log` + `log_activity` (interna); `pilot_confirmations` con `my_pilot_start`, `confirm_pilot_presence`, `cancel_pilot_presence`, `admin_list_pilot_confirmations`; `city_ranking` | Sì: `events.ts`, `rankings.ts` |
| `02-seguire-atleti.sql` | `follows`, `athlete_blocks`, `athlete_reports` con le funzioni segui / smetti, conteggi, elenchi, ricerca, profilo pubblico, segnala, blocca | Sì: `social.ts` |
| `02b-permessi-espliciti.sql` | Toglie i permessi che Supabase dà di suo ad `anon` e `authenticated` sulle cinque tabelle sopra | — |
| `03-struttura-v1.sql` | 17 tabelle per il resto della v1 (`game_rules`, `event_waves`, `registrations`, `payments`, `race_credits`, `results`, `rating_history`, `event_jobs`, `lobby_messages`, `clubs`, `club_members`, `club_join_requests`, `club_posts`, `content_reports`, `invite_codes`, `invites`, `reserved_numbers`) e 13 colonne facoltative in più su `events` | No: solo struttura |

Regole seguite, le stesse delle tue tabelle: RLS su tutto, l'app legge solo le proprie righe (o quelle pubbliche), nessuna scrittura diretta, scritture solo da funzioni `security definer` che registrano in `activity_log`. Stati come elenchi chiusi, importi in centesimi, date in UTC.

**L'unica cosa tua toccata è `events`**: 13 colonne aggiunte, tutte facoltative o con valore di partenza (`image_path`, `invite_only`, `price_cents`, `format`, `distance_m`, `laps`, `lap_m`, `min_participants`, `meeting_point`, `briefing`, `registration_opens_at`, `registration_closes_at`, `rules_version`). `starts_at` è rimasto obbligatorio, quindi il tuo pannello admin funziona come prima.

## Come è stato provato

Una prova a secco nell'editor SQL: due atleti finti creati dentro un blocco che alla fine solleva un errore apposta, così tutto viene annullato. Verificato: conferma, cambio partenza e annullo della gara pilota; partenza non valida rifiutata; classifica; ricerca; segui e conteggi; profilo pubblico; blocco (chi è bloccato non vede più l'altro e non può seguirlo); segnalazione senza doppioni; elenco admin vietato a chi non è admin; visitatori senza accesso; sei righe nel registro. Dopo la prova il database era come prima.

**Non provato dal vivo dall'app**: in locale `.env` punta ancora al vecchio progetto di Lovable. Per questo nel codice `SOCIAL_OPEN` e `PILOT_CONFIRM_OPEN` sono ancora `false`.

## Cosa manca per dire «v1 pronta»

- **Flussi sopra la struttura del blocco 3**: iscrizione a una gara, lista d'attesa, crediti, club, inviti, lobby. Servono funzioni e schermate; alcune aspettano decisioni (fornitore dei pagamenti, come usare la gara gratis).
- **Risultati → rating e XP**: le tabelle ci sono, il calcolo no. I parametri del rating non sono decisi; `game_rules` è vuota apposta.
- **Gara pilota nel database**: resta scritta nel codice finché non c'è la data (`starts_at` è obbligatorio).
- **Pannello admin**: elenco dei confermati alla gara pilota (la funzione c'è), segnalazioni, registro attività.

## Da guardare tu

- Le tue tabelle (`athlete_profiles`, `athlete_private`, `athlete_ratings`…) hanno ancora il permesso di lettura per `anon` che Supabase dà di suo: oggi le protegge solo la RLS, che è scritta bene (`to authenticated`). Se vuoi due protezioni come sulle tabelle nuove: `revoke all on … from anon;`.
- Rating di partenza: 300 nel database (`athlete_ratings.rating default 300`) contro 250 deciso.
