# Eventi: note per Luca

Aggiornato al 28 novembre 2026. Riguarda la pagina Eventi dell'app (`/app/events`) e il dettaglio di una gara (`/app/events/:id`).

## Cosa c'è nel codice

| File | Cosa fa |
|---|---|
| `src/routes/_authenticated/app.events.tsx` | Lista: gara pilota + eventi `published` del database |
| `src/routes/_authenticated/app.events_.$eventId.tsx` | Dettaglio. `events_` = pagina sorella della lista, non annidata |
| `src/components/app/Events.tsx` | Grafica: `EventsList` (filtro Tutte/Corsa/Bici, manifesti) e `EventDetail` (biglietto) |
| `src/lib/app/events.ts` | Tipo `AppEvent`, lettura dal database, gara pilota (`pilotEvent`) |
| `src/lib/app/i18n.tsx` | Testi: `ev` (generici) e `pilot` (gara pilota), italiano e inglese |
| `src/assets/event-pilot.jpg` | Foto provvisoria, presa dal prototipo Figma: da sostituire con una foto vera |

Non ho toccato database, migrazioni, pannello admin, `app.tsx` né i colori e i caratteri dell'app.

## Perché la gara pilota è scritta nel codice

La tabella `events` oggi non può contenerla: `starts_at` è obbligatorio (la data non c'è ancora) e mancano i campi qui sotto. Per questo `pilotEvent()` la costruisce nel codice, con id fisso `gara-pilota`, e la lista la mette davanti agli eventi del database.

Quando la tabella avrà questi campi basta pubblicare la gara dal pannello admin e cancellare `pilotEvent`, `PILOT_EVENT_ID` e il blocco `pilot` di i18n.

## Campi che servono nella tabella `events`

| Campo | Tipo proposto | A cosa serve |
|---|---|---|
| `starts_at` | diventa facoltativo (`null` = «Data da definire») | gare annunciate senza data |
| `image_path` | `text` | foto del manifesto (oggi: una foto fissa per sport) |
| `invite_only` | `boolean default false` | bollino «Su invito» |
| `price_cents` | `integer default 0` | «Gratis» o prezzo (importi in centesimi) |
| `format` | `text` chiuso: `classic`, `elimination` | formato di gara |
| `distance_m`, `laps`, `lap_m` | `integer` | distanza, giri, lunghezza del giro |
| `leagues` | `text[]` | leghe o partenze previste |

Mancano anche, per i bollini «Iscritto» ed «Esaurito» dei manifesti: una tabella delle iscrizioni e il numero di iscritti per gara.

## Pulsante «Conferma la presenza»

Per ora è spento e dice «Conferme aperte quando c'è la data». Quando ci sarà la data servirà una funzione nel database (stile `claim_bib`) che salvi la conferma e la partenza scelta (Valle, Collina o Passo), più l'elenco degli invitati.

## Differenze volute rispetto a Figma

- Caratteri e colori sono quelli dell'app di oggi (Archivo e Anton, pulsanti neri), non Kanit e blu come in Figma: cambiarli riguarda tutta l'app e il logo non è ancora scelto.
- Dati della gara secondo il piano del 27 novembre (eliminazione a giri, tre partenze per lega, 40 posti), non quelli vecchi di Figma (10 giri, tutte le leghe insieme, 25 posti).
- Niente programma con gli orari finché non c'è la data.
