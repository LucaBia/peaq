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

## Conferma della presenza alla gara pilota

La parte visiva è fatta e provata con dati finti: pulsante «Conferma la presenza», foglio con le tre partenze (Valle, Collina, Passo), card verde «Presenza confermata · Parti con Collina», pulsanti «Cambia partenza» e «Annulla la presenza».

**Nell'app è spenta**: `PILOT_CONFIRM_OPEN = false` in `src/lib/app/events.ts`, e il pulsante dice «Conferme aperte quando c'è la data». Niente viene salvato, perché nel database non c'è ancora dove.

Per accenderla servono tre cose, poi basta collegarle a `pilotService` (stesso file) e mettere `PILOT_CONFIRM_OPEN = true`:

```sql
create table public.pilot_confirmations (
  user_id uuid primary key references public.athlete_profiles(user_id) on delete cascade,
  start_league text not null check (start_league in ('valle','collina','passo')),
  confirmed_at timestamptz not null default now()
);
alter table public.pilot_confirmations enable row level security;
grant select on public.pilot_confirmations to authenticated;
create policy "Own confirmation read" on public.pilot_confirmations for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- Conferma o cambia partenza: massimo 40 posti.
create or replace function public.confirm_pilot_presence(_start text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if _start not in ('valle','collina','passo') then raise exception 'invalid_start'; end if;
  if not exists (select 1 from public.pilot_confirmations where user_id = auth.uid())
     and (select count(*) from public.pilot_confirmations) >= 40 then raise exception 'full'; end if;
  insert into public.pilot_confirmations (user_id, start_league) values (auth.uid(), _start)
  on conflict (user_id) do update set start_league = excluded.start_league;
end $$;

create or replace function public.cancel_pilot_presence()
returns void language sql security definer set search_path = public as $$
  delete from public.pilot_confirmations where user_id = auth.uid();
$$;
```

Da decidere con Giovanni:
- **Chi può confermare**: chiunque abbia un account (proposta sopra, gli inviti si fanno a voce) oppure solo una lista di invitati.
- **Rating di partenza dalla partenza scelta**: proposta Valle 150, Collina 250, Passo 350 (`docs/05-gara-pilota.md`).
- Elenco dei confermati nel pannello admin, con la partenza scelta e il numero di pettorale.

## Differenze volute rispetto a Figma

- Caratteri e colori di Figma arrivano con l'ultimo commit del branch (`.theme-athlete` in `styles.css`); senza quello le pagine restano con Archivo, Anton e i pulsanti neri.
- Dati della gara secondo il piano del 27 novembre (eliminazione a giri, tre partenze per lega, 40 posti), non quelli vecchi di Figma (10 giri, tutte le leghe insieme, 25 posti).
- Niente programma con gli orari finché non c'è la data.
