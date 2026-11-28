import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { List, Mountain } from "lucide-react";
import { PILOT_EVENT_ID } from "@/lib/app/events";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { LEAGUE_FLOOR, LEAGUES, leagueColorVar, leagueInk, nextLeague, type League } from "@/lib/app/rating";
import { initials, type RankEntry, type RankMe, type RankSport } from "@/lib/app/rankings";
import { cn } from "@/lib/utils";
import { RankingsMountain } from "./RankingsMountain";
import { PrimaryButton, Segmented } from "./ui";

const label = "text-[0.6875rem] font-semibold uppercase tracking-[0.08em]";

function Avatar({ entry, className }: { entry?: RankEntry | undefined; className?: string }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full bg-background font-semibold", entry ? "border-2" : "border-2 border-dashed text-muted-foreground", className)}
      style={entry ? { borderColor: `var(--league-${entry.league})` } : undefined} aria-hidden>
      {entry ? initials(entry.username) : "?"}
    </span>
  );
}

/** Rankings tab: the mountain (default, as in Figma) or the list, for the athlete's city and one sport. */
export function Rankings({ me, entries }: { me: RankMe; entries: Record<RankSport, RankEntry[]> }) {
  const { t } = useAppLang();
  const [sport, setSport] = useState<RankSport>(me.ratings.run || !me.ratings.bike ? "run" : "bike");
  const [view, setView] = useState<"mountain" | "list">("mountain");
  const all = entries[sport];
  const mine = all.find((e) => e.userId === me.userId);
  const toggle = "flex size-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
  const on = "border-foreground bg-foreground text-background";

  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <div className={cn("pt-safe z-30 bg-background px-4 pb-3", view === "mountain" && "sticky top-0")}>
        <div className="flex items-center gap-2 pl-2 pt-4">
          <h1 className="flex-1 text-[1.75rem] font-bold tracking-tight">{t.app.rankTitle}</h1>
          <button type="button" onClick={() => setView("mountain")} aria-pressed={view === "mountain"} aria-label={t.rank.viewMountain} className={cn(toggle, view === "mountain" && on)}><Mountain className="size-5" /></button>
          <button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} aria-label={t.rank.viewList} className={cn(toggle, view === "list" && on)}><List className="size-5" /></button>
          {me.city && <span className="max-w-28 truncate rounded-full border px-3 py-1.5 text-sm font-medium">{me.city}</span>}
        </div>
        <div className="mt-3"><Segmented label={t.rank.sport} value={sport} onChange={setSport} options={(["run", "bike"] as const).map((s) => ({ value: s, label: t.ev[s] }))} /></div>
      </div>
      {view === "mountain" ? <RankingsMountain key={sport} me={me} sport={sport} all={all} mine={mine} /> : <RankingsList key={sport} me={me} sport={sport} all={all} mine={mine} />}
    </main>
  );
}

/** List view: your card, next to beat, league filter, podium and the list. Empty until the first race is run. */
function RankingsList({ me, sport, all, mine }: { me: RankMe; sport: RankSport; all: RankEntry[]; mine: RankEntry | undefined }) {
  const { t } = useAppLang();
  const [league, setLeague] = useState<League | "all">("all");
  const shown = league === "all" ? all : all.filter((e) => e.league === league);
  const ahead = mine ? all.filter((e) => e.rank < mine.rank).at(-1) : undefined;
  const podium = [shown[1], shown[0], shown[2]] as const;

  return (
    <div className="px-4 pb-8">
      <MyCard me={me} sport={sport} mine={mine} total={all.length} />

      {mine && ahead && (
        <div className="mt-3 flex items-center gap-3 rounded-3xl border p-4">
          <Avatar entry={ahead} className="size-10 text-sm" />
          <div className="min-w-0 flex-1"><p className={cn(label, "text-muted-foreground")}>{t.rank.nextToBeat}</p><p className="truncate font-semibold">{ahead.username} · {ahead.rank}°</p></div>
          <p className="text-sm font-medium">{ahead.rating > mine.rating ? fmt(t.rank.pointsAhead, { n: ahead.rating - mine.rating }) : t.rank.sameRating}</p>
        </div>
      )}

      {all.length > 0 && (
        <div role="group" aria-label={t.rank.filter} className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
          {(["all", ...[...LEAGUES].reverse()] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLeague(l)} aria-pressed={league === l}
              className={cn("min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", league === l && "border-primary bg-primary text-primary-foreground")}>
              {l === "all" ? t.rank.all : t.leagues[l]}
            </button>
          ))}
        </div>
      )}

      {all.length > 0 && shown.length === 0 ? (
        <p className="mt-10 px-6 text-center text-muted-foreground">{t.rank.leagueEmpty}</p>
      ) : (
        <div className="mt-3 rounded-3xl border p-4">
          <ol className="grid grid-cols-3 items-end gap-2 text-center">
            {podium.map((e, i) => {
              const place = [2, 1, 3][i]!;
              return (
                <li key={place} className="flex min-w-0 flex-col items-center">
                  <span className="relative">
                    <Avatar entry={e} className={place === 1 ? "size-[4.5rem] text-xl" : "size-14 text-base"} />
                    <span className={cn("absolute -bottom-2 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full text-xs font-bold", e ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{place}</span>
                  </span>
                  {e && <><p className="mt-3 w-full truncate text-sm font-semibold">{e.username}</p><p className="text-xs text-muted-foreground">{t.leagues[e.league]}</p><p className="text-lg font-bold tabular-nums">{e.rating}</p></>}
                </li>
              );
            })}
          </ol>
          {all.length === 0 && <p className="mt-5 text-center text-sm text-muted-foreground">{me.city ? fmt(t.rank.podiumEmptyCity, { city: me.city }) : t.rank.podiumEmpty}</p>}
        </div>
      )}

      {all.length === 0 ? (
        <div className="mt-3 rounded-3xl border p-2">
          <MyRow me={me} sport={sport} />
          <div className="px-4 pb-4 pt-6 text-center">
            <h2 className="text-lg font-bold">{t.rank.emptyTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.rank.emptySub}</p>
            <Link to="/app/events/$eventId" params={{ eventId: PILOT_EVENT_ID }} className="mt-5 block"><PrimaryButton tabIndex={-1}>{t.rank.seePilot}</PrimaryButton></Link>
          </div>
        </div>
      ) : shown.length > 3 && (
        <ol className="mt-3 divide-y rounded-3xl border px-4">
          {shown.slice(3).map((e) => (
            <li key={e.userId} className={cn("flex items-center gap-3 py-3", e.userId === me.userId && "-mx-2 rounded-2xl bg-muted px-2")}>
              <span className="w-7 text-sm font-medium tabular-nums">{e.rank}</span>
              <Avatar entry={e} className="size-9 text-xs" />
              <div className="min-w-0 flex-1"><p className="truncate font-medium">{e.userId === me.userId ? `${t.rank.you} · ${e.username}` : e.username}</p><p className="text-xs text-muted-foreground">{t.leagues[e.league]}</p></div>
              <span className="font-semibold tabular-nums">{e.rating}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** The coloured card on top: position, rating and points to the next league, or "not ranked yet". */
function MyCard({ me, sport, mine, total }: { me: RankMe; sport: RankSport; mine: RankEntry | undefined; total: number }) {
  const { t } = useAppLang();
  const r = me.ratings[sport];
  if (!r) return <div className="mt-3 rounded-3xl bg-muted p-5 text-muted-foreground">{sport === "run" ? t.rank.noRun : t.rank.noBike}</div>;
  const league = mine?.league ?? r.league, rating = mine?.rating ?? r.rating;
  const next = nextLeague(league);
  const progress = next ? Math.min(1, Math.max(0, (rating - LEAGUE_FLOOR[league]) / (LEAGUE_FLOOR[next] - LEAGUE_FLOOR[league]))) : 1;
  return (
    <section className="mt-3 rounded-3xl p-5" style={{ background: leagueColorVar(league), color: leagueInk(league) }}>
      <div className="flex items-start justify-between gap-3">
        <p className={label}>{[t.rank.yourPosition, me.city].filter(Boolean).join(" · ")}</p>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-black">{t.leagues[league]}</span>
      </div>
      <div className="mt-1 flex items-end justify-between gap-3">
        <p className="flex items-baseline gap-2"><span className="font-display text-5xl leading-none">#{mine ? mine.rank : "—"}</span><span className="text-sm">{mine ? fmt(t.rank.of, { n: total }) : t.rank.notRanked}</span></p>
        {mine && <span className="text-3xl font-bold tabular-nums leading-none">{rating}</span>}
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-white/40"><div className="h-1.5 rounded-full bg-current" style={{ width: mine ? `${progress * 100}%` : 0 }} /></div>
      <p className="mt-2 text-sm">{!mine ? t.rank.firstRace : next ? fmt(t.rank.toNext, { n: LEAGUE_FLOOR[next] - rating, league: t.leagues[next] }) : t.rank.topLeague}</p>
    </section>
  );
}

function MyRow({ me, sport }: { me: RankMe; sport: RankSport }) {
  const { t } = useAppLang();
  const r = me.ratings[sport];
  if (!r) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: leagueColorVar(r.league), color: leagueInk(r.league) }}>
      <span className="w-5 font-medium">—</span>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-black" aria-hidden>{initials(me.username)}</span>
      <div className="min-w-0"><p className="truncate font-semibold">{t.rank.you} · {me.username}</p><p className="text-xs">{t.leagues[r.league]}</p></div>
    </div>
  );
}
