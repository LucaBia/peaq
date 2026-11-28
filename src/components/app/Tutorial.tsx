import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { Bib } from "./Bib";
import { LeagueScale } from "./Guides";
import { BottomBar, PrimaryButton } from "./ui";
import { PILOT_STARTS } from "@/lib/app/events";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { leagueColorVar, leagueInk, PROVISIONAL_BASELINE, type League } from "@/lib/app/rating";
import { cn } from "@/lib/utils";

const SLIDES = 6;
const cap = "text-[0.6875rem] font-semibold";

function Slide({ title, items, visual }: { title: string; items: ReactNode[]; visual: ReactNode }) {
  return (
    <section className="flex w-full shrink-0 snap-center flex-col px-6 pt-2">
      <div className="flex h-64 items-center justify-center rounded-[1.75rem] bg-muted p-5">{visual}</div>
      <h2 className="mt-7 whitespace-pre-line text-[clamp(1.875rem,8.4vw,2.25rem)] font-bold leading-[1.12] tracking-tight">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-[1.0625rem]">
        {items.map((x, k) => <li key={k} className="flex gap-3"><span className="mt-[0.5625rem] size-2 shrink-0 rounded-full bg-primary" aria-hidden /><span>{x}</span></li>)}
      </ul>
    </section>
  );
}

/** "How PEAQ works" in six slides (Figma A15). Used at the end of the onboarding and from Help. */
export function Tutorial({ bib, username, discipline, rating = PROVISIONAL_BASELINE.rating, league = PROVISIONAL_BASELINE.league, onDone, onSkip }: {
  bib: number; username: string; discipline: "run" | "bike" | "both"; rating?: number | undefined; league?: League | undefined; onDone: () => void; onSkip: () => void;
}) {
  const { t } = useAppLang();
  const s = t.ob.intro;
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const go = (n: number) => ref.current?.scrollTo({ left: n * ref.current.clientWidth, behavior: "smooth" });
  const last = i === SLIDES - 1;
  const mini = "rounded-2xl bg-background p-2.5 shadow-sm";
  const bar = "h-1.5 rounded-full bg-border";

  return (
    <>
      <div className="grid grid-cols-3 items-center px-4">
        <div>{i > 0 && <button type="button" onClick={() => go(i - 1)} aria-label={t.common.back} className="flex size-11 items-center justify-center rounded-full hover:bg-muted"><ChevronLeft className="size-6" /></button>}</div>
        <p className="text-center text-sm tabular-nums text-muted-foreground">{fmt(s.count, { n: i + 1, t: SLIDES })}</p>
        <button type="button" onClick={onSkip} className="min-h-11 justify-self-end px-2 text-[0.9375rem] text-muted-foreground hover:text-foreground">{t.common.skip}</button>
      </div>
      <div ref={ref} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-roledescription="carousel">
        <Slide title={s.s1.t} items={[[s.s1.profile, s.s1.profileD], [s.s1.events, s.s1.eventsD], [s.s1.rankings, s.s1.rankingsD]].map(([b, d]) => <span key={b}><strong>{b}:</strong> {d}</span>)} visual={
          <div className="grid w-full grid-cols-3 gap-2">
            <div className={cn(mini, "space-y-2")}>
              <div className="flex h-12 items-center justify-center rounded-lg font-display text-xl" style={{ background: leagueColorVar(league), color: leagueInk(league) }}>{bib}</div>
              <div className={bar}><div className="h-1.5 w-3/5 rounded-full bg-foreground" /></div><div className={cn(bar, "w-2/3")} />
              <p className={cn(cap, "pt-1 text-center")}>{s.s1.profile}</p>
            </div>
            <div className={cn(mini, "space-y-2")}>
              {[0, 1, 2].map((k) => <div key={k} className="flex h-[1.125rem] items-center gap-1.5 rounded-md bg-muted px-1.5"><span className="size-1.5 rounded-full bg-primary" /><span className={cn(bar, "flex-1")} /></div>)}
              <p className={cn(cap, "pt-1 text-center")}>{s.s1.events}</p>
            </div>
            <div className={cn(mini, "space-y-2")}>
              {[1, 2, 3, 4].map((k) => <div key={k} className="flex h-3 items-center gap-1.5"><span className="w-2 text-[0.6875rem] leading-none text-muted-foreground">{k}</span><span className={cn("h-1.5 flex-1 rounded-full", k === 3 ? "" : "bg-border")} style={k === 3 ? { background: leagueColorVar(league) } : undefined} /></div>)}
              <p className={cn(cap, "pt-1 text-center")}>{s.s1.rankings}</p>
            </div>
          </div>} />
        <Slide title={s.s2.t} items={s.s2.items} visual={<div className="w-full max-w-64"><Bib number={bib} username={username} discipline={discipline} league={league} /></div>} />
        <Slide title={s.s3.t} items={s.s3.items} visual={
          <div className="flex w-full flex-col justify-between self-stretch">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-sm text-muted-foreground">{discipline === "bike" ? t.app.bikeRating : t.app.runRating}</p><p className="text-5xl font-light leading-none tabular-nums">{rating}</p></div>
              <span className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: leagueColorVar(league), color: leagueInk(league) }}>{t.leagues[league]}</span>
            </div>
            <LeagueScale you={league} />
          </div>} />
        <Slide title={s.s4.t} items={s.s4.items} visual={
          <div className="flex w-full flex-col justify-between self-stretch">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-sm text-muted-foreground">{s.s4.yours}</p><p className="text-5xl font-light leading-none">1</p></div>
              <span className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold tabular-nums text-background">0 / 200 XP</span>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold">{s.s4.bonus}</p>
              <ol className="grid grid-cols-5 gap-1 text-center">
                {s.s4.steps.map((x, k) => (
                  <li key={x.s}>
                    <span className={cn("mx-auto flex size-8 items-center justify-center rounded-full border-2 text-sm font-bold", k === 0 ? "border-foreground bg-foreground text-background" : k === 1 ? "border-foreground bg-background" : "bg-background text-muted-foreground")}>{x.s}</span>
                    <span className={cn("mt-1 block text-[0.6875rem] leading-tight", k === 0 && "font-semibold")}>{x.t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>} />
        <Slide title={s.s5.t} items={s.s5.items} visual={
          <div className="w-full space-y-2.5">
            <div className="rounded-2xl bg-background p-3.5 shadow-sm">
              <div className="flex items-center justify-between gap-3"><span className={cn(cap, "uppercase tracking-[0.08em] text-muted-foreground")}>{t.ev.dateTbd}</span><span className={cn(cap, "rounded-full border px-2 py-0.5 uppercase tracking-[0.08em]")}>{t.ev.inviteOnly}</span></div>
              <p className="mt-1.5 font-semibold">{t.pilot.title}</p><p className="text-xs text-muted-foreground">{t.pilot.place}</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-semibold">{PILOT_STARTS.map((l) => <span key={l} className="rounded-full py-1.5" style={{ background: leagueColorVar(l), color: leagueInk(l) }}>{t.leagues[l]}</span>)}</div>
            <div className="rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground">{t.pilot.confirm}</div>
          </div>} />
        <Slide title={s.s6.t} items={s.s6.items} visual={
          <div className="w-full max-w-64 space-y-2">
            <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #ffde6b, #f5b800)", color: "#1f1700" }}>
              <p className="text-xs">{t.pilot.title}</p>
              <div className="mt-1 flex items-end gap-3"><span className="text-5xl font-light leading-none">1°</span><span><span className={cn(cap, "block uppercase tracking-[0.08em]")}>{s.s6.first}</span><span className="block text-xs">{s.s6.of}</span></span></div>
            </div>
            <div className="grid grid-cols-3 items-end gap-2 rounded-2xl bg-background p-3 pb-0 text-center shadow-sm">
              {([[2, "h-7", "#d5d9e0"], [1, "h-11", "#f5b800"], [3, "h-5", "#dfa06b"]] as const).map(([n, h, c]) => <div key={n} className={cn(cap, "flex items-center justify-center rounded-t-md text-[#1f1700]", h)} style={{ background: c }}>{n}</div>)}
            </div>
          </div>} />
      </div>
      <BottomBar>
        <div className="flex justify-center gap-2" aria-hidden>{Array.from({ length: SLIDES }, (_, k) => <span key={k} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-6 bg-foreground" : "w-1.5 bg-border")} />)}</div>
        <PrimaryButton onClick={() => (last ? onDone() : go(i + 1))}>{s.next}</PrimaryButton>
      </BottomBar>
    </>
  );
}
