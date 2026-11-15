import { useRef, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { sendWaitlistWelcome } from "@/lib/waitlist.functions";
import { cn } from "@/lib/utils";
import { gsap, Magnetic, useGsap, Wordmark } from "./core";

type Status = { kind: "idle" | "sending" | "ok" | "error"; msg?: string };
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function Waitlist() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const f = t.final.form;
  const [email, setEmail] = useState("");
  const [disc, setDisc] = useState<"" | "running" | "cycling" | "both">("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useGsap(ref, () => {
    gsap.fromTo("[data-kinetic]", { xPercent: 8 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from("[data-f-line] > span", { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 60%" } });
  }, [lang]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean) || clean.length > 254) return setStatus({ kind: "error", msg: f.errEmail });
    if (!consent) return setStatus({ kind: "error", msg: f.errConsent });
    setStatus({ kind: "sending" });
    const { error } = await supabase.from("waitlist").insert({ email: clean, discipline: disc || null, locale: lang, consent: true });
    if (error) {
      if (error.code === "23505") return setStatus({ kind: "ok", msg: f.dup });
      return setStatus({ kind: "error", msg: f.err });
    }
    setStatus({ kind: "ok", msg: f.ok });
    setEmail(""); setDisc(""); setConsent(false);
    // Fire-and-forget: a failed welcome email must not break the signup.
    sendWaitlistWelcome({ data: { email: clean, locale: lang, discipline: disc || null } }).catch((e) => console.error("welcome email failed", e));
  }

  return (
    <section id="waitlist" ref={ref} className="relative overflow-hidden border-t pt-24 md:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <h2 className="display text-[11vw] md:text-[7vw]">
          <span data-f-line className="block overflow-hidden"><span className="block">{t.final.title[0]}</span></span>
          <span data-f-line className="block overflow-hidden"><span className="block text-primary">{t.final.title[1]}</span></span>
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <div className="eyebrow flex items-start gap-3 text-muted-foreground md:col-span-4">
            <span className="mt-1 size-2 rounded-full bg-primary animate-blink" /> PEAQ — {t.status}
          </div>
          <form onSubmit={submit} noValidate className="md:col-span-8">
            <label htmlFor="wl-email" className="sr-only">{f.email}</label>
            <input
              id="wl-email" type="email" inputMode="email" autoComplete="email" required maxLength={254}
              value={email} onChange={(e) => setEmail(e.target.value)} placeholder={f.email}
              aria-invalid={status.kind === "error" && status.msg === f.errEmail}
              className="display w-full border-b-2 bg-transparent py-4 text-4xl outline-none transition-colors placeholder:text-foreground/25 focus:border-primary md:text-6xl"
            />
            <fieldset className="mt-8">
              <legend className="eyebrow mb-3 text-muted-foreground">{f.interest}</legend>
              <div className="flex flex-wrap gap-2">
                {(["running", "cycling", "both"] as const).map((k) => (
                  <button key={k} type="button" aria-pressed={disc === k} onClick={() => setDisc(disc === k ? "" : k)} className={cn("eyebrow border px-4 py-3 transition-colors", disc === k ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground")}>{f[k]}</button>
                ))}
              </div>
            </fieldset>
            <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm text-foreground/75">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[var(--lime)]" />
              <span>{f.consent}</span>
            </label>
            <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center">
              <Magnetic>
                <button type="submit" disabled={status.kind === "sending"} className="group eyebrow inline-flex items-center gap-4 bg-primary py-5 pl-7 pr-5 text-sm font-bold text-primary-foreground glow-lime disabled:opacity-60">
                  {status.kind === "sending" ? f.sending : f.submit}
                  <span className="grid size-8 place-items-center bg-primary-foreground text-primary transition-transform group-hover:rotate-45">↗</span>
                </button>
              </Magnetic>
              <p role="status" aria-live="polite" className={cn("text-sm", status.kind === "ok" ? "text-primary" : "text-destructive")}>{status.kind === "ok" || status.kind === "error" ? status.msg : ""}</p>
            </div>
            <p className="mt-8 max-w-lg text-xs text-muted-foreground">{f.privacy}</p>
          </form>
        </div>
      </div>
      <div className="mt-24 overflow-hidden md:mt-40" aria-hidden>
        <div data-kinetic className="w-[115%] -ml-[7.5%] text-foreground"><Wordmark /></div>
      </div>
    </section>
  );
}
