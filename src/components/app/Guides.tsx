import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { LEAGUES, leagueColorVar, leagueInk, leagueRange, XP_FOR_NEXT_LEVEL, type League } from "@/lib/app/rating";
import { cn } from "@/lib/utils";
import { BackHeader } from "./ui";

const label = "text-[0.6875rem] font-semibold uppercase tracking-[0.08em]";

/** Six mountains, one per league, growing from Valle to PEAQ (Figma B8). `you` puts a tag on the athlete's league. */
export function LeagueScale({ you }: { you?: League | undefined }) {
  const { t } = useAppLang();
  const h = (i: number) => 32 + i * 13; // height of each mountain, on a 100-high drawing
  const at = you ? LEAGUES.indexOf(you) : -1;
  return (
    <div className={cn("text-center", you && "pt-6")}>
      <div className="relative">
        <svg viewBox="0 0 360 100" preserveAspectRatio="none" className="h-24 w-full" aria-hidden>
          {LEAGUES.map((l, i) => {
            const x = 30 + i * 60, y = 100 - h(i), ridge = `L${x + 5} ${y + h(i) * 0.26} L${x + 13} ${y + h(i) * 0.16} L${x + 40} 100`;
            return <g key={l}><path d={`M${x - 40} 100 L${x - 4} ${y} ${ridge}Z`} fill={`var(--league-${l})`} /><path d={`M${x - 4} ${y} ${ridge} L${x + 3} 100Z`} fill="black" opacity="0.14" /></g>;
          })}
        </svg>
        {at >= 0 && <span className="absolute -translate-x-1/2 -translate-y-full rounded-full bg-foreground px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase leading-none text-background" style={{ left: `${((30 + at * 60 - 4) / 360) * 100}%`, top: `calc(${100 - h(at)}% - 0.25rem)` }}>{t.rank.you}</span>}
      </div>
      <div className="grid grid-cols-6 border-t pt-1.5">
        {LEAGUES.map((l) => (
          <div key={l}>
            <p className={cn("text-[0.6875rem]", !you || you === l ? "font-semibold" : "text-muted-foreground")}>{t.leagues[l]}</p>
            <p className="whitespace-nowrap text-[0.6875rem] tracking-tighter text-muted-foreground">{leagueRange(l)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** "How the rating works": seven numbered cards. */
export function RatingGuide() {
  const { t } = useAppLang();
  const g = t.guide.rating;
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={g.title} to="/app" />
      <ol className="space-y-3 px-4 pb-8 pt-2">
        {g.items.map((it, i) => (
          <li key={it.t} className="flex gap-3 rounded-[1.75rem] border-[1.5px] p-5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground" aria-hidden>{i + 1}</span>
            <div className="min-w-0 flex-1">
              <h2 className="pt-0.5 text-[1.1875rem] font-medium leading-snug">{it.t}</h2>
              <p className="mt-1 text-[0.9375rem] text-muted-foreground">{it.d}</p>
              {i === 2 && <><div className="mt-4"><LeagueScale /></div><Link to="/app/leagues" className="mt-2 inline-flex min-h-11 items-center gap-1 text-[0.9375rem] font-medium text-primary underline-offset-4 hover:underline">{g.seeLeagues}<ChevronRight className="size-4" aria-hidden /></Link></>}
            </div>
          </li>
        ))}
        <li className="px-2 pt-1 text-sm text-muted-foreground">{g.note}</li>
      </ol>
    </main>
  );
}

/** The ridge line of a league card: flatter for Valle, steeper up to PEAQ. */
function Ridge({ i }: { i: number }) {
  const line = `M0 ${58 - i * 2} L22 ${52 - i * 3} L38 ${58 - i * 2} L62 ${44 - i * 6} L80 ${54 - i * 3} L100 ${50 - i * 2}`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
      <path d={`${line} L100 100 L0 100Z`} fill="black" opacity="0.1" />
      <path d={line} fill="none" stroke="white" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const here = "whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-black";

/** "The leagues": six coloured cards, with "you are here" on the athlete's league. Each opens its own page. */
export function LeaguesGuide({ current }: { current?: League | null | undefined }) {
  const { t } = useAppLang();
  const g = t.guide.leagues;
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={g.title} to="/app" />
      <p className="px-5 text-[0.9375rem] text-muted-foreground">{g.sub}</p>
      <ul className="grid grid-cols-2 gap-3 px-4 pb-8 pt-4">
        {LEAGUES.map((l, i) => (
          <li key={l}>
            <Link to="/app/leagues/$league" params={{ league: l }} className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-3xl p-4 transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" style={{ background: leagueColorVar(l), color: leagueInk(l) }}>
              <Ridge i={i} />
              <div className="relative flex flex-col items-start gap-1.5">
                <span className="whitespace-nowrap text-xs font-semibold">{fmt(g.range, { r: leagueRange(l) })}</span>
                {current === l && <span className={cn(label, here)}>{g.here}</span>}
              </div>
              <div className="relative"><h2 className="text-2xl font-bold leading-tight">{t.leagues[l]}</h2><p className="text-xs">{g.tag[l]}</p></div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

/** One league (Figma B2d): who is in it, a short story and its motto, with links to the leagues next to it. */
export function LeagueGuide({ league, current }: { league: League; current?: League | null | undefined }) {
  const { t } = useAppLang();
  const g = t.guide.leagues, x = t.guide.league.items[league];
  const i = LEAGUES.indexOf(league), prev = LEAGUES[i - 1], next = LEAGUES[i + 1];
  const color = `var(--league-${league})`;
  const nav = "inline-flex min-h-11 items-center gap-1 font-semibold underline-offset-4 hover:underline";
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={t.leagues[league]} to="/app/leagues" />
      <div className="space-y-5 px-4 pb-8 pt-2">
        <section className="relative overflow-hidden rounded-[1.75rem] p-5 pb-28" style={{ background: leagueColorVar(league), color: leagueInk(league) }}>
          <div className="absolute inset-x-0 bottom-0 h-28"><Ridge i={i} /></div>
          <div className="relative flex items-center justify-between gap-2">
            <span className="text-[0.8125rem] font-semibold">{fmt(g.range, { r: leagueRange(league) })}</span>
            {current === league && <span className={cn(label, here)}>{g.here}</span>}
          </div>
          <h2 className="relative mt-1 text-[2rem] font-bold leading-[1.1]">{g.tag[league]}</h2>
        </section>

        <section>
          <h3 className={cn(label, "px-4 text-muted-foreground")}>{t.guide.league.who}</h3>
          <ul className="mt-2 space-y-3 rounded-3xl border p-5">
            {x.who.map((w) => <li key={w} className="flex items-start gap-3 text-[0.9375rem]"><span className="mt-2 size-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />{w}</li>)}
          </ul>
        </section>

        <section>
          <h3 className={cn(label, "px-4 text-muted-foreground")}>{t.guide.league.story}</h3>
          <div className="mt-2 rounded-3xl bg-muted p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-background text-[0.9375rem] font-semibold" style={{ borderColor: color }} aria-hidden>{x.name[0]}</span>
              <div><p className="font-medium">{x.name}</p><p className="text-sm text-muted-foreground">{x.cap}</p></div>
            </div>
            <p className="mt-4 text-[0.9375rem]">{x.body}</p>
          </div>
        </section>

        <p className="ml-2 border-l-[5px] pl-4 text-[1.375rem] font-semibold leading-snug" style={{ borderColor: color }}>{x.motto}</p>

        <nav className="flex items-center justify-between px-2 pt-2">
          {prev ? <Link to="/app/leagues/$league" params={{ league: prev }} className={nav}><ChevronLeft className="size-4" aria-hidden />{t.leagues[prev]}</Link> : <span />}
          {next ? <Link to="/app/leagues/$league" params={{ league: next }} className={nav}>{t.leagues[next]}<ChevronRight className="size-4" aria-hidden /></Link> : <span />}
        </nav>
      </div>
    </main>
  );
}

/** "Stage" (Figma B7): the athlete's Stage and XP on a dark card, the prizes along the way and how XP are earned. */
export function StageGuide({ level, xp }: { level: number; xp: number }) {
  const { t } = useAppLang();
  const g = t.guide.stage;
  const next = XP_FOR_NEXT_LEVEL[level];
  const left = next ? Math.max(0, next - xp) : null;
  const nextPrize = g.prizes.find((p) => p.s > level);
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={g.title} to="/app" />
      <div className="space-y-7 px-4 pb-8 pt-2">
        <section className="relative overflow-hidden rounded-[1.75rem] bg-[#0b0b0f] p-5 text-white">
          <span className="absolute -right-12 -top-16 size-48 rounded-full bg-primary" aria-hidden />
          <span className="absolute right-24 top-6 size-14 rounded-full bg-primary/55" aria-hidden />
          <p className={cn(label, "relative")}>{g.yours}</p>
          <p className="font-display relative mt-1 text-[7rem] leading-[0.92]">{level}</p>
          <p className="relative mt-3 text-[1.1875rem] font-semibold tabular-nums">{xp}{next ? ` / ${next}` : ""} {t.app.xp}</p>
          {left !== null && <p className="relative text-[0.8125rem] text-white/85">{fmt(g.toNext, { n: left, s: level + 1 })}</p>}
          <div className="relative mt-3 h-2.5 rounded-full bg-white/[0.22]" role="progressbar" aria-valuenow={xp} aria-valuemax={next ?? xp} aria-label={t.app.xp}>
            <div className="h-2.5 min-w-2.5 rounded-full bg-white" style={{ width: next ? `${Math.min(100, (xp / next) * 100)}%` : "100%" }} />
          </div>
          <p className="relative mt-4 inline-block rounded-2xl bg-white/[0.14] px-4 py-2 text-sm">{nextPrize ? fmt(t.prof.nextPrize, { n: nextPrize.s, prize: nextPrize.t }) : t.prof.allPrizes}</p>
        </section>

        <p className="px-1 text-[0.9375rem] text-muted-foreground">{g.intro}</p>

        <section>
          <h2 className="px-1 text-[1.375rem] font-bold tracking-tight">{g.prizesTitle}</h2>
          <ol className="mt-2 px-1">
            {g.prizes.map((p, i) => {
              const done = level >= p.s, isNext = p === nextPrize;
              return (
                <li key={p.s} className="relative flex min-h-[3.25rem] items-center gap-4">
                  {i < g.prizes.length - 1 && <span className={cn("absolute left-[1.0625rem] top-1/2 h-full w-0.5", (g.prizes[i + 1]?.s ?? Infinity) <= level ? "bg-foreground" : "bg-border")} aria-hidden />}
                  <span className={cn("relative flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums", done ? "border-foreground bg-foreground text-background" : isNext ? "border-primary bg-background text-primary" : "border-border bg-background text-muted-foreground")}>{p.s}</span>
                  <span className={cn("flex-1 py-1.5 leading-snug", isNext ? "font-semibold" : !done && "text-muted-foreground")}>{p.t}</span>
                  {isNext && left !== null && p.s === level + 1 && <span className="shrink-0 text-sm font-medium text-primary">{fmt(g.inXp, { n: left })}</span>}
                </li>
              );
            })}
          </ol>
        </section>

        <section>
          <h2 className="px-1 text-[1.375rem] font-bold tracking-tight">{g.earnTitle}</h2>
          <ul className="mt-3 space-y-3 px-1">
            {g.earn.map((e) => <li key={e.t} className="flex items-baseline justify-between gap-4"><span>{e.t}</span><span className="shrink-0 whitespace-nowrap font-semibold tabular-nums">{e.v}</span></li>)}
          </ul>
        </section>
      </div>
    </main>
  );
}
