import { useEffect, useRef, useState } from "react";
import runImg from "@/assets/runner-close.jpg";
import rideImg from "@/assets/cyclist.jpg";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { gsap, SectionLabel, SplitWords, useGsap } from "./core";

function Telemetry({ labels, values }: { labels: readonly string[]; values: string[] }) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const i = setInterval(() => setTick((x) => x + 1), 900); return () => clearInterval(i); }, []);
  return (
    <div className="grid grid-cols-3 gap-px bg-border">
      {labels.map((l, i) => (
        <div key={l} className="bg-background/70 p-3 backdrop-blur">
          <div className="eyebrow text-[0.6rem] text-muted-foreground">{l}</div>
          <div className="font-mono text-sm text-primary tabular-nums md:text-base">{(values[i] ?? "").replace("#", String((tick * (i + 3)) % 10))}</div>
        </div>
      ))}
    </div>
  );
}

export function Disciplines() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const [active, setActive] = useState<0 | 1 | null>(null);
  useGsap(ref, () => {
    gsap.from("[data-word]", { yPercent: 110, duration: 1.1, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: "[data-d-title]", start: "top 80%" } });
    gsap.from("[data-panel]", { clipPath: "inset(100% 0 0 0)", duration: 1.4, stagger: 0.15, ease: "expo.inOut", scrollTrigger: { trigger: "[data-panels]", start: "top 75%" } });
  }, [lang]);

  const panels = [
    { img: runImg, name: t.disc.run, meta: t.disc.runMeta, vals: ["4'1#\"/km", "17# spm", "+2#4 m"], n: "01" },
    { img: rideImg, name: t.disc.ride, meta: t.disc.rideMeta, vals: ["28# W", "3#.4 km/h", "8.# %"], n: "02" },
  ];

  return (
    <section id="concept" ref={ref} className="relative py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <SectionLabel className="md:col-span-3">{t.disc.eyebrow}</SectionLabel>
          <div className="md:col-span-9">
            <h2 data-d-title className="display text-[13vw] md:text-[7.5vw]">
              <SplitWords text={t.disc.title[0]} className="block" />
              <SplitWords text={t.disc.title[1]} className="block text-outline" />
            </h2>
            <p className="mt-8 max-w-md text-lg text-foreground/70">{t.disc.text}</p>
          </div>
        </div>

        <div data-panels className="mt-16 flex flex-col gap-2 md:mt-24 md:h-[80vh] md:flex-row" onMouseLeave={() => setActive(null)}>
          {panels.map((p, i) => (
            <button
              key={p.n}
              data-panel
              data-cursor
              onMouseEnter={() => setActive(i as 0 | 1)}
              onFocus={() => setActive(i as 0 | 1)}
              onClick={() => setActive(active === i ? null : (i as 0 | 1))}
              aria-pressed={active === i}
              className={cn(
                "group relative h-[70vh] overflow-hidden text-left transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)] md:h-full",
                active === null ? "md:flex-[1]" : active === i ? "md:flex-[2.2]" : "md:flex-[0.6]",
              )}
            >
              <img src={p.img} alt={p.name} loading="lazy" width={1088} height={1440} className={cn("absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms]", active === i ? "scale-105 grayscale-0" : "grayscale")} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute left-5 top-5 eyebrow text-foreground/80">{p.n} / 02</div>
              <div className="absolute inset-x-5 bottom-5 md:inset-x-8 md:bottom-8">
                <div className={cn("mb-5 transition-all duration-700", active === i ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 md:opacity-0")}>
                  <Telemetry labels={p.meta} values={p.vals} />
                </div>
                <div className={cn("display text-7xl transition-colors duration-500 md:text-[8vw]", active === i && "text-primary")}>{p.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
