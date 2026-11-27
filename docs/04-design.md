# Design: stili, regole e mappa delle schermate

Fonte: Figma, file `7upVVj7BL6fikDjYCEcSpX`. Stili salvati nel file come `PEAQ/…` e tavola «Stili e regole per Luca · 27 novembre» nella pagina «Componenti».

## Colori

| Nome | Valore | Uso |
|---|---|---|
| Testo/Primario | #000000 | testi principali |
| Testo/Secondario | #6B7080 | testi di supporto ed etichette (unico grigio) |
| Testo/Su colore | #FFFFFF | su blu, nero, Cresta, PEAQ, verde, rosso |
| Testo/Pulsante spento | #4A4F5C | |
| Fondo/Bianco | #FFFFFF | pagine e card |
| Fondo/Grigio | #F1F2F5 | binario Corsa/Bici, campi di ricerca |
| Fondo/Pulsante spento | #EEF0F4 | |
| Brand/Blu | #0C3EF2 | pulsanti principali, link, lega PEAQ |
| Brand/Inchiostro | #0A1F7A | titoli su fondi chiari colorati |
| Stato/Iscritto | #15803D | iscritto, in regola, sale |
| Stato/Errore | #B42318 | errori, annulla, scende (più scuro di Cresta) |
| Leghe | Valle #82D25A · Collina #F5C800 · Passo #F58214 · Cresta #E1232D · Vetta #3CB4F0 · PEAQ #0C3EF2 | |

Testo nel colore di una lega chiara su fondo bianco: usare la tonalità scura (Valle #3F7F1F, Collina #8A6D00, Passo #B35500, Vetta #0B7DB8).

Colori di stato degli eventi, uguali in tutte le viste: iscritto verde, esaurito rosso, lista d'attesa blu.

## Caratteri (Kanit)

| Stile | Dimensione e peso | Uso |
|---|---|---|
| Numero gigante | 80 · Black Italic | pettorale, giorno dei manifesti, Tappa |
| Titolo pagina | 28 · Regular | Profilo, Eventi, Classifiche |
| Titolo sezione | 22 · Medium | Prossime gare, Premi, Podio |
| Corpo grande | 18 · Regular | nomi nelle card, pulsanti |
| Corpo | 16 · Regular | testo normale |
| Corpo piccolo | 14 · Regular | righe secondarie, interruttori |
| Didascalia | 12 · Regular | note sotto le card |
| Etichetta | 11 · Medium, maiuscolo | etichette sopra i campi e stati (minimo assoluto) |

Il logo «peaq race» usa Arimo; la tastiera e la barra di stato del prototipo usano il carattere di sistema.

## Regole

1. Testo nero su Valle, Collina, Passo e Vetta; bianco solo su Cresta e PEAQ.
2. Contrasto minimo 4,5:1 per i testi (3:1 sopra i 24 pt).
3. Nessun testo sotto gli 11 pt.
4. Zona da toccare di almeno 44 × 44 pt anche se l'icona è più piccola (frecce indietro, caselle, invio della chat, filtri delle leghe, interruttori, pulsanti Segui).
5. Pulsanti con la sola iniziale maiuscola; in maiuscolo solo le etichette sopra i campi e gli stati brevi (ISCRITTO, ESAURITO).
6. Un pulsante spento dice cosa manca («Aggiungi il contatto e spunta le caselle»).
7. Corsa/Bici e Tutte/Corsa/Bici: binario grigio #F1F2F5, scelta in pillola nera con testo bianco, sempre uguale.
8. Il pettorale ha sempre il logo intero; la fascia in basso segue la linea della lega; il nome utente è bianco su Cresta e PEAQ, nero sulle altre.

## Mappa delle schermate principali (blocco italiano di «App Finale»)

Il blocco inglese ha gli stessi nomi dei frame. Per l'elenco completo (332 frame per lingua) usare Figma MCP `get_metadata` sulla pagina `1:142`.

| Area | Frame | Node id |
|---|---|---|
| Avvio | A1 – Splash · A2 – Splash Reach your peaq | 1485:555 · 1485:579 |
| Accesso | A3 Log in/Sign up · A4 Log in · A6 Sign up · A7 Verifica email · A5 Recupera password | 1485:784 · 1485:810 · 1485:870 · 1485:1042 · 1485:1143 |
| Registrazione | A8 – Crea il tuo Bib · A8 errori · A8b Scegli il numero | 1485:928 · 1765:989 · 1485:20131 |
| Sport e livello | A9 – Run / Bike · A9b How fast are you? (Run, Bike, Non lo so) | 1658:2954 · 1689:1737 · 1689:2007 · 1689:1947 |
| Certificato e tessera | A9c vuoto · Tessera PEAQ 1 Dati | 1485:20766 · 1690:1239 |
| Pettorale pronto, notifiche | A12 · A13 | 1485:976 · 1485:1113 |
| Tutorial | A15 1–6 (3 Lega, 4 Tappa) | 1485:19559 · 1485:19679 · 1810:999 |
| Profilo | B1 – Profilo · Run / Bike / nuovo iscritto / solo Run / Offline | 1657:965 · 1658:2994 · 1657:2295 · 1660:1317 · 1657:2392 |
| I miei numeri | B2 · Run / Bike | 1657:1114 · 1658:3142 |
| Le mie gare | B3 passate · prossime | 1657:1271 · 1658:2441 |
| Tappa | B7 – Tappa e XP · B7b Invita un amico | 1485:4831 · 1700:1191 |
| Rating e leghe | B8 Come funziona il rating · B2c Leghe · B2d Lega Valle…PEAQ | 1485:5039 · 1536:1091 · 1536:1207 |
| Altri atleti | B9 – Profilo atleta · segnala o blocca | 1485:5897 · 1806:1065 |
| Impostazioni | B4 · B4.2 Dati personali · B4.3 I miei sport · B4.11 Privacy · B4.13 FAQ | 1657:1414 · 1485:6363 · 1660:1461 · 1485:6828 · 1485:7512 |
| Notifiche | B5 | 1485:2173 |
| Eventi | C1 – Eventi (manifesti) · lista · Calendario · Cerca | 1657:1507 · 1658:1974 · 1657:1769 · 1657:1995 |
| Dettaglio evento | C2 – Dettaglio evento (biglietto) · C2b Chi partecipa · C2 Gara pilota | 1485:2811 · 1549:1091 · 1626:965 |
| Iscrizione e pagamento | C3 Conferma iscrizione · C4 Pagamento · C5 Iscritto · C7 Annulla | 1485:2888 · 1485:2961 · 1485:3012 · 1485:6227 |
| Lobby | D1 Chat · Briefing · Griglie Cresta aperta | 1485:3138 · 1485:3248 · 1485:21608 |
| Giorno di gara | D3 Ritiro pettorale · Gara in corso | 1485:5123 · 1764:1645 |
| Risultati | E1 Post-gara Night 10K · E1b Promozione · E2 Condividi · E3 Classifica gara · E5 Nuova posizione | 1485:3527 · 1536:1861 · 1485:3885 · 1485:3937 · 1485:12397 |
| Classifiche | E4 Montagna · elenco · scelta città | 1821:989 · 1657:2111 · 1485:10097 |
| Club | G1 Clubs · G3 Board · G4 Ranking · G7 Crea · W2 pagina web · W3 invito | 1658:2080 · 1485:23574 · 1485:23693 · 1658:2302 · 1485:23199 · 1485:23350 |

Admin (pagina `975:196`): F0 Dashboard 1174:876 · F1 Events 1038:80 · F2 Event details 1038:182 · F3 Athletes 1038:251 · F4 Waves 1039:80 · F5 Results 1039:151 · F5b Import 1175:803 · F7 Race day 1175:554 · F8 Users 1176:554 · F9 Payments 1176:918 · F19 Clubs 1447:610 · S1 Data model 1184:570 · S2 States 1184:657 · S3 Roles 1184:682.
