import * as React from 'react'
import { PeaqEmail, type Lang } from './peaq'

type D = { url: string; email: string; newEmail?: string; token?: string }
type Def = { subject: string; el: (d: D) => React.ReactElement }

export const EMAILS: Record<Lang, Record<'signup' | 'recovery' | 'invite' | 'magiclink' | 'email_change' | 'reauthentication', Def>> = {
  it: {
    signup: { subject: 'Conferma la tua email — PEAQ', el: (d) => <PeaqEmail lang="it" preview="Un clic e sei sulla linea di partenza." kicker="Linea di partenza" title={<>Sei quasi<br />in gara.</>} body={<>Conferma <strong style={{ color: '#fff' }}>{d.email}</strong> per attivare il tuo profilo atleta e scegliere il tuo numero di pettorale.</>} cta={{ label: 'Conferma email', href: d.url }} note="Il link scade a breve per la tua sicurezza." /> },
    recovery: { subject: 'Reimposta la password — PEAQ', el: (d) => <PeaqEmail lang="it" preview="Imposta una nuova password e torna in pista." kicker="Recupero accesso" title={<>Nuova password,<br />stesso ritmo.</>} body="Abbiamo ricevuto una richiesta di reimpostare la password del tuo account PEAQ. Tocca il pulsante per sceglierne una nuova." cta={{ label: 'Reimposta password', href: d.url }} note="Se non sei stato tu, la tua password attuale resta valida." /> },
    invite: { subject: 'Sei stato invitato su PEAQ', el: (d) => <PeaqEmail lang="it" preview="Il tuo posto in griglia ti aspetta." kicker="Invito" title={<>Il tuo posto<br />ti aspetta.</>} body="Sei stato invitato a unirti a PEAQ. Accetta l'invito per creare il tuo profilo atleta." cta={{ label: 'Accetta invito', href: d.url }} /> },
    magiclink: { subject: 'Il tuo link di accesso — PEAQ', el: (d) => <PeaqEmail lang="it" preview="Accedi a PEAQ con un clic." kicker="Accesso" title={<>Pronto?<br />Via.</>} body="Usa questo link per accedere al tuo account PEAQ." cta={{ label: 'Accedi', href: d.url }} note="Il link è valido per un solo utilizzo." /> },
    email_change: { subject: 'Conferma la nuova email — PEAQ', el: (d) => <PeaqEmail lang="it" preview="Conferma il cambio di email." kicker="Account" title={<>Nuova email,<br />confermala.</>} body={<>Conferma il cambio da <strong style={{ color: '#fff' }}>{d.email}</strong> a <strong style={{ color: '#fff' }}>{d.newEmail}</strong>.</>} cta={{ label: 'Conferma cambio', href: d.url }} /> },
    reauthentication: { subject: 'Il tuo codice di verifica — PEAQ', el: (d) => <PeaqEmail lang="it" preview="Il tuo codice PEAQ." kicker="Verifica" title="Il tuo codice" body="Inserisci questo codice per confermare la tua identità." code={d.token} note="Il codice scade a breve." /> },
  },
  en: {
    signup: { subject: 'Confirm your email — PEAQ', el: (d) => <PeaqEmail lang="en" preview="One click and you're on the start line." kicker="Start line" title={<>You're almost<br />racing.</>} body={<>Confirm <strong style={{ color: '#fff' }}>{d.email}</strong> to activate your athlete profile and pick your bib number.</>} cta={{ label: 'Confirm email', href: d.url }} note="This link expires soon for your security." /> },
    recovery: { subject: 'Reset your password — PEAQ', el: (d) => <PeaqEmail lang="en" preview="Set a new password and get back on track." kicker="Account recovery" title={<>New password,<br />same pace.</>} body="We got a request to reset the password on your PEAQ account. Tap the button to choose a new one." cta={{ label: 'Reset password', href: d.url }} note="If this wasn't you, your current password still works." /> },
    invite: { subject: "You're invited to PEAQ", el: (d) => <PeaqEmail lang="en" preview="Your spot on the grid is waiting." kicker="Invite" title={<>Your spot<br />is waiting.</>} body="You've been invited to join PEAQ. Accept to create your athlete profile." cta={{ label: 'Accept invite', href: d.url }} /> },
    magiclink: { subject: 'Your login link — PEAQ', el: (d) => <PeaqEmail lang="en" preview="Log in to PEAQ in one click." kicker="Log in" title={<>Ready?<br />Go.</>} body="Use this link to log in to your PEAQ account." cta={{ label: 'Log in', href: d.url }} note="This link can only be used once." /> },
    email_change: { subject: 'Confirm your new email — PEAQ', el: (d) => <PeaqEmail lang="en" preview="Confirm your email change." kicker="Account" title={<>New email,<br />confirm it.</>} body={<>Confirm the change from <strong style={{ color: '#fff' }}>{d.email}</strong> to <strong style={{ color: '#fff' }}>{d.newEmail}</strong>.</>} cta={{ label: 'Confirm change', href: d.url }} /> },
    reauthentication: { subject: 'Your verification code — PEAQ', el: (d) => <PeaqEmail lang="en" preview="Your PEAQ code." kicker="Verify" title="Your code" body="Enter this code to confirm it's you." code={d.token} note="This code expires soon." /> },
  },
}
