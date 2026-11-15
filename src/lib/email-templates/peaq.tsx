import * as React from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from '@react-email/components'

export type Lang = 'it' | 'en'
export const SITE_URL = 'https://peaqrace.com'

/** Language comes from the ?lang= we add to the app's redirect URL. */
export function langFromUrl(url: string): Lang {
  try {
    const u = new URL(url)
    const r = u.searchParams.get('redirect_to')
    const l = (r ? new URL(r).searchParams.get('lang') : null) ?? u.searchParams.get('lang')
    return l === 'en' ? 'en' : 'it'
  } catch { return 'it' }
}

const C = { ink: '#0B0D0C', lime: '#C7FF35', mute: '#8A918C', line: '#1E2320', soft: '#C9CEC9' }
const font = "'Helvetica Neue', Helvetica, Arial, sans-serif"

const foot = {
  it: { tag: 'Corri. Pedala. Scala la classifica.', ignore: 'Non hai richiesto questa email? Puoi ignorarla in sicurezza.' },
  en: { tag: 'Run. Ride. Climb the ranks.', ignore: "Didn't request this? You can safely ignore this email." },
}

interface Props {
  lang: Lang; preview: string; kicker: string; title: React.ReactNode; body: React.ReactNode
  cta?: { label: string; href: string }; code?: string; note?: string
}

export function PeaqEmail({ lang, preview, kicker, title, body, cta, code, note }: Props) {
  return (
    <Html lang={lang} dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: '24px 0', fontFamily: font }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: C.ink, borderRadius: '20px', overflow: 'hidden' }}>
          <Section style={{ height: '4px', backgroundColor: C.lime }} />
          <Section style={{ padding: '36px 40px 0' }}>
            <Text style={{ margin: 0, fontSize: '22px', fontWeight: 900, letterSpacing: '6px', color: '#ffffff' }}>
              PEA<span style={{ color: C.lime }}>Q</span>
            </Text>
          </Section>
          <Section style={{ padding: '48px 40px 8px' }}>
            <Text style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: C.lime }}>
              ● {kicker}
            </Text>
            <Heading style={{ margin: '0 0 20px', fontSize: '40px', lineHeight: '1.02', fontWeight: 900, letterSpacing: '-1.5px', textTransform: 'uppercase', color: '#ffffff' }}>
              {title}
            </Heading>
            <Text style={{ margin: '0 0 32px', fontSize: '16px', lineHeight: '1.6', color: C.soft }}>{body}</Text>
            {cta && (
              <Button href={cta.href} style={{ backgroundColor: C.lime, color: C.ink, fontSize: '15px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', borderRadius: '999px', padding: '18px 34px', textDecoration: 'none' }}>
                {cta.label} →
              </Button>
            )}
            {code && (
              <Text style={{ margin: '0 0 8px', display: 'inline-block', padding: '18px 26px', border: `1px solid ${C.lime}`, borderRadius: '14px', fontSize: '34px', fontWeight: 800, letterSpacing: '10px', color: C.lime, fontFamily: "'Courier New', monospace" }}>
                {code}
              </Text>
            )}
            {note && <Text style={{ margin: '28px 0 0', fontSize: '13px', lineHeight: '1.5', color: C.mute }}>{note}</Text>}
          </Section>
          <Section style={{ padding: '40px 40px 36px' }}>
            <Hr style={{ borderColor: C.line, margin: '0 0 24px' }} />
            <Text style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{foot[lang].tag}</Text>
            <Text style={{ margin: '0 0 14px', fontSize: '12px', lineHeight: '1.5', color: C.mute }}>{foot[lang].ignore}</Text>
            <Link href={SITE_URL} style={{ fontSize: '12px', color: C.lime, textDecoration: 'none' }}>peaqrace.com</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
