import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const RESEND_URL = "https://api.resend.com";
const FROM = "PEAQ <hello@updates.peaqrace.com>";

const input = z.object({
  email: z.string().email().max(254),
  locale: z.enum(["it", "en"]).default("it"),
  discipline: z.enum(["running", "cycling", "both"]).nullish(),
});

const COPY = {
  it: {
    subject: "Sei nella waitlist di PEAQ",
    title: "Sei dei nostri.",
    body: "Grazie per esserti iscritto alla waitlist di PEAQ. Ti scriveremo a questo indirizzo quando PEAQ sarà pronto: identità da atleta, ranking di città, performance.",
    disc: { running: "Disciplina scelta: Running", cycling: "Disciplina scelta: Ciclismo", both: "Discipline scelte: Running e Ciclismo" },
    footer: "Ricevi questa email perché ti sei iscritto alla waitlist su peaqrace.com.",
  },
  en: {
    subject: "You're on the PEAQ waitlist",
    title: "You're in.",
    body: "Thanks for joining the PEAQ waitlist. We'll write to this address when PEAQ is ready: athlete identity, city rankings, performance.",
    disc: { running: "Chosen discipline: Running", cycling: "Chosen discipline: Cycling", both: "Chosen disciplines: Running & Cycling" },
    footer: "You received this email because you joined the waitlist at peaqrace.com.",
  },
} as const;

function html(locale: "it" | "en", discipline?: string | null) {
  const c = COPY[locale];
  const discLine = discipline ? `<p style="margin:16px 0 0;font-size:13px;color:#8a8f8c;letter-spacing:.08em;text-transform:uppercase">${c.disc[discipline as keyof typeof c.disc]}</p>` : "";
  return `<!doctype html><html><body style="margin:0;background:#0B0D0C;padding:40px 20px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:520px;margin:0 auto">
    <p style="font-size:22px;font-weight:800;letter-spacing:.18em;color:#ffffff;margin:0 0 32px">PEAQ<span style="color:#C7FF35">.</span></p>
    <h1 style="font-size:34px;line-height:1.1;color:#ffffff;margin:0 0 16px">${c.title}</h1>
    <p style="font-size:15px;line-height:1.6;color:#b6bbb8;margin:0">${c.body}</p>
    ${discLine}
    <hr style="border:none;border-top:1px solid #222624;margin:32px 0" />
    <p style="font-size:12px;color:#6b706d;margin:0">${c.footer}</p>
  </div>
</body></html>`;
}

export const sendWaitlistWelcome = createServerFn({ method: "POST" })
  .inputValidator((data) => input.parse(data))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const resendKey = process.env["RESEND_API_KEY"];

    const c = COPY[data.locale];
    const payload = {
      from: FROM,
      to: [data.email],
      subject: c.subject,
      html: html(data.locale, data.discipline),
    };

    // On Lovable (prod) send through the connector gateway; locally (no Lovable
    // key) call the Resend API directly with RESEND_API_KEY.
    let response: Response;
    if (lovableKey && resendKey) {
      response = await fetch(`${GATEWAY_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": resendKey,
        },
        body: JSON.stringify(payload),
      });
    } else if (resendKey) {
      response = await fetch(`${RESEND_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify(payload),
      });
    } else {
      throw new Error("Email service is not configured");
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Waitlist email failed [${response.status}]: ${errorBody}`);
      throw new Error(`Email send failed [${response.status}]`);
    }
    return { ok: true };
  });
