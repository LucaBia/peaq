import { useRef, useState } from "react";
import { Shuffle } from "lucide-react";
import { Bib } from "@/components/app/Bib";
import { appDict } from "@/lib/app/i18n";
import { LEAGUES, type League } from "@/lib/app/rating";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SignupCta } from "./Cta";
import { gsap, Tilt, useGsap, wrap } from "./core";

const peak = (i: number) => 34 + i * 13; // height of each mountain, on a 100-high drawing

/** The six leagues as a mountain range, Valle on the left up to PEAQ. `active` fades the others; `grow` raises them one by one. */
export function LeagueRidge({ className, active, grow, onPick }: { className?: string; active?: League | undefined; grow?: boolean; onPick?: ((l: League) => void) | undefined }) {
  return (
    <svg viewBox="0 0 360 100" preserveAspectRatio="none" className={className} aria-hidden>
      {LEAGUES.map((l, i) => {
        const x = 30 + i * 60, y = 100 - peak(i), ridge = `L${x + 5} ${y + peak(i) * 0.26} L${x + 13} ${y + peak(i) * 0.16} L${x + 42} 100`;
        return (
          <g key={l} onClick={onPick && (() => onPick(l))} className={cn("transition-opacity duration-500 [transform-box:fill-box]", grow && "animate-in fade-in slide-in-from-bottom-full fill-mode-both duration-700", onPick && "cursor-pointer")}
            style={{ opacity: active && active !== l ? 0.22 : 1, animationDelay: grow ? `${250 + i * 110}ms` : undefined }}>
            <path d={`M${x - 42} 100 L${x - 4} ${y} ${ridge}Z`} fill={`var(--league-${l})`} />
            <path d={`M${x - 4} ${y} ${ridge} L${x + 3} 100Z`} fill="black" opacity="0.14" />
          </g>
        );
      })}
    </svg>
  );
}
/** Where the top of a league's mountain is, in % of the ridge box: for a marker placed over it. */
export const peakAt = (l: League) => { const i = LEAGUES.indexOf(l); return { left: `${((30 + i * 60 - 4) / 360) * 100}%`, top: `${100 - peak(i)}%` }; };

/** A bib to play with: name, number and league change it live. Nothing is saved. */
function BibMaker() {
  const { t, lang } = useLang();
  const m = t.hero.maker;
  const [name, setName] = useState("");
  const [num, setNum] = useState(236);
  const [league, setLeague] = useState<League>("collina");
  return (
    <div className="rounded-[2rem] bg-muted p-5 animate-in fade-in zoom-in-95 fill-mode-both delay-200 duration-700 sm:p-7">
      <p className="text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">{m.title}</p>
      <Tilt className="mt-4"><Bib number={num} username={name || m.namePh} discipline="run" league={league} /></Tilt>
      <div className="mt-5 flex gap-2.5">
        <label className="min-w-0 flex-1">
          <span className="sr-only">{m.name}</span>
          <input value={name} onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s/g, "").slice(0, 20))} placeholder={m.name} autoCapitalize="none" autoCorrect="off" spellCheck={false}
            className="h-12 w-full rounded-full border-[1.5px] bg-background px-5 outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground" />
        </label>
        <button type="button" onClick={() => setNum(101 + Math.floor(Math.random() * 899))} aria-label={`${m.shuffle} (${num})`}
          className="flex h-12 shrink-0 items-center gap-2 rounded-full border-[1.5px] border-foreground bg-background px-5 font-medium tabular-nums transition-transform active:scale-95"><Shuffle className="size-4" aria-hidden />{num}</button>
      </div>
      <div role="group" aria-label={m.league} className="mt-3 flex justify-between gap-0.5">
        {LEAGUES.map((l) => (
          <button key={l} type="button" aria-pressed={league === l} aria-label={appDict[lang].leagues[l]} title={appDict[lang].leagues[l]} onClick={() => setLeague(l)}
            className={cn("size-11 shrink-0 rounded-full transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", league === l && "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-muted")} style={{ background: `var(--league-${l})` }} />
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{m.note}</p>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  const [l1, l2] = t.hero.title.split("\n");
  useGsap(ref, () => {
    gsap.to("[data-ridge]", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
  }, []);
  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-28 md:pt-36">
      <div className={cn(wrap, "relative z-10 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14")}>
        <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700">
          <div className="flex gap-1" aria-hidden>{LEAGUES.map((l) => <span key={l} className="h-1.5 w-8 rounded-full" style={{ background: `var(--league-${l})` }} />)}</div>
          <p className="mt-5 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">{t.hero.eyebrow}</p>
          <h1 className="mt-3 text-[clamp(2.5rem,7.6vw,5rem)] font-bold leading-[1.02] tracking-tight">{l1}<span className="block text-primary">{l2}</span></h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">{t.hero.sub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SignupCta label={t.hero.cta} />
            <a href="#how" className="inline-flex min-h-14 items-center rounded-full border-[1.5px] border-foreground px-7 text-lg font-semibold transition-colors hover:bg-muted">{t.hero.cta2}</a>
          </div>
        </div>
        <BibMaker />
      </div>
      <div data-ridge className="mt-12 md:mt-16"><LeagueRidge grow className="h-32 w-full md:h-56" /></div>
    </section>
  );
}
