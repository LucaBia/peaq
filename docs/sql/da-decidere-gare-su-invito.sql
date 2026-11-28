-- PEAQ · NON ESEGUITO · proposta per Luca
-- Oggi una gara pubblicata la legge chiunque, anche senza accesso (policy "Published events are public" di events).
-- Con le colonne nuove meeting_point e briefing, una gara SU INVITO pubblicata mostrerebbe a tutti punto di ritrovo e briefing.
-- Questa riga le fa vedere solo a chi ha fatto l'accesso; per le gare normali non cambia niente.
-- Non eseguita perche' tocca una policy tua: decidi tu se va bene cosi' o se serve una lista di invitati.
alter policy "Published events are public" on public.events using (status = 'published' and (not invite_only or auth.uid() is not null));
