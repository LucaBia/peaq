import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { AppEvent } from "@/lib/app/events";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { LEAGUE_FLOOR, LEAGUES, leagueColorVar, leagueInk, nextLeague, XP_FOR_NEXT_LEVEL, type League } from "@/lib/app/rating";
import { cn } from "@/lib/utils";
import { Segmented } from "./ui";

type Sport = "run" | "bike";
export type ProfileRating = { discipline: string; rating: number; league: string; provisional: boolean; placement_races_completed: number; placement_races_required: number };

const label = "text-[0.6875rem] font-semibold uppercase tracking-[0.08em]";
const card = "block rounded-3xl border p-5 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Profile tab: league-coloured top with the bib number, then rating, Stage and upcoming races. */
export function ProfileScreen({ bib, username, ratings, level, xp, racesDone, upcoming, actions }: {
  bib: number | null; username: string; ratings: ProfileRating[]; level: number; xp: number; racesDone: number; upcoming: AppEvent[]; actions?: ReactNode;
}) {
  const { t } = useAppLang();
  const sports = (["run", "bike"] as const).filter((s) => ratings.some((r) => r.discipline === s));
  const [sport, setSport] = useState<Sport>(sports[0] ?? "run");
  const r = ratings.find((x) => x.discipline === sport);
  const league = (r?.league as League | undefined) ?? "collina";
  const ink = leagueInk(league);
  const next = nextLeague(league);
  const nextXp = XP_FOR_NEXT_LEVEL[level];
  const nextPrize = t.guide.stage.prizes.find((p) => p.s > level);
  const left = r ? Math.max(0, r.placement_races_required - r.placement_races_completed) : 0;

  return (
    <main className="flex-1 animate-in fade-in duration-300">
      <section className="relative overflow-hidden pb-12 text-center" style={{ background: leagueColorVar(league), color: ink }}>
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-28 w-full" aria-hidden>
          <path d="M0 120 L0 70 L90 40 L150 62 L230 14 L300 56 L400 30 L400 120Z" fill="black" opacity="0.08" />
          <path d="M0 120 L0 96 L120 70 L200 92 L290 60 L400 84 L400 120Z" fill="black" opacity="0.1" />
        </svg>
        <header className="pt-safe relative flex items-center justify-between px-6 pb-1 text-left">
          <h1 className="text-[1.75rem] font-bold tracking-tight">{t.prof.title}</h1>
          <div className="flex items-center gap-1">{actions}</div>
        </header>
        <p className="font-display relative pt-2 leading-[0.9]" style={{ fontSize: bib && bib >= 1000 ? "6.5rem" : "8.5rem" }} aria-label={`${t.ev.yourBib} ${bib ?? ""}`}>{bib ?? "—"}</p>
        <p className="relative mt-2 text-lg font-bold uppercase tracking-wide">{username}</p>
        {r && <p className={cn(label, "relative mt-1.5 inline-block rounded-full bg-white px-3 py-1 text-black")}>{t.leagues[league]} · {t.ev[sport]}</p>}
      </section>

      <div className="relative -mt-6 space-y-3 rounded-t-[1.75rem] bg-background px-4 pb-8 pt-4">
        {sports.length > 1 && <Segmented label={t.rank.sport} value={sport} onChange={setSport} options={sports.map((s) => ({ value: s, label: t.ev[s] }))} />}

        {r ? (
          <Link to="/app/rating" className={card}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{sport === "run" ? t.app.runRating : t.app.bikeRating}</span>
              <span className="flex items-center gap-0.5 text-sm font-semibold">{t.prof.howRating}<ChevronRight className="size-4" aria-hidden /></span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="text-6xl font-light tabular-nums leading-none">{r.rating}{r.provisional && <span className="text-muted-foreground">?</span>}</span>
              <span className="rounded-full px-5 py-2.5 font-semibold" style={{ background: leagueColorVar(league), color: ink }}>{t.leagues[league]}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{r.provisional ? fmt(t.prof.provisionalLeft, { n: left }) : ""}</span>
              <span className="font-semibold">{next ? fmt(t.rank.toNext, { n: Math.max(0, LEAGUE_FLOOR[next] - r.rating), league: t.leagues[next] }) : t.rank.topLeague}</span>
            </div>
            <LeagueBar league={league} rating={r.rating} />
          </Link>
        ) : <p className="rounded-3xl bg-muted p-5 text-muted-foreground">{t.prof.noRating}</p>}

        <Link to="/app/stage" className={card}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-2xl font-bold">{t.app.level} {level}</span>
            <span className="text-sm tabular-nums text-muted-foreground">{xp}{nextXp ? ` / ${nextXp}` : ""} {t.app.xp}</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted" role="progressbar" aria-valuenow={xp} aria-valuemax={nextXp ?? xp} aria-label={t.app.xp}>
            <div className="h-2 min-w-1 rounded-full bg-foreground" style={{ width: nextXp ? `${Math.min(100, (xp / nextXp) * 100)}%` : "100%" }} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{nextPrize ? fmt(t.prof.nextPrize, { n: nextPrize.s, prize: nextPrize.t }) : t.prof.allPrizes}</p>
        </Link>

        <div className="flex items-center justify-between rounded-3xl border px-5 py-4">
          <span className="text-sm text-muted-foreground">{t.prof.racesDone}</span>
          <span className="text-2xl font-bold tabular-nums">{racesDone}</span>
        </div>

        <section className="pt-3">
          <h2 className="px-1 text-xl font-bold tracking-tight">{t.prof.nextRaces}</h2>
          {upcoming.length === 0 ? <p className="mt-2 px-1 text-sm text-muted-foreground">{t.app.noUpcoming}</p> : (
            <ul className="mt-3 space-y-3">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <Link to="/app/events/$eventId" params={{ eventId: e.id }} className="relative flex h-32 flex-col justify-between overflow-hidden rounded-3xl bg-black p-4 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    <img src={e.image} alt="" className="absolute inset-0 size-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/80" />
                    <div className="relative flex items-start justify-between gap-2">
                      <span className={cn(label, "pt-1")}>{e.startsAt ? new Date(e.startsAt).toLocaleDateString() : t.ev.dateTbd}</span>
                      {e.inviteOnly && <span className={cn(label, "rounded-full bg-white px-2.5 py-1 text-black")}>{t.ev.inviteOnly}</span>}
                    </div>
                    <div className="relative"><p className="font-display text-2xl uppercase leading-none">{e.title}</p><p className="mt-1 text-xs text-white/90">{e.location}</p></div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

/** Six segments, one per league; the athlete's one is full colour with a marker at their rating. */
function LeagueBar({ league, rating }: { league: League; rating: number }) {
  const next = nextLeague(league);
  const pos = next ? Math.min(1, Math.max(0, (rating - LEAGUE_FLOOR[league]) / (LEAGUE_FLOOR[next] - LEAGUE_FLOOR[league]))) : 0.5;
  return (
    <div className="mt-2 grid grid-cols-6 gap-1" aria-hidden>
      {LEAGUES.map((l) => (
        <span key={l} className="relative h-1.5 rounded-full" style={{ background: `var(--league-${l})`, opacity: l === league ? 1 : 0.3 }}>
          {l === league && <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background" style={{ left: `${pos * 100}%`, borderColor: `var(--league-${l})` }} />}
        </span>
      ))}
    </div>
  );
}
