import { useRef, useState } from "react";
import { appDict, fmt } from "@/lib/app/i18n";
import { LEAGUE_FLOOR, LEAGUES, leagueInk, leagueRange, nextLeague, type League } from "@/lib/app/rating";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LeagueRidge, peakAt } from "./Hero";
import { Heading, useReveal, wrap } from "./core";

const middle = (l: League) => { const n = nextLeague(l); return n ? Math.round((LEAGUE_FLOOR[l] + LEAGUE_FLOOR[n]) / 2) : 900; };

/** Rating and leagues: a slider from 0 to 1000 lights up the league you would be in. */
export function Leagues() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const a = appDict[lang];
  const [rating, setRating] = useState(300);
  const league = [...LEAGUES].reverse().find((l) => rating >= LEAGUE_FLOOR[l]) ?? "valle";
  useReveal(ref, [lang]);
  return (
    <section id="leagues" ref={ref} className="scroll-mt-20 py-20 transition-colors duration-700 md:py-28" style={{ background: `color-mix(in oklab, var(--league-${league}) 13%, white)` }}>
      <div className={wrap}>
        <Heading eyebrow={t.leagues.eyebrow} title={t.leagues.title} sub={t.leagues.sub} />
        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div data-reveal className="flex flex-col justify-between rounded-[2rem] bg-background p-6 shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)] sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">{t.leagues.rating}</p>
                <p className="font-display text-[clamp(4.5rem,16vw,7rem)] leading-[0.9] tabular-nums" aria-live="polite">{rating}</p>
              </div>
              <div className="pb-2 text-right">
                <span className="inline-block rounded-full px-5 py-2.5 text-lg font-semibold transition-colors duration-500" style={{ background: `var(--league-${league})`, color: leagueInk(league) }}>{a.leagues[league]}</span>
                <p className="mt-2 text-sm text-muted-foreground">{fmt(t.leagues.range, { r: leagueRange(league) })}</p>
              </div>
            </div>
            <div className="mt-6">
              <input type="range" min={0} max={1000} step={1} value={rating} onChange={(e) => setRating(Number(e.target.value))} aria-label={t.leagues.rating} className="h-11 w-full cursor-pointer" style={{ accentColor: `var(--league-${league})` }} />
              <div className="flex justify-between text-xs tabular-nums text-muted-foreground" aria-hidden><span>0</span><span>1000</span></div>
            </div>
            <p className="mt-6 text-2xl font-medium leading-snug">{a.guide.leagues.tag[league]}</p>
          </div>

          <div data-reveal="0.1" className="flex flex-col justify-end rounded-[2rem] bg-background p-6 shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)] sm:p-8">
            <div className="relative pt-8">
              <LeagueRidge active={league} onPick={(l) => setRating(middle(l))} className="h-44 w-full md:h-60" />
              <span className="absolute -translate-x-1/2 -translate-y-full rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold uppercase leading-none text-background transition-all duration-500" style={{ left: peakAt(league).left, top: `calc(2rem + (100% - 2rem) * ${parseFloat(peakAt(league).top) / 100} - 0.375rem)` }}>{t.leagues.you}</span>
            </div>
            <div className="grid grid-cols-6 border-t">
              {LEAGUES.map((l) => (
                <button key={l} type="button" onClick={() => setRating(middle(l))} aria-pressed={league === l} className={cn("min-h-12 rounded-b-xl px-0.5 pt-1.5 text-center text-[0.6875rem] transition-colors hover:bg-muted sm:text-sm", league === l ? "font-semibold" : "text-muted-foreground")}>
                  <span className="block">{a.leagues[l]}</span><span className="block whitespace-nowrap text-[0.6875rem] tracking-tighter text-muted-foreground">{leagueRange(l)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {t.leagues.facts.map((f, i) => (
            <li key={f.t} data-reveal={i * 0.08} className="rounded-[1.75rem] bg-background/70 p-6 backdrop-blur">
              <h3 className="text-xl font-semibold leading-snug">{f.t}</h3>
              <p className="mt-2 text-muted-foreground">{f.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
