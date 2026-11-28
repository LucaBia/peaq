# Branch `Giometto`: riepilogo per Luca

Aggiornato al 28 novembre 2026.

## In breve

Pagine dell'app atleti prese da Figma, scritte con i tuoi componenti e il tuo stile. **Nessuna modifica a database, migrazioni, funzioni server, deploy o pannello admin.** `tsc`, 16 test e build passano. `main` è già dentro il branch.

## Cosa c'è

- **Accesso:** pagina `/welcome`, Apple e Google, registrazione e passi dell'onboarding con l'aspetto di Figma.
- **App:** Profilo nuovo, Eventi (gara pilota), Classifiche (montagna ed elenco), Impostazioni, Aiuto, FAQ, Regolamento, tutorial.
- **Spiegazioni:** rating, leghe, Tappa.
- **Pronte ma spente:** conferma presenza alla gara pilota (`PILOT_CONFIRM_OPEN`), seguire atleti (`SOCIAL_OPEN`), pagine legali (`LEGAL_PUBLISHED`).
- **Aspetto:** Kanit, blu e colori delle leghe solo nell'app atleti (`.theme-athlete`). In `ui.tsx` campi e pulsanti nuovi valgono solo dentro `AppFrame`: l'admin resta com'era.

## Cosa serve da te

1. **Apple e Google:** variabile di build `VITE_OAUTH_PROVIDERS=apple,google` su Cloudflare (i provider in Supabase sono già attivi).
2. **Gara pilota e conferma presenza:** tabella e funzioni proposte in `docs/07`.
3. **Classifica:** funzione `city_ranking` proposta in `docs/08`.
4. **Seguire atleti:** tabelle e funzioni proposte in `docs/10`.
5. **Da allineare** (`docs/09`): rating di partenza 300 nel codice contro 250 deciso; soglie XP delle Tappe; valori dei bonus XP.

## Da sapere

- Chi non è connesso arriva su `/welcome` invece che su `/auth`.
- La foto della gara pilota viene dal prototipo Figma: va sostituita prima di pubblicare.
- Non provati dal vivo: registrazione completa con un account nuovo, accesso con Apple e Google, pannello admin.
