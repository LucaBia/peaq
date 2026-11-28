import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, LocateFixed } from "lucide-react";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { initials, type RankEntry, type RankMe, type RankSport } from "@/lib/app/rankings";
import { LEAGUE_FLOOR, LEAGUES, leagueRange, nextLeague, type League } from "@/lib/app/rating";
import { cn } from "@/lib/utils";

const TOP_DOWN = [...LEAGUES].reverse(); // PEAQ on the summit, Valle at the foot
const ROW = 58; // height of one athlete on the trail
const INK = "#0a1f7a", BLUE = "#0c3ef2";
const MEDAL = ["#f5b800", "#aab1bd", "#c98a4b"];
const label = "text-[0.6875rem] font-semibold uppercase tracking-[0.08em]";
const pill = "flex h-[1.875rem] items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 text-xs shadow-[0_3px_8px_rgba(0,0,0,0.16)]";
const color = (l: League) => `var(--league-${l})`;
/** Dotted white trail that zig-zags down the mountain: one bend per athlete row. */
const TRAIL: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='${ROW * 2}'%3E%3Cpath d='M90 -29L30 29L90 87L30 145' fill='none' stroke='white' stroke-width='4' stroke-linecap='round' stroke-dasharray='0.1 10'/%3E%3C/svg%3E")`,
  backgroundPosition: "center top", backgroundRepeat: "repeat-y",
};

/** The athletes drawn in one league: the first four, or the ones around you in your own league. */
function pick(list: RankEntry[], meId: string) {
  const k = list.findIndex((e) => e.userId === meId);
  return k < 0 ? list.slice(0, 4) : list.slice(Math.max(0, k - 2), Math.max(0, k - 2) + 5);
}

/** One athlete on the trail: avatar on the bend, name pill on the outer side. Rows alternate left and right. */
function Climber({ index, size = 34, avatar, children, tag, innerRef }: { index: number; size?: number; avatar: React.ReactNode; children: React.ReactNode; tag?: React.ReactNode; innerRef?: RefObject<HTMLDivElement | null> }) {
  const left = index % 2 === 0, edge = `calc(50% + ${30 - size / 2}px)`;
  return (
    <div ref={innerRef} className="relative" style={{ height: ROW }}>
      <div className={cn("absolute top-1/2 flex -translate-y-1/2 items-center gap-2", left && "flex-row-reverse")} style={left ? { right: edge } : { left: edge }}>
        <span className="relative flex shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size }}>{avatar}</span>
        <span className="relative">{tag}{children}</span>
      </div>
    </div>
  );
}

/** Mountain view (Figma E4 · Montagna): scroll up to climb the leagues, down to descend. */
export function RankingsMountain({ me, sport, all, mine }: { me: RankMe; sport: RankSport; all: RankEntry[]; mine: RankEntry | undefined }) {
  const { t } = useAppLang();
  const meRef = useRef<HTMLDivElement>(null);
  const empty = all.length === 0;
  const myRating = me.ratings[sport];
  const ahead = mine ? all.filter((e) => e.rank < mine.rank).at(-1) : undefined;
  const behind = mine ? all.find((e) => e.rank > mine.rank) : undefined;
  const target = mine ? nextLeague(mine.league) : null;
  const findMe = (smooth: boolean) => meRef.current?.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
  // With a position, open on you (as in Figma); otherwise from the summit.
  useEffect(() => { if (mine) findMe(false); }, [mine]);

  return (
    <div className="relative flex-1 overflow-x-clip" style={{ background: `linear-gradient(#b5d2ff, #eef5ff 430px, ${color("valle")} 430px)` }}>
      <svg viewBox="0 0 440 430" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[430px] w-full" aria-hidden>
        <circle cx="365" cy="73" r="59" fill="#FFD84D" opacity="0.28" /><circle cx="365" cy="73" r="35" fill="#FFD84D" />
        <g fill="white" opacity="0.9"><ellipse cx="45" cy="118" rx="85" ry="22" /><ellipse cx="100" cy="98" rx="60" ry="20" /><ellipse cx="385" cy="234" rx="85" ry="20" /></g>
        <path d="M-30 430L-30 300L60 215L120 270L170 235L220 300L290 220L350 265L410 205L470 280L470 430Z" fill="#869FF9" />
        <path d="M-30 430L-30 400L90 300L130 320L190 180L205 200L220 150L238 195L252 185L300 300L340 285L470 410L470 430Z" fill={color("peaq")} />
        <defs><linearGradient id="peak-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopOpacity="0.14" /><stop offset="1" stopOpacity="0" /></linearGradient></defs>
        <path d="M220 150L238 195L252 185L300 300L340 285L470 410L470 430L220 430Z" fill="url(#peak-shade)" />
        <path d="M220 150L238 195L246 190L256 222L240 212L228 236L218 214L206 232L198 208L205 200Z" fill="white" opacity="0.96" />
        <rect x="219" y="102" width="3" height="50" fill={INK} /><path d="M222 102L262 115L222 128Z" fill="#E1232D" />
        <path d="M222 238L196 300L246 360L214 430" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.1 10" />
      </svg>

      {/* League scale on the right edge, with a dot on your league. */}
      <div className="pointer-events-none sticky top-[45%] z-10 h-0" aria-hidden>
        <div className="absolute right-2 top-0 flex w-3.5 flex-col gap-0.5 rounded-full bg-white p-[3px] shadow-[0_3px_8px_rgba(0,0,0,0.2)]">
          {TOP_DOWN.map((l) => (
            <span key={l} className="relative h-6 rounded-full" style={{ background: color(l) }}>
              {(mine ? mine.league === l : l === "valle" && !!myRating) && <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: INK }} />}
            </span>
          ))}
        </div>
      </div>

      {empty && <p className={cn(pill, "absolute left-1/2 top-14 -translate-x-1/2 font-semibold")} style={{ color: INK }}>{t.rank.mountainEmpty}</p>}

      <div className="relative pb-24 pt-[250px]">
        {TOP_DOWN.map((l) => {
          const inLeague = all.filter((e) => e.league === l);
          const rows = pick(inLeague, me.userId);
          const unranked = !mine && !!myRating && l === "valle"; // not ranked yet: you wait at the foot
          return (
            <section key={l} className="relative" style={{ background: l === "peaq" ? `linear-gradient(transparent 178px, ${color(l)} 178px)` : color(l) }}>
              {l !== "peaq" && (
                <svg viewBox="0 0 440 48" preserveAspectRatio="none" className="absolute inset-x-0 bottom-full h-12 w-full" aria-hidden>
                  <path d="M0 48L0 20L40 4L100 22L170 0L230 18L290 2L350 20L410 0L440 10L440 48Z" fill={color(l)} /><path d="M0 48L0 20L40 4L100 22L170 0L230 18L290 2L350 20L410 0L440 10L440 48Z" fill="white" opacity="0.45" />
                  <path d="M0 48L0 30L50 12L90 28L150 6L200 26L250 10L300 30L360 8L400 24L440 14L440 49L0 49Z" fill={color(l)} />
                </svg>
              )}
              <div className="relative flex flex-col items-center gap-1.5 pt-4">
                <Link to="/app/leagues/$league" params={{ league: l }} className={cn(pill, "min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white")}>
                  <span className="size-2.5 rounded-full" style={{ background: color(l) }} aria-hidden />
                  <span className="font-semibold uppercase tracking-[0.06em]" style={{ color: INK }}>{t.leagues[l]}</span>
                  <span className="text-muted-foreground">{leagueRange(l)}</span><ChevronRight className="size-3.5 text-muted-foreground" aria-hidden />
                </Link>
                {mine && target === l && <span className="rounded-full px-3 py-1 text-[0.6875rem] font-medium text-white" style={{ background: INK }}>▲ {fmt(t.rank.missing, { n: Math.max(0, LEAGUE_FLOOR[l] - mine.rating) })}</span>}
              </div>
              <div className="mt-3 pb-20" style={{ ...TRAIL, minHeight: ROW * 3 + 80 }}>
                {rows.map((e, k) => e.userId === me.userId ? (
                  <Climber key={e.userId} index={k} size={46} innerRef={meRef}
                    avatar={<span className="flex size-full items-center justify-center rounded-full border-2 border-white text-base font-semibold text-white shadow-[0_0_0_10px_rgba(255,255,255,0.3)]" style={{ background: INK }}>{initials(me.username)[0]}</span>}>
                    <span className="flex h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(0,0,0,0.28)]" style={{ background: INK }}><span className="uppercase">{t.rank.you}</span>&nbsp;· {e.rank}° · {e.rating}</span>
                  </Climber>
                ) : (
                  <Climber key={e.userId} index={k}
                    avatar={<>
                      <span className="flex size-full items-center justify-center rounded-full border-2 bg-white text-[0.6875rem] font-semibold" style={{ color: INK, borderColor: MEDAL[e.rank - 1] ?? "white" }}>{initials(e.username)}</span>
                      {e.rank <= 3 && <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full text-[0.6875rem] font-bold leading-none text-white" style={{ background: MEDAL[e.rank - 1] }}>{e.rank}</span>}
                    </>}
                    tag={e === ahead ? <span className={cn(label, "absolute -top-3 left-2 z-10 rounded px-1 leading-4 text-white")} style={{ background: BLUE }}>{t.rank.toBeat}</span>
                      : e === behind ? <span className={cn(label, "absolute -top-3 left-2 z-10 rounded bg-black px-1 leading-4 text-white")}>{t.rank.chasing}</span> : undefined}>
                    <span className={pill} style={e === ahead ? { boxShadow: `0 0 0 2px ${BLUE}` } : undefined}>
                      {e.rank > 3 && <span className="text-muted-foreground">{e.rank}°</span>}
                      <span className="max-w-24 truncate font-medium" style={{ color: INK }}>{e.username}</span><span className="tabular-nums text-muted-foreground">{e.rating}</span>
                    </span>
                  </Climber>
                ))}
                {unranked && (
                  <Climber index={0} size={46} innerRef={meRef}
                    avatar={<span className="flex size-full items-center justify-center rounded-full border-2 border-white text-base font-semibold text-white shadow-[0_0_0_10px_rgba(255,255,255,0.3)]" style={{ background: INK }}>{initials(me.username)[0]}</span>}>
                    <span className="flex h-10 items-center rounded-full px-4 text-sm font-semibold uppercase text-white shadow-[0_6px_14px_rgba(0,0,0,0.28)]" style={{ background: INK }}>{t.rank.you}</span>
                  </Climber>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Your card, floating just above the tab bar of the app layout (3.5rem + its bottom safe area + 1px border). */}
      <div className="sticky z-20 -mt-24 px-3 pb-3" style={{ bottom: "calc(3.5rem + max(env(safe-area-inset-bottom), 1rem) + 1px)" }}>
        <div className="flex items-center gap-3 rounded-3xl bg-background p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 text-lg font-semibold text-white" style={{ background: INK, borderColor: myRating ? color(mine?.league ?? myRating.league) : "white" }} aria-hidden>{initials(me.username)[0]}</span>
          <div className="min-w-0 flex-1">
            {mine ? <>
              <p className="flex items-baseline gap-1.5"><span className="font-display text-2xl leading-none" style={{ color: INK }}>{mine.rank}°</span>{me.city && <span className="truncate font-medium">{fmt(t.rank.posIn, { city: me.city })}</span>}</p>
              <p className="truncate text-[0.8125rem] text-muted-foreground">{ahead ? fmt(t.rank.toPass, { n: Math.max(1, ahead.rating - mine.rating), name: ahead.username }) : t.rank.first}</p>
            </> : <>
              <p className="truncate font-semibold">{t.rank.notRankedTitle}</p>
              <p className="truncate text-[0.8125rem] text-muted-foreground">{t.rank.notRankedSub}</p>
            </>}
          </div>
          {(mine || myRating) && <button type="button" onClick={() => findMe(true)} aria-label={t.rank.findMe} className="flex size-11 shrink-0 items-center justify-center rounded-full text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" style={{ background: BLUE }}><LocateFixed className="size-5" /></button>}
        </div>
      </div>
    </div>
  );
}
