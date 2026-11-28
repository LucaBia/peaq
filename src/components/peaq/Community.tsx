import { useRef } from "react";
import { ArrowDown, Check } from "lucide-react";
import { LEAGUES } from "@/lib/app/rating";
import { useLang } from "@/lib/i18n";
import { Heading, useReveal, wrap } from "./core";

/** Clubs and invitations, side by side. */
export function Community() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const c = t.community;
  useReveal(ref);
  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className={wrap}>
        <Heading eyebrow={c.eyebrow} title={c.title} />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <article data-reveal className="rounded-[2rem] bg-muted p-6 sm:p-9">
            <div className="flex -space-x-3" aria-hidden>
              {LEAGUES.slice(0, 5).map((l, i) => <span key={l} className="grid size-14 place-items-center rounded-full border-4 border-muted text-sm font-semibold" style={{ background: `var(--league-${l})`, color: l === "cresta" ? "white" : "black", borderColor: "var(--muted)" }}>{["EB", "MT", "SM", "LF", "GN"][i]}</span>)}
            </div>
            <h3 className="mt-7 text-3xl font-semibold">{c.club.t}</h3>
            <p className="mt-3 text-lg text-muted-foreground">{c.club.d}</p>
            <ul className="mt-6 space-y-2.5">
              {c.club.items.map((x) => <li key={x} className="flex items-center gap-3"><Check className="size-5 shrink-0 text-primary" aria-hidden />{x}</li>)}
            </ul>
          </article>
          <article data-reveal="0.1" className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-white sm:p-9">
            <span className="absolute -bottom-24 -right-16 size-72 rounded-full bg-white/10" aria-hidden />
            <div className="relative">
              <h3 className="text-3xl font-semibold">{c.invite.t}</h3>
              <p className="mt-3 text-lg text-white/85">{c.invite.d}</p>
              <div className="mt-7 space-y-2">
                <p className="flex items-center justify-between gap-3 rounded-3xl bg-white p-4 text-black"><span className="text-sm font-medium uppercase tracking-[0.08em] text-black/60">{c.invite.you}</span><span className="text-right font-semibold">{c.invite.youGet}</span></p>
                <ArrowDown className="mx-auto size-5 text-white/80" aria-hidden />
                <p className="flex items-center justify-between gap-3 rounded-3xl bg-white/15 p-4"><span className="text-sm font-medium uppercase tracking-[0.08em] text-white">{c.invite.friend}</span><span className="text-right font-semibold">{c.invite.friendGets}</span></p>
              </div>
              <p className="mt-5 text-sm text-white/80">{c.invite.note}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
