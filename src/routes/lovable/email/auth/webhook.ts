import { createAuthEmailHandler, type AuthEmailHookData } from '@lovable.dev/email-js'
import { createFileRoute } from '@tanstack/react-router'
import { EMAILS } from '@/lib/email-templates/emails'
import { langFromUrl } from '@/lib/email-templates/peaq'

// Configuration
const SITE_NAME = "PEAQ"
const SENDER_DOMAIN = "notify.peaqrace.com"
const FROM_DOMAIN = "peaqrace.com"

type T = keyof (typeof EMAILS)['it']
const def = (type: T) => (data: AuthEmailHookData) => {
  const e = EMAILS[langFromUrl(data.url)][type]
  return { subject: e.subject, element: e.el({ url: data.url, email: data.email, newEmail: data.new_email ?? '', token: data.token ?? '' }) }
}

// The SDK handler owns verification, dispatch, and retry semantics; this file
// owns only the email decisions: subjects, templates, and per-type props.
export const Route = createFileRoute("/lovable/email/auth/webhook")({
  server: {
    handlers: {
      POST: ({ request }) => {
        const handler = createAuthEmailHandler({
          apiKey: process.env['LOVABLE_API_KEY']!,
          from: { name: SITE_NAME, address: `noreply@${FROM_DOMAIN}` },
          senderDomain: SENDER_DOMAIN,
          sendUrl: process.env['LOVABLE_SEND_URL'],
          emails: {
            signup: def('signup'),
            invite: def('invite'),
            magiclink: def('magiclink'),
            recovery: def('recovery'),
            email_change: def('email_change'),
            reauthentication: def('reauthentication'),
          },
        })
        return handler(request)
      },
    },
  },
})
