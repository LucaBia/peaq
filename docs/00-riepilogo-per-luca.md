# Branch `Giometto`: riepilogo per Luca

Aggiornato al 28 novembre 2026. Tutto quello che c'è nel branch rispetto a `main`, in ordine, con cosa ti serve fare per portarlo dentro. I dettagli sono nelle note `07`, `08` e `09`.

## In una riga

Pagine nuove dell'app atleti prese da Figma («App Finale»), scritte con i tuoi componenti e il tuo stile. **Nessuna modifica a database, migrazioni, pannello admin, funzioni server o deploy.** `bunx tsc --noEmit`, `bun run test` (16 test) e `bun run build` passano.

## I commit, dal più vecchio

| Commit | Cosa fa | File tuoi toccati |
|---|---|---|
| Registrazione e accesso con Apple e Google | Pulsanti «Continua con Apple / Google» in Accedi e Registrati | `auth.tsx`, `signup.tsx` (+1 riga), `confirm.tsx` (messaggio se l'accesso fallisce), `lib/app/auth.ts`, `.env.example` |
| Bozze di Privacy, Termini e Cookie | Solo `docs/legale/`, da non pubblicare | nessuno |
| Pagina Eventi con la gara pilota | Lista a manifesti e dettaglio a biglietto | `app.events.tsx` (riscritta) |
| Pagina Classifiche (elenco) | Stato «prima della gara pilota», pronta per i dati | `app.rankings.tsx` (riscritta), `rating.ts` (+3 costanti), `ui.tsx` (+`Segmented`) |
| Profilo nuovo, pagine di spiegazione, conferma presenza | Profilo come in Figma, `/app/rating`, `/app/leagues`, `/app/stage` | `app.index.tsx` (ora carica i dati e mostra `ProfileScreen`), `ui.tsx` (+`BackHeader`) |
| Testi: le parole di PEAQ | Solo testi in `i18n.tsx` e una parola nella landing | nessun codice |
| Tutorial in sei pagine | Le slide sono in `components/app/Tutorial.tsx` | `onboarding/IntroStep.tsx` (ora passa i dati a `Tutorial`) |
| Pagina di benvenuto | `/welcome` prima di Accedi | `_authenticated/route.tsx`, `auth.tsx`, `signup.tsx` (1 riga ciascuno: il rimando) |
| Impostazioni, Lingua, Aiuto, FAQ, Regolamento | `/app/settings`, `/app/language`, `/app/help`, `/app/faq`, `/app/rules`, `/how` | `app.index.tsx` (ingranaggio al posto di lingua ed esci) |
| Pagine delle singole leghe | `/app/leagues/:lega` | nessuno |
| Classifiche: vista montagna | Interruttore montagna/elenco | nessuno |
| Seguire atleti, ricerca, profili | `/app/athletes`, `/app/athletes/:userId`: **spenti** finché non c'è il database. Nel Profilo i contatori Gare / Follower / Seguiti sono già visibili, a zero | `app.tsx` (la scheda Profilo resta accesa nelle sue sottopagine) |
| Pagine Privacy, Termini e Cookie | `/privacy`, `/termini`, `/cookie`: leggono i testi da `docs/legale/`. **Non pubbliche** finché `LEGAL_PUBLISHED` è false (in produzione rimandano alla home; in locale si vedono con la scritta «Bozza») | `signup.tsx` (+1 riga: i link, nascosti finché non sono pubbliche) |
| Aspetto di Figma | Kanit, blu, colori delle leghe, solo nell'app atleti | `styles.css` (+1 blocco), `__root.tsx` (Kanit nel link dei font), `ui.tsx` (classe `theme-athlete`), `Bib.tsx` (colore del testo sulla fascia) |

Il commit «Aspetto di Figma» è separato apposta: se preferisci l'aspetto di prima basta annullarlo, il resto non cambia. (In ordine di tempo «Seguire atleti» viene dopo.)

## Come è scritto

- Pagine in `src/routes/_authenticated/app.*.tsx`, sottili: caricano i dati e passano tutto a un componente in `src/components/app/` (`Events`, `Rankings`, `RankingsMountain`, `Profile`, `Guides`, `Settings`, `Tutorial`).
- Tutti i testi in `src/lib/app/i18n.tsx`, italiano e inglese.
- Stessa chiave di cache `["athlete", user.id]` del Profilo: le pagine nuove non fanno richieste in più.
- Le pagine di dettaglio usano il nome `xxx_.$id.tsx` per restare sorelle della lista e tenere la barra delle schede.

## Cosa serve da te

1. **Accesso con Apple e Google.** In Supabase (progetto di peaqrace.com) i due provider sono già attivi, configurati da Giovanni. Per mostrare i pulsanti va aggiunta la variabile di build `VITE_OAUTH_PROVIDERS=apple,google` su Cloudflare. Senza, i pulsanti non compaiono. Il secret di Apple scade il 30 maggio 2027.
2. **Gara pilota nel database** e **conferma della presenza**: proposte in `docs/07-eventi-note-per-luca.md`. Finché non ci sono, la gara è scritta nel codice e il pulsante di conferma è spento (`PILOT_CONFIRM_OPEN`). Il codice chiama già le tre funzioni con i nomi proposti: create quelle, basta accendere l'interruttore.
3. **Classifica con i nomi**: funzione `city_ranking` proposta in `docs/08-classifiche-note-per-luca.md`. Elenco e montagna la usano già, basta collegarla in `rankingsService.city()`.
4. **Seguire altri atleti, ricerca e profili**: tabelle e funzioni proposte in `docs/10-seguire-atleti-note-per-luca.md`. Le schermate sono pronte e spente (`SOCIAL_OPEN`).
5. **Da allineare** (`docs/09-profilo-e-guide-note-per-luca.md`): rating di partenza 300 nel codice contro 250 deciso, soglie XP delle Tappe, regole di gioco lato server.

## Cose da sapere

- Chi non è connesso ora arriva su `/welcome` invece che su `/auth`; dopo «Esci» si torna lì.
- La foto della gara pilota (`src/assets/event-pilot.jpg`) viene dal prototipo Figma: va sostituita prima di pubblicare.
- FAQ e tutorial dicono solo quello che l'app fa oggi: le risposte di Figma su annullamenti, rimborsi, lobby e chip tornano quando ci sono quelle funzioni (Figma `1485:7512`). Il Regolamento è scritto per la gara pilota e non è ancora stato visto dall'avvocato.
- Aiuto non mostra un indirizzo email: manca ancora quello di assistenza.
- Le pagine le ho provate con un atleta finto, non da utente connesso: in locale il database è ancora quello vecchio di Lovable.
