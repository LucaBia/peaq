// Renders the branded React Email auth templates (src/lib/email-templates) to
// static HTML for your Supabase project's Auth email templates (Dashboard >
// Authentication > Emails). Dynamic parts are emitted as Supabase Go-template
// placeholders ({{ .ConfirmationURL }} etc.) so GoTrue fills them in at send time.
// Output goes to setup/email-templates/. Run with: bun run emails:render
import { render } from '@react-email/render'
import { mkdir, writeFile } from 'node:fs/promises'
import { EMAILS } from '../src/lib/email-templates/emails.tsx'

// Sentinels are plain underscores so React Email never URL/HTML-encodes them.
const SENTINEL = {
  url: '__PEAQ_URL__',
  email: '__PEAQ_EMAIL__',
  newEmail: '__PEAQ_NEWEMAIL__',
  token: '__PEAQ_TOKEN__',
}

// Sentinel -> Supabase Go-template variable.
const PLACEHOLDER = {
  [SENTINEL.url]: '{{ .ConfirmationURL }}',
  [SENTINEL.email]: '{{ .Email }}',
  [SENTINEL.newEmail]: '{{ .NewEmail }}',
  [SENTINEL.token]: '{{ .Token }}',
}

// EMAILS key -> Supabase template name (= output filename).
const TEMPLATES = {
  signup: 'confirmation',
  recovery: 'recovery',
  invite: 'invite',
  magiclink: 'magic_link',
  email_change: 'email_change',
  reauthentication: 'reauthentication',
}

const LANG = 'it' // Supabase templates are static; Italian is the app default.
const outDir = new URL('../setup/email-templates/', import.meta.url)
await mkdir(outDir, { recursive: true })

for (const [key, file] of Object.entries(TEMPLATES)) {
  const def = EMAILS[LANG][key]
  let html = await render(
    def.el({ url: SENTINEL.url, email: SENTINEL.email, newEmail: SENTINEL.newEmail, token: SENTINEL.token }),
  )
  for (const [sentinel, go] of Object.entries(PLACEHOLDER)) html = html.split(sentinel).join(go)
  await writeFile(new URL(`${file}.html`, outDir), html, 'utf8')
  console.log(`rendered setup/email-templates/${file}.html`)
}
