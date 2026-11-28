import { useRef } from "react";
import { appDict } from "@/lib/app/i18n";
import { useLang } from "@/lib/i18n";
import { Heading, useReveal, wrap } from "./core";

/** Stages and prizes on a dark card, like the Stage page of the app: the ten prizes, then how XP are earned. */
export function Stages() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const g = appDict[lang].guide.stage;
  useReveal(ref);
  return (
    <section id="stages" ref={ref} className="scroll-mt-20 px-3 py-20 md:py-28">
      <div className="relative mx-auto max-w-[76rem] overflow-hidden rounded-[2.5rem] bg-[#0b0b0f] px-5 py-12 text-white sm:px-10 md:px-14 md:py-16">
        <span className="absolute -right-20 -top-28 size-80 rounded-full bg-primary" aria-hidden />
        <span className="absolute right-56 top-10 hidden size-20 rounded-full bg-primary/55 md:block" aria-hidden />
        <div className="relative">
          <Heading light eyebrow={t.stages.eyebrow} title={t.stages.title} sub={t.stages.sub} />
          <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {g.prizes.map((p, i) => (
              <li key={p.s} data-reveal={(i % 5) * 0.06} className="rounded-3xl bg-white/[0.08] p-5 transition-colors duration-300 hover:bg-white/[0.16]">
                <p className="flex items-baseline gap-2"><span className="font-display text-5xl leading-none">{p.s}</span><span className="text-xs font-medium uppercase tracking-[0.12em] text-white/70">{t.stages.stage}</span></p>
                <p className="mt-4 text-[1.0625rem] leading-snug">{p.t}</p>
              </li>
            ))}
          </ol>
          <div data-reveal className="mt-12 grid gap-6 lg:grid-cols-[0.6fr_1.4fr]">
            <h3 className="text-2xl font-semibold">{t.stages.earnTitle}</h3>
            {/* Only the values written in the product decisions: the bonuses are still to be confirmed. */}
            <ul className="grid gap-x-10 sm:grid-cols-2">
              {g.earn.slice(0, 4).map((e) => <li key={e.t} className="flex items-baseline justify-between gap-4 py-2.5" style={{ borderBottom: "1px solid rgb(255 255 255 / 0.16)" }}><span className="text-white/85">{e.t}</span><span className="shrink-0 whitespace-nowrap font-semibold tabular-nums">{e.v}</span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
