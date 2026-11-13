import { useRef, useState, type ReactNode } from "react";
import { Bell, Calendar, Check, MapPin, Trophy, User, Users } from "lucide-react";
import { Bib } from "../Bib";
import { BottomBar, PrimaryButton } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { LEAGUES, leagueColorVar } from "@/lib/app/rating";
import { cn } from "@/lib/utils";
import { useOb } from "./context";

function Slide({ title, children, visual }: { title: string; children: ReactNode; visual: ReactNode }) {
  return (
    <section className="flex w-full shrink-0 snap-center flex-col px-6 pt-4">
      <div className="flex h-64 items-center justify-center rounded-3xl bg-muted p-6">{visual}</div>
      <h2 className="mt-8 text-[1.75rem] font-bold leading-tight tracking-tight">{title}</h2>
      <div className="mt-3 text-muted-foreground">{children}</div>
    </section>
  );
}

export function IntroStep() {
  const { t } = useAppLang();
  const { data, goTo } = useOb();
  const s = t.ob.intro;
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const p = data.profile!;
  const go = (n: number) => ref.current?.scrollTo({ left: n * ref.current.clientWidth, behavior: "smooth" });
  const last = i === 4;

  return (
    <>
      <div className="flex justify-end px-6"><button type="button" onClick={() => goTo(8)} className="min-h-11 px-2 text-sm font-medium text-muted-foreground hover:text-foreground">{t.common.skip}</button></div>
      <div ref={ref} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-roledescription="carousel">
        <Slide title={s.s1.t} visual={
          <div className="w-full max-w-60 space-y-2">
            {[[User, s.s1.profile], [Calendar, s.s1.events], [Trophy, s.s1.rankings]].map(([I, l], k) => { const Icon = I as typeof User; return (
              <div key={k} className="flex items-center gap-3 rounded-2xl bg-background p-3 shadow-sm"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon className="size-4" /></span><span className="font-semibold">{l as string}</span></div>
            ); })}
          </div>}>
          <ul className="space-y-2 text-sm">
            <li><strong className="text-foreground">{s.s1.profile}</strong> — {s.s1.profileD}</li>
            <li><strong className="text-foreground">{s.s1.events}</strong> — {s.s1.eventsD}</li>
            <li><strong className="text-foreground">{s.s1.rankings}</strong> — {s.s1.rankingsD}</li>
          </ul>
        </Slide>
        <Slide title={s.s2.t} visual={<div className="w-full max-w-64"><Bib number={p.bib_number!} username={p.username!} discipline={p.discipline as "run"} league="collina" /></div>}>
          <ul className="space-y-2 text-sm">{s.s2.items.map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-foreground" />{x}</li>)}</ul>
        </Slide>
        <Slide title={s.s3.t} visual={
          <div className="flex h-full w-full items-end justify-center gap-2">
            {LEAGUES.map((l, k) => (
              <div key={l} className="flex flex-1 flex-col items-center gap-2">
                <div className={cn("w-full rounded-t-lg", i === 2 && "animate-in slide-in-from-bottom-8 fade-in duration-700")} style={{ height: `${30 + k * 26}px`, background: leagueColorVar(l), animationDelay: `${k * 90}ms`, animationFillMode: "both" }} />
                <span className="text-[0.6rem] font-semibold uppercase tracking-wide">{t.leagues[l]}</span>
              </div>
            ))}
          </div>}>
          <p className="text-sm">{s.s3.d}</p>
        </Slide>
        <Slide title={s.s4.t} visual={
          <div className="w-full max-w-64 rounded-2xl bg-background p-5 shadow-sm">
            <div className="flex items-baseline justify-between"><span className="text-lg font-bold">{s.s4.level}</span><span className="text-sm text-muted-foreground tabular-nums">0 / 200 XP</span></div>
            <div className="mt-3 h-2 rounded-full bg-muted"><div className="h-2 w-0 rounded-full bg-primary" /></div>
          </div>}>
          <p className="text-sm">{s.s4.d}</p>
        </Slide>
        <Slide title={s.s5.t} visual={
          <div className="grid grid-cols-2 gap-2">
            {[Trophy, Users, MapPin, Bell].map((Icon, k) => <div key={k} className="flex size-20 items-center justify-center rounded-2xl bg-background shadow-sm"><Icon className="size-7" /></div>)}
          </div>}>
          <ul className="space-y-1.5 text-sm">{s.s5.items.map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-foreground" />{x}</li>)}</ul>
          <p className="mt-5 text-xl font-bold text-foreground">{s.s5.end}</p>
        </Slide>
      </div>
      <BottomBar>
        <div className="flex justify-center gap-2" aria-hidden>{Array.from({ length: 5 }, (_, k) => <span key={k} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-6 bg-primary" : "w-1.5 bg-border")} />)}</div>
        <PrimaryButton onClick={() => (last ? goTo(8) : go(i + 1))}>{last ? s.s5.cta : t.common.continue}</PrimaryButton>
      </BottomBar>
    </>
  );
}
