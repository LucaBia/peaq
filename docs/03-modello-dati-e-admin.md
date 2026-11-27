# Modello dati, stati e pannello admin

Copia delle tavole S0–S3 e delle note per Luca nella pagina Figma «Admin» (`975:196`), al 27 novembre 2026. I nomi di tabelle e campi sono indicativi: contano relazioni e dati che servono alle schermate. Importi in centesimi, date in UTC.

## Dieci scelte che semplificano il lavoro (S0)

1. Un solo backend: app e admin usano la stessa API; l'admin è un altro client con permessi diversi.
2. Admin con un framework per pannelli (es. Refine o React Admin). Su misura solo: Overview gara, partenze, giorno di gara, import risultati.
3. Gli stati sono elenchi chiusi sul server: le pagine li mostrano, non li calcolano.
4. Tutto ciò che succede a un orario è un job del server (tabella `event_jobs`), non un clic.
5. Registro attività da subito: ogni modifica passa dal server e scrive in `activity_log` (solo aggiunta).
6. Pagamenti: il fornitore è la fonte di verità; salviamo solo id e stato, aggiornati dal webhook.
7. Pubblicare i risultati è una transazione unica e ripetibile senza effetti doppi.
8. Regole di gioco lette da un solo punto, con numero di versione; ogni gara salva la versione usata.
9. Ambiente di prova con database e chiavi separati dal primo giorno.
10. Il check-in da telefono è la stessa web app in versione stretta, con coda offline.

## Ordine di costruzione

1. Schema dati, accesso admin, registro attività.
2. Gare: lista, form, stati, job automatici.
3. Iscrizioni e pagamenti: webhook, lista atleti, rimborsi.
4. Lobby e messaggio agli iscritti.
5. Partenze per lega.
6. Giorno di gara, anche da telefono.
7. Risultati: import del file, calcolo di rating e XP, pubblicazione.
8. Certificati e tessere (Checks), inviti e gare gratis.
Poi le pagine di priorità 2 e 3.

## Tabelle (S1)

- **users**: id, email, username (non modificabile, unico), first_name, last_name (obbligatori, visibilità a scelta), bib_number, birth_date, gender (facoltativo), nationality, city, sports[], certificati (atletica, ciclismo) con scadenza e stato, emergency_contact, xp (la Tappa si calcola), status, muted_until, notification_prefs, privacy (mostra nome e cognome), consenso foto, invite_code, invited_by, streak_months, created_at, last_seen_at.
- **user_sport_stats**: user_id, sport (run/bike), rating, league (calcolata), races_count, podiums_count, start_source (time / wkg / not_sure / skipped), start_answer.
- **rating_history**: user_id, sport, event_id, rating_before, rating_after, reason (race / correction / manual), note, created_at.
- **events**: id, name, sport, type, starts_at, city, meeting_point, distance_km, laps, elevation_m, route_url, price_cents, min/max_participants, registration_opens_at, registration_closes_at, description, cover_url, programma con orari, testo del briefing, status, rules_version, created_by.
- **waves** (partenze per lega): id, event_id, number, start_time, label (leghe), published_at.
- **registrations** (il centro di tutto): id, event_id, user_id, status, source (app/admin), rating_snapshot, wave_id, wave_manual, checked_in_at, bib_given, payment_id, offered_until, created_at, cancelled_at.
- **payments**: id, user_id, registration_id, provider_id, amount_cents, refunded_cents, method_label, status, created_at, updated_at. Nessun dato di carta.
- **results**: id, event_id, user_id, wave_id, status (finished/dnf/dns/dsq), finish_time_ms, position_wave, position_overall, rating_before, rating_after, xp_earned, version, published_at.
- **protests**, **lobby_messages** (is_announcement, pinned, hidden), **message_reports**, **notifications** + **notification_templates**, **promo_codes** (dopo), **content_pages**, **game_rules** (config JSON versionato), **event_jobs**, **admin_users**, **activity_log**, catalogo (cities, race_types).
- **memberships** (tessere): user_id, type (peaq/other), number, valid_until, status, dati anagrafici solo per la tessera PEAQ.
- **invites**: inviter_id, invited_user_id, status (signed_up/raced/credited), created_at.
- **race_credits** (gare gratis e metà prezzo): user_id, source (invite / level_reward / invited_first_race), kind (free/half_price), used_registration_id, expires_at.
- **reserved_numbers** (1–100): number, status (free/held/given), user_id, reason. I numeri da 101 a 9999 li sceglie l'atleta.
- **clubs**, **club_members** (un club per utente; ruoli captain/vice/og/member), **club_join_requests**, **club_posts**, **club_scores**.
- Mancano ancora: follows, foto della gara (galleria per gara), consensi.

Relazioni principali: users 1—N registrations N—1 events · events 1—N waves · registrations 1—1 payments · events 1—N results N—1 users · users 1—N rating_history · events 1—N lobby_messages · events 1—N event_jobs.

## Stati (S2)

- **events**: draft → published → registrations_open → lobby_open → race_day → results_published → archived; cancelled da qualunque stato prima di race_day.
- **registrations**: pending_payment → confirmed → checked_in → finished | dnf; dns (confermato senza check-in); cancelled_by_user; cancelled_event; lista d'attesa waiting → offered → confirmed | expired (offerta 12 h).
- **payments**: pending → paid | failed; paid → to_refund → refunded. Cambia solo dal webhook.
- **results**: preview → published → corrected (la vecchia versione resta).
- **users**: active → warned → muted → suspended; deleted = dati personali rimossi, risultati anonimi.
- Altri: protests, support, notifications, message_reports, event_jobs, memberships, certificati, invites.

## Automazioni di una gara (T = partenza)

- Data di apertura: iscrizioni aperte (prima per chi ha i premi delle Tappe 3 e 15).
- T − 24 h: chiudono le iscrizioni; controllo del minimo (se sotto: annullata, rimborsi, push ed email); apre la lobby con le partenze pubblicate.
- Fine cancellazione gratuita: T − 48 h (T − 24 h dalla Tappa 6).
- T − 45 min: apre il check-in.
- T + 3 h circa: promemoria per importare i risultati.
- T + 24 h: chiude la chat della lobby.
- Risultati pubblicati: inviti → raced e premi a chi ha invitato; classifiche e serie aggiornate; push di sorpasso (massimo 3 a settimana).
- Lunedì 9:00 riepilogo; primo del mese +50 XP a chi ha gareggiato nel mese finito.

## Note principali del pannello admin

- **Risultati**: import di CSV/XLSX con abbinamento colonne e controlli (pettorale non iscritto, tempo mancante, assenti, duplicati), anteprima con rating e XP calcolati, pubblicazione idempotente.
- **Partenze**: alla chiusura delle iscrizioni il server crea i gruppi per lega dal rating_snapshot, unisce quelli sotto 5 con il vicino, partenze ogni 2 minuti; spostamenti manuali tracciati.
- **Giorno di gara**: check-in, annulla, DNF, DNS; export della lista di partenza; da telefono funziona offline.
- **Correzioni**: nuova versione del risultato; proposta: si ricalcola solo quella gara.
- **Utenti**: ricerca, sospensione, rettifica manuale del rating con motivo, export e cancellazione dei dati (GDPR).
- **Notifiche**: messaggio agli iscritti di una gara (priorità 1), automatiche su modelli, ore di silenzio 22–08.
- **Ruoli**: in v1 solo Admin (Giovanni, Luca) e Content (Betty); il controllo è sul server per ogni azione.
- **Checks**: approvazione di certificati e tessere entro 24 h; la tessera PEAQ si attiva con la prima iscrizione pagata.
