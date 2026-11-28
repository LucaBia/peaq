-- PEAQ · blocco 5 · le gare su invito pubblicate le vede solo chi ha fatto l'accesso
-- Prima una gara pubblicata la leggeva chiunque, anche senza accesso. Con le colonne nuove meeting_point e briefing,
-- una gara SU INVITO pubblicata avrebbe mostrato a tutti punto di ritrovo e briefing.
-- Cambia solo la condizione della policy esistente di events; per le gare normali non cambia niente.
alter policy "Published events are public" on public.events using (status = 'published' and (not invite_only or auth.uid() is not null));
