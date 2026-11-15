import { render } from '@react-email/render'
import { createFileRoute } from '@tanstack/react-router'
import { EMAILS } from '@/lib/email-templates/emails'

const SAMPLE_PROJECT_URL = "https://95837fe7-2f9b-46c9-944b-56d5826402ae.lovableproject.com"
const SAMPLE_EMAIL = "user@example.test"

export const Route = createFileRoute("/lovable/email/auth/preview")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env['LOVABLE_API_KEY']

        if (!apiKey) {
          return Response.json(
            { error: 'Server configuration error' },
            { status: 500 }
          )
        }

        // Verify the caller is authorized with LOVABLE_API_KEY
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let type: string
        try {
          const body = await request.json()
          type = body.type
        } catch {
          return Response.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          )
        }

        const e = EMAILS.it[type as keyof (typeof EMAILS)['it']]

        if (!e) {
          return Response.json(
            { error: `Unknown email type: ${type}` },
            { status: 400 }
          )
        }

        const html = await render(e.el({ url: SAMPLE_PROJECT_URL, email: SAMPLE_EMAIL, newEmail: SAMPLE_EMAIL, token: '123456' }))

        return new Response(html, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      },
    },
  },
})
