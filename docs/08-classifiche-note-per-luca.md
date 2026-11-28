# Classifiche: note per Luca

Aggiornato al 28 novembre 2026. Riguarda la pagina Classifiche dell'app (`/app/rankings`): vista «montagna» (quella che si apre) e vista «elenco».

## Cosa c'è nel codice

| File | Cosa fa |
|---|---|
| `src/routes/_authenticated/app.rankings.tsx` | Carica atleta, città e classifica, poi mostra `Rankings` |
| `src/components/app/Rankings.tsx` | Testata con l'interruttore montagna/elenco e la vista elenco: card «La tua posizione», prossimo da battere, filtro per lega, podio, elenco |
| `src/components/app/RankingsMountain.tsx` | Vista montagna (Figma `1821:989`): le sei leghe una sotto l'altra, gli atleti sul sentiero, scheda in basso con «Torna a me» |
| `src/lib/app/rankings.ts` | Tipi `RankEntry` e `RankMe`; `rankingsService.city()` che oggi restituisce un elenco vuoto |
| `src/lib/app/rating.ts` | Aggiunti `LEAGUE_FLOOR` (soglie delle leghe), `nextLeague`, `leagueInk` |
| `src/components/app/ui.tsx` | Aggiunto `Segmented` (binario grigio con pillola nera), usato anche in Eventi |
| `src/lib/app/i18n.tsx` | Testi: blocco `rank`, italiano e inglese |

Non ho toccato database, migrazioni né pannello admin.

## Stato di oggi

Nessuno ha ancora corso una gara, quindi la pagina mostra lo stato «prima della gara pilota» di Figma (frame `1658:2718`): card nel colore della lega con «#— non ancora in classifica», podio vuoto, la riga dell'atleta e il pulsante «Vedi la gara pilota».

La parte con i dati (posizione, rating, punti alla lega successiva, prossimo da battere, filtro per lega, podio, elenco) è già scritta e provata con dati finti: si accende da sola quando `rankingsService.city()` restituisce delle righe.

## Cosa serve dal database

Oggi ogni atleta può leggere solo il proprio rating (RLS su `athlete_ratings`). Serve una funzione che restituisca la classifica di una città senza aprire le tabelle. Proposta:

```sql
create or replace function public.city_ranking(_discipline text, _city_id text)
returns table (user_id uuid, username text, rating integer, league text, rank bigint)
language sql stable security definer set search_path = public as $$
  select p.user_id, p.username, r.rating, r.league,
         rank() over (order by r.rating desc) as rank
  from public.athlete_ratings r
  join public.athlete_profiles p on p.user_id = r.user_id
  where r.discipline = _discipline
    and p.city_id = _city_id
    and p.onboarding_completed_at is not null
    and r.placement_races_completed > 0   -- in classifica solo dopo la prima gara
  order by r.rating desc
  limit 200;
$$;
revoke execute on function public.city_ranking(text, text) from public, anon;
grant execute on function public.city_ranking(text, text) to authenticated;
```

Espone solo nome utente, rating e lega, che sono pubblici per regola di prodotto. Poi in `rankingsService.city()` basta chiamare `supabase.rpc("city_ranking", …)` e mappare le righe su `RankEntry`.

Da decidere insieme: se «ha corso almeno una gara» va letto da `placement_races_completed` o da `athlete_progression.events_completed`; paginazione oltre i 200; chi ha bloccato chi.

## Non ancora fatto

- Nella montagna: filtro «Seguiti», variazioni di posizione, e la lunghezza delle leghe in proporzione agli atleti (ora ogni lega mostra al massimo quattro o cinque atleti).
- Schede Atleti/Club e classifica dei club (i club non esistono ancora nell'app).
- Filtro «Seguiti» (seguire altri atleti non esiste ancora).
- Scelta della città: oggi si vede solo la propria.
- Variazione di posizione («▲ 4», «14 in 30 giorni»): serve lo storico del rating.
- Profilo degli altri atleti toccando una riga.

## Differenze volute rispetto a Figma

- La montagna è ridisegnata in SVG, più semplice di quella di Figma (niente alberi né punte di neve sulle leghe).
- Le soglie delle leghe in `LEAGUE_FLOOR` servono solo a scrivere «38 punti a Vetta»: la lega la decide sempre il server.
