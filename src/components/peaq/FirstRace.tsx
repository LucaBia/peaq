import { useRef } from "react";
import raceImg from "@/assets/hero-runner.jpg";
import { appDict } from "@/lib/app/i18n";
import { PILOT_STARTS } from "@/lib/app/events";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useReveal, wrap } from "./core";

/** The first PEAQ race (the pilot, invite only) as a poster, and the first two cities. */
export function FirstRace() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const f = t.first;
  useReveal(ref, [lang]);
  const pillCls = "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em]";
  return (
    <section ref={ref} className="pb-20 md:pb-28">
      <div className={cn(wrap, "grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14")}>
        <div data-reveal className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[2rem] bg-black p-5 text-white sm:aspect-[16/11] sm:p-8 lg:aspect-[4/3]">
          <img src={raceImg} alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-[70%_center] transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/85" />
          <div className="relative flex flex-wrap gap-2"><span className={cn(pillCls, "bg-white text-black")}>{f.invite}</span><span className={cn(pillCls, "bg-black/50 backdrop-blur")}>{f.date}</span></div>
          <div className="relative"><p className="font-display text-[clamp(2.75rem,9vw,5.5rem)] uppercase leading-[0.9]">{f.title}</p><p className="mt-3 text-lg">{f.place}</p></div>
        </div>
        <div>
          <p data-reveal className="text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-primary">{f.eyebrow}</p>
          <p data-reveal className="mt-4 text-2xl font-medium leading-snug md:text-[1.75rem]">{f.text}</p>
          <div data-reveal="0.1" className="mt-6 flex flex-wrap gap-2">
            {PILOT_STARTS.map((l) => <span key={l} className="rounded-full px-5 py-2.5 font-semibold text-black" style={{ background: `var(--league-${l})` }}>{appDict[lang].leagues[l]}</span>)}
          </div>
          <p data-reveal="0.15" className="mt-12 text-muted-foreground">{f.cities}</p>
          <p data-reveal="0.2" className="font-display mt-1 text-[clamp(2.75rem,8vw,5rem)] uppercase leading-[0.95]">{f.city1}<span className="block text-primary">{f.city2}</span></p>
        </div>
      </div>
    </section>
  );
}
