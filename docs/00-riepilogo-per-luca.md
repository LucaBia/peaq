# Branch `Giometto`: riepilogo per Luca

Aggiornato al 28 novembre 2026.

## In breve

Pagine dell'app atleti prese da Figma, scritte con i tuoi componenti e il tuo stile. Nel codice **nessuna modifica a migrazioni, funzioni server, deploy o pannello admin**; sul database sono state aggiunte tabelle e funzioni (vedi sotto). `tsc`, 19 test e build passano. `main` è già dentro il branch.

## Cosa c'è

- **Landing nuova** (`/`): rifatta con l'aspetto dell'app (bianco, Kanit, blu, colori delle leghe) e tutte le funzioni della v1. Il pulsante principale porta a `/signup`: **la lista d'attesa non c'è più** (la tabella `waitlist` resta, non la tocco). Sezioni in `src/components/peaq/`, testi in `src/lib/i18n.tsx`, animazioni con `useGsap`, come prima. Le tue sezioni vecchie sono nella cronologia. La sezione «L'app» mostra i componenti veri (`ProfileScreen`, `Rankings`, `EventsList`) con dati di esempio dentro tre telefoni, non immagini. Aggiunta `public/og.jpg` come anteprima dei link condivisi (indirizzo `https://peaqrace.com` scritto in `routes/index.tsx`).
- **Accesso:** pagina `/welcome`, Apple e Google, registrazione e passi dell'onboarding con l'aspetto di Figma.
- **App:** Profilo nuovo, Eventi (gara pilota), Classifiche (montagna ed elenco), Impostazioni (con documenti, notifiche e cambio password), Aiuto, FAQ, Regolamento, tutorial.
- **Spiegazioni:** rating, leghe, Tappa.
- **Pronte ma spente:** conferma presenza alla gara pilota (`PILOT_CONFIRM_OPEN`), seguire atleti (`SOCIAL_OPEN`), pagine legali (`LEGAL_PUBLISHED`).
- **Aspetto:** Kanit, blu e colori delle leghe solo nell'app atleti (`.theme-athlete`). In `ui.tsx` campi e pulsanti nuovi valgono solo dentro `AppFrame`: l'admin resta com'era.

## Database (28 novembre)

Con il tuo via libera sono stati eseguiti sul progetto Supabase di peaqrace.com gli script in `docs/sql/`: registro attività, conferma della gara pilota, classifica, seguire atleti, e la struttura per il resto della v1. **Leggi `docs/11-database-note-per-luca.md`**: non sono passati da Lovable né dalle migrazioni di Supabase.

## Cosa serve da te

1. **Rigenerare `types.ts`** e allineare Lovable: gli script sono già registrati tra le migrazioni di Supabase (`docs/11`).
2. **Apple e Google:** variabile di build `VITE_OAUTH_PROVIDERS=apple,google` su Cloudflare (i provider in Supabase sono già attivi).
3. **Admin:** nel database non c'è ancora nessun admin; serve la prima riga in `user_roles`.
4. **Da allineare** (`docs/09`): rating di partenza 300 nel codice e nel database contro 250 deciso; soglie XP delle Tappe; valori dei bonus XP.

## Da sapere

- Chi non è connesso arriva su `/welcome` invece che su `/auth`.
- La foto della gara pilota viene dal prototipo Figma: va sostituita prima di pubblicare.
- Le foto `sport-run.jpg` e `sport-bike.jpg` (card Corsa e Bici della landing, e foto di riserva degli eventi nell'app) sono provvisorie, messe da Giovanni: **non sappiamo di chi sono i diritti**, vanno sostituite prima di pubblicare.
- La landing presenta come parte di PEAQ anche funzioni non ancora nell'app (club, inviti, lobby, check-in con QR, pagamenti, lista d'attesa delle gare): scelta di Giovanni. La classifica mostrata è un esempio, con la scritta «Dati di esempio».
- Non provati dal vivo: registrazione completa con un account nuovo, accesso con Apple e Google, pannello admin, e i salvataggi dalle Impostazioni (caricare un documento, cambiare una notifica, inviare il link per la password).
