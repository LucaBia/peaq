import { useRef } from "react";
import runImg from "@/assets/sport-run.jpg";
import bikeImg from "@/assets/sport-bike.jpg";
import { appDict } from "@/lib/app/i18n";
import { LEAGUES } from "@/lib/app/rating";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Heading, useReveal, wrap } from "./core";

/** The four steps, then the two sports with a rating each. */
export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  useReveal(ref, [lang]);
  const sports = [[runImg, t.sports.run, t.sports.runMeta, 612, "cresta"], [bikeImg, t.sports.bike, t.sports.bikeMeta, 380, "passo"]] as const;
  return (
    <section id="how" ref={ref} className="scroll-mt-20 py-20 md:py-28">
      <div className={wrap}>
        <Heading eyebrow={t.how.eyebrow} title={t.how.title} />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.how.steps.map((s, i) => (
            <li key={s.t} data-reveal={i * 0.08} className="relative overflow-hidden rounded-[1.75rem] border-[1.5px] p-6 transition-transform duration-300 hover:-translate-y-1.5">
              <span className="absolute inset-x-0 top-0 h-2" style={{ background: `var(--league-${LEAGUES[i]})` }} aria-hidden />
              <span className="font-display block pt-2 text-7xl leading-none" aria-hidden>{i + 1}</span>
              <h3 className="mt-6 text-xl font-semibold leading-snug">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-8 md:mt-28 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Heading title={t.sports.title} sub={t.sports.text} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {sports.map(([img, name, meta, rating, league], i) => (
              <figure key={name} data-reveal={i * 0.1} className={cn("group relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-black text-white", i === 1 && "lg:translate-y-8")}>
                <img src={img} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/85" />
                <figcaption className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                  <p className="font-display text-4xl uppercase leading-none sm:text-5xl">{name}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span>{meta}</span><span className="text-2xl font-light tabular-nums leading-none">{rating}</span>
                    <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-black" style={{ background: `var(--league-${league})`, color: league === "cresta" ? "white" : "black" }}>{appDict[lang].leagues[league]}</span>
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
