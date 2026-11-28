import { useRef, useState } from "react";
import { appDict, fmt } from "@/lib/app/i18n";
import { leagueInk, type League } from "@/lib/app/rating";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Heading, useReveal, wrap } from "./core";

type Row = { rank: number; name: string; bib: number; rating: number; league: League; me?: boolean };
// Invented athletes, shown with the "sample data" label.
const SAMPLE: Record<"run" | "bike", Row[]> = {
  run: [
    { rank: 12, name: "ElenaB", bib: 118, rating: 641, league: "cresta" }, { rank: 13, name: "MarcoT", bib: 233, rating: 618, league: "cresta" },
    { rank: 14, name: "", bib: 236, rating: 612, league: "cresta", me: true }, { rank: 15, name: "SaraM", bib: 507, rating: 607, league: "cresta" }, { rank: 16, name: "LucaF", bib: 142, rating: 598, league: "cresta" },
  ],
  bike: [
    { rank: 6, name: "GinevraT", bib: 310, rating: 530, league: "cresta" }, { rank: 7, name: "DavideR", bib: 455, rating: 512, league: "cresta" },
    { rank: 8, name: "", bib: 236, rating: 498, league: "passo", me: true }, { rank: 9, name: "NoraB", bib: 172, rating: 471, league: "passo" }, { rank: 10, name: "PaoloR", bib: 264, rating: 455, league: "passo" },
  ],
};

/** City rankings: a sample list that switches between running and cycling. */
export function Rankings() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const [sport, setSport] = useState<"run" | "bike">("run");
  const rows = SAMPLE[sport];
  const k = rows.findIndex((r) => r.me), me = rows[k]!, above = rows[k - 1]!;
  useReveal(ref);
  return (
    <section ref={ref} className="bg-muted py-20 md:py-28">
      <div className={cn(wrap, "grid gap-10 lg:grid-cols-2 lg:items-center")}>
        <Heading eyebrow={t.rank.eyebrow} title={t.rank.title} sub={t.rank.sub} />
        <div data-reveal className="rounded-[2rem] bg-background p-4 shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xl font-semibold">{t.first.city2} · {sport === "run" ? t.rank.run : t.rank.bike}</p>
            <span className="rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{t.rank.sample}</span>
          </div>
          <div role="group" aria-label={t.rank.sport} className="mt-4 grid grid-cols-2 rounded-full bg-muted p-1">
            {(["run", "bike"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSport(s)} aria-pressed={sport === s} className={cn("min-h-11 rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", sport === s ? "bg-foreground text-background" : "text-foreground")}>{s === "run" ? t.rank.run : t.rank.bike}</button>
            ))}
          </div>
          <ol key={sport} className="mt-4 space-y-2">
            {rows.map((r, i) => (
              <li key={r.rank} className={cn("flex min-h-14 items-center gap-3 rounded-2xl px-3 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500", !r.me && "bg-muted/60")} style={{ animationDelay: `${i * 70}ms`, ...(r.me && { background: `var(--league-${r.league})`, color: leagueInk(r.league) }) }}>
                <span className={cn("w-7 text-right text-sm tabular-nums", !r.me && "opacity-70")}>{r.rank}</span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 bg-background text-xs font-semibold text-foreground" style={{ borderColor: `var(--league-${r.league})` }} aria-hidden>{(r.me ? t.rank.you : r.name).slice(0, 2).toUpperCase()}</span>
                <span className="min-w-0 flex-1 truncate font-medium">{r.me ? t.rank.you : r.name}<span className={cn("ml-2 text-sm font-light", !r.me && "opacity-70")}>#{r.bib}</span></span>
                <span className="hidden rounded-full px-2.5 py-1 text-xs font-semibold sm:block" style={r.me ? { background: "white", color: "black" } : { background: `var(--league-${r.league})`, color: leagueInk(r.league) }}>{appDict[lang].leagues[r.league]}</span>
                <span className="w-10 text-right text-lg font-semibold tabular-nums">{r.rating}</span>
              </li>
            ))}
          </ol>
          <p key={`${sport}-hint`} className="mt-4 px-1 text-[0.9375rem] font-medium animate-in fade-in duration-700">{fmt(t.rank.toPass, { n: above.rating - me.rating, name: above.name })}</p>
        </div>
      </div>
    </section>
  );
}
