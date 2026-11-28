import { useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { Bib } from "./Bib";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { initials } from "@/lib/app/rankings";
import { leagueColorVar, leagueInk, XP_FOR_NEXT_LEVEL } from "@/lib/app/rating";
import type { AthletePublic, AthleteRow } from "@/lib/app/social";
import { cn } from "@/lib/utils";
import { BackHeader, Notice, PrimaryButton, SearchBox, Segmented, Sheet } from "./ui";

type Tab = "followers" | "following";

function FollowButton({ on, busy, onClick }: { on: boolean; busy?: boolean | undefined; onClick: () => void }) {
  const { t } = useAppLang();
  return (
    <button type="button" onClick={onClick} disabled={busy} aria-pressed={on}
      className={cn("min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", on ? "border bg-background" : "bg-primary text-primary-foreground")}>
      {on ? t.soc.followingBtn : t.soc.follow}
    </button>
  );
}

/** A link to an athlete's profile, or plain content while following is switched off (`on` false). */
export function AthleteLink({ id, on, className, style, children }: { id: string; on: boolean; className?: string; style?: CSSProperties | undefined; children: ReactNode }) {
  return on ? <Link to="/app/athletes/$userId" params={{ userId: id }} className={className} style={style}>{children}</Link> : <span className={className} style={style}>{children}</span>;
}

/** Three numbers in a row (races, followers, following), as on the Profile and on the other athletes' profiles. */
export function Counters({ items }: { items: { n: number; label: string; to?: Tab }[] }) {
  const cell = "flex min-h-14 flex-col items-center justify-center rounded-2xl";
  return (
    <div className="grid grid-cols-3 rounded-3xl border p-2 text-center">
      {items.map(({ n, label, to }) => {
        const inner = <><span className="text-2xl tabular-nums leading-tight">{n}</span><span className="text-sm text-muted-foreground">{label}</span></>;
        return to ? <Link key={label} to="/app/athletes" search={{ tab: to }} className={cn(cell, "hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring")}>{inner}</Link> : <div key={label} className={cell}>{inner}</div>;
      })}
    </div>
  );
}

function Rows({ list, meId, busyId, onToggle }: { list: AthleteRow[]; meId: string; busyId?: string | null | undefined; onToggle: (a: AthleteRow) => void }) {
  const { t } = useAppLang();
  return (
    <ul className="divide-y rounded-3xl border px-4">
      {list.map((a) => (
        <li key={a.userId} className="flex items-center gap-3 py-3">
          <Link to="/app/athletes/$userId" params={{ userId: a.userId }} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium" aria-hidden>{initials(a.username)}</span>
            <span className="min-w-0">
              <span className="block truncate text-[1.0625rem]">{a.username}</span>
              <span className="block truncate text-xs text-muted-foreground">{[a.bib && `#${a.bib}`, a.league && t.leagues[a.league], a.discipline && t.disc[a.discipline], a.city].filter(Boolean).join(" · ")}</span>
            </span>
          </Link>
          {a.userId !== meId && <FollowButton on={a.following} busy={busyId === a.userId} onClick={() => onToggle(a)} />}
        </li>
      ))}
    </ul>
  );
}

/** Followers and following (Figma B6), with the athlete search on top. */
export function AthletesScreen({ meId, followers, following, tab, onTab, query, onQuery, results, busyId, onToggle }: {
  meId: string; followers: AthleteRow[]; following: AthleteRow[]; tab: Tab; onTab: (t: Tab) => void;
  query: string; onQuery: (q: string) => void; results: AthleteRow[]; busyId?: string | null | undefined; onToggle: (a: AthleteRow) => void;
}) {
  const { t } = useAppLang();
  const searching = query.trim().length > 0;
  const list = tab === "followers" ? followers : following;
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={t.soc.title} to="/app" />
      <div className="space-y-4 px-4 pb-8 pt-2">
        {!searching && <Segmented label={t.soc.title} value={tab} onChange={onTab} options={[{ value: "followers", label: `${followers.length} ${t.soc.followers}` }, { value: "following", label: `${following.length} ${t.soc.following}` }]} />}
        <SearchBox value={query} onChange={onQuery} placeholder={t.soc.search} />
        {searching ? (
          <>
            <p className="px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{results.length === 1 ? t.soc.count1 : fmt(t.soc.countN, { n: results.length })}</p>
            {results.length > 0 && <Rows list={results} meId={meId} busyId={busyId} onToggle={onToggle} />}
          </>
        ) : list.length > 0 ? <Rows list={list} meId={meId} busyId={busyId} onToggle={onToggle} />
          : <p className="px-6 py-10 text-center text-muted-foreground">{tab === "followers" ? t.soc.noFollowers : t.soc.noFollowing}</p>}
      </div>
    </main>
  );
}

/** Another athlete's profile (Figma B9): bib, counters, Stage and rating, with follow and report / block. */
export function AthleteScreen({ athlete: a, isMe, busy, error, onToggle, onReport, onBlock }: {
  athlete: AthletePublic; isMe: boolean; busy?: boolean; error?: boolean; onToggle: () => void; onReport: () => Promise<void>; onBlock: () => Promise<void>;
}) {
  const { t } = useAppLang();
  const [menu, setMenu] = useState(false);
  const [reported, setReported] = useState(false);
  const nextXp = XP_FOR_NEXT_LEVEL[a.level];
  const sports = (["run", "bike"] as const).filter((s) => a.ratings[s]);
  const league = a.league ?? a.ratings.run?.league ?? a.ratings.bike?.league ?? "collina";
  const card = "rounded-3xl border p-5";
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <div className="flex items-center pr-4">
        <div className="min-w-0 flex-1"><BackHeader title={a.username} onBack={() => window.history.back()} /></div>
        {!isMe && <div className="pt-safe flex items-center gap-1 pb-2">
          <button type="button" onClick={() => setMenu(true)} aria-label={t.soc.menu} className="flex size-11 items-center justify-center rounded-full hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><MoreHorizontal className="size-6" /></button>
          <FollowButton on={a.following} busy={busy} onClick={onToggle} />
        </div>}
      </div>

      <div className="space-y-3 px-4 pb-8 pt-2">
        {(error || reported) && <Notice tone={error ? "error" : "success"}>{error ? t.soc.actionError : t.soc.reported}</Notice>}
        {a.bib != null && <Bib number={a.bib} username={a.username} discipline={a.discipline ?? "run"} league={league} />}
        <Counters items={[{ n: a.racesDone, label: t.soc.races }, { n: a.followers, label: t.soc.followers }, { n: a.followingCount, label: t.soc.following }]} />
        <section className={card}>
          <h2 className="text-2xl font-bold">{t.app.level} {a.level}</h2>
          <div className="mt-3 h-2 rounded-full bg-muted" role="progressbar" aria-valuenow={a.xp} aria-valuemax={nextXp ?? a.xp} aria-label={t.app.xp}>
            <div className="h-2 min-w-1 rounded-full bg-foreground" style={{ width: nextXp ? `${Math.min(100, (a.xp / nextXp) * 100)}%` : "100%" }} />
          </div>
        </section>
        {sports.map((s): ReactNode => {
          const r = a.ratings[s]!;
          return (
            <section key={s} className={card}>
              <p className="text-sm text-muted-foreground">{s === "run" ? t.app.runRating : t.app.bikeRating}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="text-6xl font-light tabular-nums leading-none">{r.rating}</span>
                <span className="rounded-full px-5 py-2.5 font-semibold" style={{ background: leagueColorVar(r.league), color: leagueInk(r.league) }}>{t.leagues[r.league]}</span>
              </div>
            </section>
          );
        })}
      </div>

      <Sheet open={menu} onOpenChange={setMenu} title={a.username}>
        <div className="space-y-3 px-6 pb-2">
          <p className="pb-3 text-muted-foreground">{t.soc.sheetBody}</p>
          <PrimaryButton className="bg-destructive text-white" onClick={() => onReport().then(() => { setReported(true); setMenu(false); }, () => setMenu(false))}>{t.soc.report}</PrimaryButton>
          <PrimaryButton variant="outline" onClick={() => onBlock().then(() => window.history.back(), () => setMenu(false))}>{fmt(t.soc.block, { name: a.username })}</PrimaryButton>
        </div>
      </Sheet>
    </main>
  );
}
