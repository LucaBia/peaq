# Database: cosa è stato creato il 28 novembre (note per Luca)

Giovanni, con il tuo via libera, ha fatto eseguire sei script sul progetto Supabase **Peaq** (`fojkkqefafmfkalyjabp`, quello di peaqrace.com) dall'editor SQL. Sono in `docs/sql/`, nell'ordine in cui sono stati eseguiti, identici carattere per carattere (controllato con l'impronta SHA-256 prima di ogni esecuzione).

**Non sono passati da Lovable.** Nell'elenco delle migrazioni di Supabase invece ci sono: dopo l'esecuzione sono stati registrati a mano in `supabase_migrations.schema_migrations`, uno per file, con il testo identico (nomi `peaq_activity_log_pilot_city_ranking`, `peaq_follows_blocks_reports`, `peaq_explicit_grants`, `peaq_v1_structure`, `peaq_security_review_fixes`, `peaq_invite_only_events_policy`; la versione è l'ora della registrazione, 28 novembre 19:10 UTC, non quella dell'esecuzione). **`src/integrations/supabase/types.ts` è stato rigenerato** il 28 novembre dalla pagina «Generating types» della dashboard (pulsante «Generate and download types»): contiene le 34 tabelle e tutte le funzioni, più lo schema `graphql_public` che la dashboard aggiunge sempre. `src/lib/app/rpc.ts` ora controlla i nomi delle funzioni sui tipi; se preferisci le chiamate dirette `supabase.rpc(...)` si può togliere.

Al momento dell'esecuzione il database era quasi vuoto: 1 utente non confermato, nessun profilo, nessun evento, nessun admin. **Il progetto non ha backup** (piano gratuito).

## Cosa c'è ora

| Script | Cosa crea | Usato dall'app |
|---|---|---|
| `01-registro-pilota-classifica.sql` | `activity_log` + `log_activity` (interna); `pilot_confirmations` con `my_pilot_start`, `confirm_pilot_presence`, `cancel_pilot_presence`, `admin_list_pilot_confirmations`; `city_ranking` | Sì: `events.ts`, `rankings.ts` |
| `02-seguire-atleti.sql` | `follows`, `athlete_blocks`, `athlete_reports` con le funzioni segui / smetti, conteggi, elenchi, ricerca, profilo pubblico, segnala, blocca | Sì: `social.ts` |
| `02b-permessi-espliciti.sql` | Toglie i permessi che Supabase dà di suo ad `anon` e `authenticated` sulle cinque tabelle sopra | — |
| `04-correzioni-dopo-revisione.sql` | Correzioni dopo una rilettura di sicurezza: conferma della gara pilota **chiusa anche sul database** (`revoke execute`), iscrizioni e risultati non si cancellano più a cascata con la gara, ordine delle liste, `unblock_athlete`, lettura dei propri blocchi, conteggi nascosti a chi è bloccato, un solo risultato pubblicato per atleta e gara, un solo capitano per club | Sì: `social.ts` |
| `05-gare-su-invito.sql` | Cambia la condizione della tua policy «Published events are public»: le gare **su invito** pubblicate le vede solo chi ha fatto l'accesso (prima anche i visitatori, che avrebbero letto `meeting_point` e `briefing`). Per le gare normali non cambia niente. **È l'unica modifica a un oggetto tuo oltre alle colonne di `events`**: se preferivi una lista di invitati, si rifà | — |
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

- **Aprire le conferme della gara pilota**: `grant execute on function public.confirm_pilot_presence(text) to authenticated;` e `PILOT_CONFIRM_OPEN = true` in `src/lib/app/events.ts`. Chiunque abbia finito la registrazione può confermare (scelta di Giovanni), massimo 40.
- `has_role(uuid, app_role)` è eseguibile anche da `anon`: chiunque può chiedere se un certo id è admin. Se non ti serve: `revoke execute on function public.has_role(uuid, public.app_role) from public, anon;` (controlla prima che le policy per `anon` non la usino).
- Non ci sono limiti di frequenza su segui, blocca e segnala: il registro attività potrebbe riempirsi con chiamate ripetute.

- Le tue tabelle (`athlete_profiles`, `athlete_private`, `athlete_ratings`…) hanno ancora il permesso di lettura per `anon` che Supabase dà di suo: oggi le protegge solo la RLS, che è scritta bene (`to authenticated`). Se vuoi due protezioni come sulle tabelle nuove: `revoke all on … from anon;`.
- Rating di partenza: 300 nel database (`athlete_ratings.rating default 300`) contro 250 deciso.
