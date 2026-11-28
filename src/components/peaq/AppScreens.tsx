import { useRef, type ReactNode } from "react";
import { Calendar, Trophy, User } from "lucide-react";
import raceImg from "@/assets/hero-runner.jpg";
import { EventsList } from "@/components/app/Events";
import { ProfileScreen } from "@/components/app/Profile";
import { Rankings } from "@/components/app/Rankings";
import { pilotEvent } from "@/lib/app/events";
import { appDict } from "@/lib/app/i18n";
import type { RankEntry } from "@/lib/app/rankings";
import type { League } from "@/lib/app/rating";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { gsap, Heading, useGsap, useReveal, wrap } from "./core";

// Invented athletes for the screens: the same components of the app, fed with sample data.
const leagueOf = (r: number): League => (r >= 800 ? "peaq" : r >= 650 ? "vetta" : r >= 500 ? "cresta" : r >= 350 ? "passo" : r >= 200 ? "collina" : "valle");
const NAMES = ["lorenzoa", "beatricez", "tommasof", "irenel", "nicolab", "martinac", "stefanop", "riccardom", "giulian", "camillar", "marcot", "giometto", "alberton", "francescad", "lucaf", "elenab", "davider", "sofial", "saram", "ginevrat", "paolor", "darios", "norab", "ettorem", "brandog"];
const SCORES = [871, 842, 815, 798, 781, 764, 749, 649, 641, 621, 618, 612, 609, 607, 604, 598, 499, 498, 431, 349, 348, 335, 199, 197, 173];
const ENTRIES: RankEntry[] = NAMES.map((n, i) => ({ userId: n === "giometto" ? "me" : n, username: n, rating: SCORES[i]!, league: leagueOf(SCORES[i]!), rank: i + 1 }));
const rating = (discipline: string, r: number, provisional: boolean) => ({ discipline, rating: r, league: leagueOf(r), provisional, placement_races_completed: provisional ? 1 : 3, placement_races_required: 3 });

/** A phone showing one screen of the app, drawn at 390 px and scaled down. Not interactive: it is a picture made of live components. */
function Phone({ tab, label, children, className }: { tab: 0 | 1 | 2; label: string; children: ReactNode; className?: string }) {
  const { lang } = useLang();
  const tabs = appDict[lang].app.tabs;
  const items = [[User, tabs.profile], [Calendar, tabs.events], [Trophy, tabs.rankings]] as const;
  return (
    <div role="img" aria-label={label} className={cn("relative h-[calc(800px*var(--s))] w-[calc(390px*var(--s))] shrink-0", className)}>
      <div inert aria-hidden className="absolute left-0 top-0 flex h-[800px] w-[390px] origin-top-left scale-[var(--s)] flex-col overflow-hidden rounded-[3rem] border-[10px] border-[#0b0b0f] bg-background shadow-[0_50px_90px_-40px_rgb(0_0_0/0.55)]">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        <div className="grid shrink-0 grid-cols-3 border-t bg-background pb-4 pt-2">
          {items.map(([Icon, name], i) => <span key={name} className={cn("flex flex-col items-center gap-1 text-[0.7rem] font-medium", i === tab ? "text-foreground" : "text-muted-foreground")}><Icon className="size-6" />{name}</span>)}
        </div>
      </div>
    </div>
  );
}

/** The three tabs of the app as they really are: profile, rankings and events. */
export function AppScreens() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const a = appDict[lang];
  const pilot = { ...pilotEvent(a), image: raceImg };
  useReveal(ref);
  useGsap(ref, () => {
    // On wide screens the two side phones drift at a different speed from the middle one.
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      gsap.fromTo("[data-phone='side']", { y: 70 }, { y: -30, ease: "none", scrollTrigger: { trigger: "[data-phones]", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo("[data-phone='mid']", { y: 0 }, { y: -70, ease: "none", scrollTrigger: { trigger: "[data-phones]", start: "top bottom", end: "bottom top", scrub: true } });
    });
  }, []);
  const s = t.screens;
  const phones = [
    <ProfileScreen key="p" bib={236} username="giometto" ratings={[rating("run", 612, false), rating("bike", 380, true)]} level={7} xp={360} racesDone={20} followers={9} following={5} upcoming={[pilot]} />,
    <Rankings key="r" me={{ userId: "me", username: "giometto", city: t.first.city2, ratings: { run: { rating: 612, league: "cresta" } } }} entries={{ run: ENTRIES, bike: [] }} still />,
    <EventsList key="e" events={[pilot]} />,
  ];
  return (
    <section ref={ref} className="overflow-hidden bg-muted py-20 md:py-28">
      <div className={wrap}><Heading eyebrow={s.eyebrow} title={s.title} sub={s.sub} /></div>
      <div data-phones className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-10 [--s:0.66] [scrollbar-width:none] sm:[--s:0.7] lg:justify-center lg:gap-10 lg:overflow-visible lg:[--s:0.78] [&::-webkit-scrollbar]:hidden">
        {phones.map((screen, i) => (
          <figure key={i} data-phone={i === 1 ? "mid" : "side"} className="snap-center">
            <Phone tab={i === 0 ? 0 : i === 1 ? 2 : 1} label={`${s.alt.split(":")[0]}: ${s.items[i]!.t}`}>{screen}</Phone>
            <figcaption className="mt-6 max-w-[calc(390px*var(--s))] text-center"><p className="text-xl font-semibold">{s.items[i]!.t}</p><p className="mt-1 text-muted-foreground">{s.items[i]!.d}</p></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
