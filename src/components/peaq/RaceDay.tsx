import { useRef } from "react";
import { Check, Flag, MessagesSquare, QrCode, Trophy } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { gsap, Heading, useGsap, useReveal, wrap } from "./core";

const ICONS = [MessagesSquare, QrCode, Flag, Trophy];

/** Race day in four moments joined by a line that fills while scrolling, then the sign-up rules. */
export function RaceDay() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  useReveal(ref);
  useGsap(ref, () => {
    gsap.fromTo("[data-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 80%", end: "top 35%", scrub: true } });
  }, []);
  return (
    <section id="races" ref={ref} className="scroll-mt-20 py-20 md:py-28">
      <div className={wrap}>
        <Heading eyebrow={t.raceDay.eyebrow} title={t.raceDay.title} />
        <ol data-steps className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          <span className="absolute left-7 right-[calc((100%-4.5rem)/4-1.75rem)] top-7 hidden h-0.5 bg-border md:block" aria-hidden><span data-line className="block h-full origin-left bg-foreground" /></span>
          {t.raceDay.steps.map((s, i) => {
            const Icon = ICONS[i]!;
            return (
              <li key={s.t} data-reveal={i * 0.08} className="relative flex gap-4 md:block">
                <span className="relative grid size-14 shrink-0 place-items-center rounded-full bg-foreground text-background"><Icon className="size-6" aria-hidden /></span>
                <div><h3 className="text-xl font-semibold md:mt-5">{s.t}</h3><p className="mt-1.5 text-muted-foreground">{s.d}</p></div>
              </li>
            );
          })}
        </ol>
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.raceDay.rules.map((r, i) => <li key={r} data-reveal={i * 0.06} className="flex gap-3 rounded-3xl bg-muted p-5"><Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />{r}</li>)}
        </ul>
      </div>
    </section>
  );
}
