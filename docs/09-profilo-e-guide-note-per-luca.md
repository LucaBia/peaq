# Profilo e pagine di spiegazione: note per Luca

Aggiornato al 28 novembre 2026.

## Cosa c'è nel codice

| File | Cosa fa |
|---|---|
| `src/routes/_authenticated/app.index.tsx` | Profilo: carica i dati come prima, poi mostra `ProfileScreen` |
| `src/components/app/Profile.tsx` | Profilo come in Figma (`1657:2295`): testata nel colore della lega con il numero di pettorale, card del rating con la scala delle leghe, card della Tappa, gare finite, prossime gare |
| `src/routes/_authenticated/app.rating.tsx`, `app.leagues.tsx`, `app.stage.tsx` | Pagine «Come funziona il rating», «Le leghe», «Tappa» |
| `src/components/app/Guides.tsx` | Grafica delle tre pagine |
| `src/lib/app/i18n.tsx` | Testi: blocchi `prof` e `guide`; «Livello» è diventato «Tappa» («Stage» in inglese) |
| `src/components/app/ui.tsx` | Aggiunto `BackHeader` (freccia indietro + titolo) |
| `src/lib/app/rating.ts` | Aggiunto `leagueRange` |

Il componente `Bib` non è più usato nel Profilo (resta nell'onboarding e nel tutorial). In alto nel Profilo c'è l'ingranaggio delle Impostazioni (`/app/settings`), dove sono finiti lingua ed esci; per gli admin resta lo scudo. Non ho toccato il database.

Aggiunti dopo, con la stessa struttura: `Settings.tsx` (Impostazioni, Lingua, Aiuto, FAQ, Regolamento), `Tutorial.tsx` (le sei pagine di «Come funziona PEAQ», usate da `IntroStep` e da `/how`), le pagine delle singole leghe in `Guides.tsx` e `/welcome`.

## Cose da allineare

- **Rating di chi salta la domanda**: nel codice `PROVISIONAL_BASELINE` è 300; la decisione del 18 novembre dice 250 (e 150 / 250 / 350 / 450 per le risposte «Non lo so»). Nella pagina del rating ho scritto solo «parte da quello che hai indicato alla registrazione», senza numeri.
- **Colori delle leghe**: l'ultimo commit li porta a quelli di Figma dentro `.theme-athlete`; le variabili globali `--league-*` (landing e admin) restano le tue.
- **XP per ogni Tappa**: nel codice c'è solo la Tappa 1 (200 XP). Servono le soglie delle altre Tappe; la decisione dice che dopo la prima gara si arriva subito alla Tappa 2.
- **Regole di gioco** (soglie, XP, premi): ora i testi sono in `i18n.tsx` e le soglie in `rating.ts`. La regola del progetto le vuole in un unico punto di configurazione con numero di versione, lato server.

## Registrazione e spiegazioni come in Figma (28 novembre, ultimo commit)

Solo aspetto e testi. Le chiamate a `athleteService` e `authService`, i controlli e l'ordine dei passi sono quelli di prima.

| Dove | Cosa cambia |
|---|---|
| `ui.tsx` | `Field`: etichetta piccola dentro il riquadro (72 px, raggio 24), solo dentro `AppFrame`; con `labelAbove` o fuori da `AppFrame` resta com'era. `PrimaryButton`: a pillola, il tipo `ghost` è un link blu, solo dentro `AppFrame`. `Progress`: una barra sola con riempimento nero. `Title`: più grande, va a capo dove c'è `\n` nel testo, `bars` mette le sei lineette colorate. `BottomBar` senza riga sopra. `LeagueBars` nuovo |
| `styles.css` | Dentro `.theme-athlete` i pesi di Kanit di Figma: testo Light, `font-medium` = Regular, `font-semibold` e `font-bold` = Medium |
| Accedi (A4) | Lineette, «Password dimenticata?» a destra in blu, il pulsante subito dopo i campi, poi Apple e Google |
| Password e verifica email (A5, A7) | Lineette, testi di Figma, «Torna all'accesso», «Invia di nuovo» come link (il conto alla rovescia resta) |
| `PersonalStep` (A8) | Tolta la «@» davanti al nome utente; genere e nazionalità affiancati |
| `DisciplineStep` (A9) | Tre card grandi senza icone; quella scelta ha il bordo nero spesso e la spunta |
| `NumberStep` (A8b) | Riquadro grande, «Sceglilo tu per me», tre righe di spiegazione |
| `PerformanceStep` (A9b) | Minuti e secondi grandi senza riquadro, 5 km / 10 km a pillola, W/kg grande. Stessi controlli (`isPlausibleRun`, `isPlausibleWkg`) |
| `DocumentsStep` (A9c) | Nota blu sulle gare amichevoli; certificato e tessera sono card chiuse che si aprono su «Carica» / «Aggiungi» e mostrano i tuoi campi. Dopo l'invio la card si richiude |
| `BibStep` + `Bib.tsx` (A12) | Pettorale bianco con logo, lega e sport in alto, numero al centro, nome sulla fascia ondulata nel colore della lega. Le misure seguono la larghezza (unità `cqw`). Tolta la riga «Lega · provvisorio» sotto il pettorale |
| `NotificationsStep` (A13) | Niente interruttori: «Attiva le notifiche» salva le tre preferenze a `true`, «Non ora» a `false` (stessa `saveNotifications`) |
| Tappa (B7) | Card scura con il numero grande, percorso dei premi con la linea, tabella «Come guadagnare XP» |
| Rating (B8) e tutorial | Montagne delle leghe a due toni, titoli su due righe |

Testi: `common.continue` ora è «Avanti» (è usato solo nella registrazione). Tolte le chiavi non più usate (`ob.n.sub`, `ob.n.permanent`, `ob.perf.run/bike/time/wkg/wkgHint`, `ob.bib.league/athlete`, `ob.notif.newEvents/lobby/results`, `guide.stage.earnNote`).

**Lasciato fuori da Figma, perché serve il database o una pagina che non c'è:** campo «Nome e cognome» (A8); scelta «Non lo so» con i km a settimana (A9b); casella del consenso alle foto (A9c); «Richiedila» per la tessera PEAQ (resta la tua card «In arrivo»); quarto avviso «qualcuno ti supera in classifica» (A13); card «Invita un amico» e riga dei mesi di fila (B7); la frase «da Impostazioni › I miei sport» (A9).

**Da confermare:** la tabella degli XP in Tappa riporta i valori di Figma B7, compresi tre che non sono nelle decisioni scritte: prima gara +100, promozione +150, partito ma non arrivato +30 (vedi `docs/06-decisioni-aperte.md`). In A9b Figma scrive «parti da 250, in Collina»: ho scritto solo «parti in Collina», perché nel codice il valore è 300.

## Impostazioni: documenti, notifiche, password (28 novembre)

Nessuna funzione nuova nel database: sono le stesse chiamate della registrazione.

- **`/app/documents`** (dalle righe «Certificato medico» e «Tessera»): certificato e tessera si aggiungono anche dopo la registrazione. Le card e i form sono usciti da `DocumentsStep` e stanno in `components/app/Documents.tsx` (`DocumentsForm`), usato sia dal passo 5 sia dalle Impostazioni: stesso `uploadDocument` / `removeDocument`.
- **`/app/notifications`**: i tre interruttori (`new_events`, `lobby_opening`, `results`), salvati a ogni tocco con `saveNotifications`. Aggiunto `athleteService.loadNotifications` (una `select` sulla riga dell'utente): **controlla che la policy di lettura sulla propria riga ci sia** anche nel tuo database.
- **Cambia password**: non c'è un form nuovo. La riga manda l'email di `authService.requestReset` all'indirizzo dell'account, poi si continua da `/reset-password` come per «Password dimenticata».
- **Pulsanti spenti**: nella registrazione il pulsante spento dice cosa manca («Scegli un nome utente», «Scegli uno sport», «Scegli un numero libero»…), con i colori della regola grafica (#4A4F5C su #EEF0F4), solo nell'app atleti.

## Non ancora fatto

Campanella delle notifiche, «I miei numeri» (statistiche), «Invita un amico», contatori di seguiti e follower; nelle Impostazioni mancano le righe che cambiano dati personali e sport, privacy ed elimina account (serve il database).
