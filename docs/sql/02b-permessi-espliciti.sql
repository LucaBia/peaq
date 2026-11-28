-- PEAQ · blocco 2b · permessi espliciti sulle tabelle dei blocchi 1 e 2
-- Supabase dà di suo tutti i permessi sulle tabelle nuove ad anon e authenticated, e a proteggerle resta solo la RLS.
-- Qui li tolgo e lascio solo la lettura dove serve: due protezioni invece di una.
begin;
revoke all on public.follows, public.athlete_blocks, public.athlete_reports, public.activity_log, public.pilot_confirmations from anon, authenticated;
grant select on public.athlete_reports, public.activity_log, public.pilot_confirmations to authenticated;
commit;
