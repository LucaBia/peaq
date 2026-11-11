import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { gsap, PreviewTag, reducedMotion, ScrollTrigger, SectionLabel, useGsap } from "./core";

const cities = ["Milano", "Roma", "Firenze", "Torino", "Bologna"];
const names = ["Giulia Ferri", "Luca Marchetti", "Sara Conti", "Davide Rossi", "Elena Galli", "Paolo Riva", "Chiara Moretti", "Andrea Fontana"];

function rows(city: string, disc: number) {
  const seed = city.length * 13 + disc * 7;
  return names.map((n, i) => ({
    name: names[(i + seed) % names.length],
    bib: String(((seed * (i + 3) * 37) % 9000) + 100).padStart(4, "0"),
    pts: Math.round(2480 - i * (140 + (seed % 40)) - ((seed * i) % 60)),
    trend: (seed + i) % 3 === 0 ? -1 : (seed + i) % 3 === 1 ? 1 : 0,
  }));
}

export function Rankings() {
  const ref = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const { t, lang } = useLang();
  const [city, setCity] = useState(0);
  const [disc, setDisc] = useState(0);
  const data = rows(cities[city] ?? "Milano", disc);

  useGsap(ref, () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-pin]", start: "top top", end: "+=120%", scrub: 1, pin: true } });
    tl.fromTo("[data-bigcity]", { scale: 1 }, { scale: 0.18, yPercent: -230, xPercent: -40, ease: "power2.inOut" })
      .fromTo("[data-board]", { opacity: 0, y: 120 }, { opacity: 1, y: 0, ease: "power2.out" }, 0.35);
  }, [lang]);

  // animate numbers on data change
  useEffect(() => {
    if (!board.current) return;
    const els = board.current.querySelectorAll<HTMLElement>("[data-pts]");
    const run = () => els.forEach((el, i) => {
      const to = Number(el.dataset["pts"]);
      if (reducedMotion()) { el.textContent = to.toLocaleString("it-IT"); return; }
      const o = { v: 0 };
      gsap.to(o, { v: to, duration: 1.4, delay: i * 0.05, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString("it-IT"); } });
    });
    run();
    if (!reducedMotion()) gsap.from(board.current.querySelectorAll("[data-row]"), { x: -30, opacity: 0, stagger: 0.05, duration: 0.6, ease: "power3.out" });
    ScrollTrigger.refresh();
  }, [city, disc]);

  return (
    <section ref={ref} className="relative border-t">
      <div data-pin className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <div data-bigcity className="display whitespace-nowrap text-[30vw] text-primary">{cities[city]}</div>
        </div>
        <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
          <div data-board className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionLabel>{t.rank.eyebrow}</SectionLabel>
              <h2 className="display mt-8 text-[13vw] md:text-[5.2vw]">{t.rank.title[0]}<br /><span className="text-outline">{t.rank.title[1]}</span></h2>
              <div className="mt-8"><PreviewTag>{t.rank.preview}</PreviewTag></div>
              <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="City">
                {cities.map((c, i) => (
                  <button key={c} role="tab" aria-selected={city === i} onClick={() => setCity(i)} className={cn("eyebrow border px-3 py-2 transition-colors", city === i ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground")}>{c}</button>
                ))}
              </div>
            </div>
            <div className="md:col-span-8">
              <div className="border bg-card/80 backdrop-blur-md">
                <div className="flex items-center justify-between border-b p-3">
                  <div className="flex" role="tablist">
                    {[t.rank.running, t.rank.cycling].map((d, i) => (
                      <button key={d} role="tab" aria-selected={disc === i} onClick={() => setDisc(i)} className={cn("eyebrow px-4 py-2 transition-colors", disc === i ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>{d}</button>
                    ))}
                  </div>
                  <span className="eyebrow hidden text-muted-foreground sm:block">{cities[city]} · S01</span>
                </div>
                <div ref={board}>
                  <div className="eyebrow grid grid-cols-[3rem_1fr_4rem_5rem] gap-2 border-b px-4 py-2 text-[0.6rem] text-muted-foreground md:grid-cols-[4rem_1fr_6rem_8rem_3rem]">
                    <span>{t.rank.pos}</span><span>{t.rank.name}</span><span>{t.rank.bib}</span><span className="text-right">{t.rank.pts}</span><span className="hidden md:block" />
                  </div>
                  {data.map((r, i) => (
                    <div key={`${city}-${disc}-${i}`} data-row className={cn("grid grid-cols-[3rem_1fr_4rem_5rem] items-center gap-2 border-b px-4 py-3 last:border-0 md:grid-cols-[4rem_1fr_6rem_8rem_3rem]", i === 0 && "bg-primary/10")}>
                      <span className={cn("display text-2xl md:text-3xl", i < 3 ? "text-primary" : "text-muted-foreground")}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="truncate font-medium">{r.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">#{r.bib}</span>
                      <span data-pts={r.pts} className="text-right font-mono tabular-nums">0</span>
                      <span className={cn("hidden text-right font-mono text-xs md:block", r.trend > 0 ? "text-primary" : r.trend < 0 ? "text-destructive" : "text-muted-foreground")}>{r.trend > 0 ? "▲" : r.trend < 0 ? "▼" : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
