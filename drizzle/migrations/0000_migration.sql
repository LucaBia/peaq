CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  discipline text,
  locale text NOT NULL DEFAULT 'it',
  consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_email_unique UNIQUE (email),
  CONSTRAINT waitlist_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254),
  CONSTRAINT waitlist_discipline_check CHECK (discipline IS NULL OR discipline IN ('running','cycling','both')),
  CONSTRAINT waitlist_locale_check CHECK (locale IN ('it','en')),
  CONSTRAINT waitlist_consent_true CHECK (consent = true)
);
GRANT INSERT ON public.waitlist TO anon, authenticated;
GRANT ALL ON public.waitlist TO service_role;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join the waitlist" ON public.waitlist FOR INSERT TO anon, authenticated WITH CHECK (consent = true);