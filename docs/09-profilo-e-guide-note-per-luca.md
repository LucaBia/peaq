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

## Non ancora fatto

Campanella delle notifiche, «I miei numeri» (statistiche), «Invita un amico», contatori di seguiti e follower; nelle Impostazioni mancano le righe che cambiano dati (dati personali, i miei sport, notifiche, privacy, cambia password, elimina account).
