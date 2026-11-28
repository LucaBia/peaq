# PEAQ Race — contesto del progetto

PEAQ Race è un'app di gare brevi di **corsa e bici** organizzate da PEAQ in città (Milano e Padova all'inizio). Ogni atleta ha un **pettorale** (numero personale), un **rating** da 0 a 1000 per sport che sale o scende in base a chi batte, e una **lega** che dipende dal rating. Si parte sempre divisi per lega. Le **Tappe** (con gli XP) premiano la partecipazione. Ci sono classifiche per città e club.

- Proprietario e decisioni di prodotto: Giovanni Ometto («Giometto»). Sviluppo: Luca. Grafica e marchio: Betty.
- Lingua dell'interfaccia: italiano (v1), inglese pronto nel prototipo. Testi e commenti per il team in italiano.
- Documenti di dettaglio in `docs/`: leggerli prima di progettare una funzione.

@AGENTS.md
@docs/01-prodotto-e-regole.md
@docs/05-gara-pilota.md
@docs/06-decisioni-aperte.md

Da aprire quando servono (non importati per non riempire il contesto):
- `docs/02-perimetro-v1.md`: cosa entra nella v1 e cosa dopo, funzione per funzione.
- `docs/03-modello-dati-e-admin.md`: tabelle, stati, automazioni, pannello admin, ordine di costruzione.
- `docs/04-design.md`: colori, caratteri, regole grafiche e mappa delle schermate Figma con i node id.

## Fonti di verità

| Cosa | Dove |
|---|---|
| Schermate dell'app (v1) | Figma, file `7upVVj7BL6fikDjYCEcSpX`, pagina «App Finale» (`1:142`). Blocco italiano = frame con y ≥ 25000; blocco inglese identico sopra (y < 25000), stessi nomi dei frame |
| Pannello admin + note tecniche per Luca | Figma, pagina «Admin» (`975:196`): note gialle sotto ogni schermata, tavole S0–S3 |
| Colori, caratteri, regole | Figma, pagina «Componenti», tavola «Stili e regole per Luca · 27 novembre»; stili del file `PEAQ/…` |
| Cose da fare e decisioni | Notion, hub «Peaq Race»: «Scaletta – cose da fare», «Controllo dell'app · 21 novembre» |
| Perimetro v1 | Notion, database «Perimetro v1» (collection `d3ad0a3c-3add-48eb-9edb-b018134b25fa`) |
| Gara pilota | Notion, «Gara pilota · piano dell'evento» |

Link a un frame: `https://www.figma.com/design/7upVVj7BL6fikDjYCEcSpX/PEAQ?node-id=1657-965` (il node id con `-` al posto di `:`).

Se Figma e Notion sono collegati come server MCP, usa:
- Figma: `get_design_context` / `get_screenshot` con fileKey `7upVVj7BL6fikDjYCEcSpX` e il node id del frame (vedi `docs/04-design.md`).
- Notion: `fetch` sulle pagine sopra per le decisioni più recenti.

Quando Figma o Notion e questi file non sono d'accordo, valgono Figma (schermate) e Notion (decisioni), perché sono aggiornati più spesso. Segnala la differenza a Giovanni.

## Parole dell'app (usare sempre queste)

- **Lega**: Valle (0–199), Collina (200–349), Passo (350–499), Cresta (500–649), Vetta (650–799), PEAQ (800+). Soglie uguali in tutta Italia.
- **Rating**: numero 0–1000 per sport (corsa e bici separati). Non chiamarlo «punteggio» nell'interfaccia; nelle frasi brevi si usa «punti» («6 punti per superare MarcoT»).
- **Tappa** (in inglese «Stage»): il livello di partecipazione, sale con gli XP e non scende mai. Non usare «Livello».
- **Pettorale** (in inglese «Bib»): numero personale e permanente, colore della lega.
- **Nome utente**: è quello che vedono gli altri ovunque (es. «ElenaB»). Nome e cognome sono obbligatori ma si possono nascondere.
- Non usare «onda»: si parte «per lega».

## Regole di lavoro

- Git: si lavora solo sul branch `Giometto`. Mai fare commit, merge o push su `main`.
- **Push solo su richiesta.** Il branch `Giometto` è su GitHub e Luca può vederlo: a Giovanni va bene che il lavoro si veda. Decide però lui quando inviare: non fare `git push` (né aprire pull request) finché non lo chiede in modo esplicito. Se un'azione manderebbe qualcosa su GitHub o su Lovable, fermati e chiedi.
- **Commit spesso, in locale.** Dopo ogni passo che funziona fai un commit sul branch `Giometto` con un messaggio chiaro in italiano, così si può sempre tornare indietro. Prima di una modifica grossa controlla che non ci siano modifiche non salvate.
- **I commit nuovi esistono solo su questo Mac** finché non si fa push. Non cancellare né riscrivere commit locali; se Giovanni chiede una copia di sicurezza, proponi un push del branch `Giometto`.
- **Tenersi aggiornati con `main`.** Quando Giovanni lo chiede (o prima di un lavoro lungo, proponendolo), scarica le novità con `git fetch origin` e portale dentro `Giometto` con `git merge origin/main`. Questo non mostra niente a Luca. Mai usare rebase o force push (regola di Lovable in `AGENTS.md`). Se ci sono conflitti, spiegali in parole semplici prima di risolverli.
- **Attenzione al database.** L'app in locale può collegarsi allo stesso database online (Supabase) usato da Luca e dal sito pubblicato: i dati creati o cambiati in locale sarebbero visibili a tutti. Alla prima sessione verifica a quale database punta `.env` e dillo a Giovanni. Non creare utenti o dati di prova e non cambiare dati veri senza averlo avvisato; non mostrare mai le chiavi contenute in `.env`.
- **Giovanni non è uno sviluppatore.** Spiega cosa stai per fare e cosa hai fatto in italiano semplice, senza dare per scontati termini tecnici (branch, commit, push, merge vanno spiegati la prima volta). Prima di comandi che cancellano o sovrascrivono qualcosa, chiedi conferma.
- Il progetto è collegato a Lovable: rispettare le regole in `AGENTS.md` (niente riscrittura della cronologia già pubblicata, schema del database e migrazioni solo tramite Lovable).
- `docs/03-modello-dati-e-admin.md` è una proposta di progetto: lo schema reale è quello in `supabase/` e `drizzle/`.
- Non inventare regole di gioco: se una regola manca, chiedi o segnala come domanda aperta in `docs/06-decisioni-aperte.md`.
- Le regole di gioco (soglie, XP, rating, premi) stanno in un unico punto di configurazione con numero di versione; ogni gara salva la versione usata.
- Importi in centesimi, date in UTC, stati come elenchi chiusi sul server (vedi `docs/03-modello-dati-e-admin.md`).
- Pagamenti: il fornitore è la fonte di verità (webhook); nessun dato di carta nel nostro database.
- Ogni modifica lato server scrive nel registro attività.
- Accessibilità: testo minimo 11 pt, contrasto 4,5:1, zone da toccare almeno 44 × 44 pt, testo nero sulle leghe chiare (Valle, Collina, Passo, Vetta) e bianco su Cresta e PEAQ.
- Pulsanti con la sola iniziale maiuscola; un pulsante spento dice cosa manca.
