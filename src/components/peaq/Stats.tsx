import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { Counter, gsap, PreviewTag, SectionLabel, useGsap } from "./core";

const series = [42, 48, 45, 58, 62, 60, 71, 76, 74, 83, 88, 94];
const results = [
  { e: "City 10K", tm: "38:42", p: 12 },
  { e: "Half Marathon", tm: "1:39:18", p: 34 },
  { e: "Gran Fondo", tm: "4:12:05", p: 58 },
  { e: "Night 5K", tm: "18:51", p: 7 },
];

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const W = 600, H = 220;
  const pts = series.map((v, i) => [(i / (series.length - 1)) * W, H - (v / 100) * H] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  useGsap(ref, () => {
    gsap.from("[data-s-title] > span > span", { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 70%" } });
    const path = ref.current!.querySelector<SVGPathElement>("[data-line-path]");
    if (path) {
      const len = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", scrollTrigger: { trigger: path, start: "top 85%" } });
    }
    gsap.from("[data-bar]", { scaleY: 0, transformOrigin: "bottom", stagger: 0.04, duration: 1, ease: "expo.out", scrollTrigger: { trigger: "[data-bars]", start: "top 90%" } });
    gsap.from("[data-tile]", { y: 60, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: "[data-tiles]", start: "top 85%" } });
  }, [lang]);

  return (
    <section ref={ref} className="relative border-t py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <SectionLabel className="md:col-span-3">{t.stats.eyebrow}</SectionLabel>
          <div className="md:col-span-9">
            <h2 data-s-title className="display text-[16vw] md:text-[11vw]">
              {t.stats.title.split(" ").map((w, i) => <span key={i} className="mr-[0.2em] inline-block overflow-hidden"><span className={`inline-block ${i === t.stats.title.split(" ").length - 1 ? "text-primary" : ""}`}>{w}</span></span>)}
            </h2>
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <p className="max-w-md text-lg text-foreground/70">{t.stats.text}</p>
              <PreviewTag>{t.stats.preview}</PreviewTag>
            </div>
          </div>
        </div>

        <div data-tiles className="mt-16 grid gap-px bg-border md:mt-24 md:grid-cols-12">
          {[[t.stats.races, 37, 0, ""], [t.stats.run, 1284.6, 1, ""], [t.stats.ride, 4612, 0, ""]].map(([l, v, dec], i) => (
            <div key={i} data-tile className="bg-background p-6 md:col-span-4 md:p-8">
              <div className="eyebrow text-muted-foreground">{l as string}</div>
              <Counter to={v as number} decimals={dec as number} className="display mt-4 block text-6xl md:text-8xl" />
            </div>
          ))}

          <div data-tile className="bg-background p-6 md:col-span-8 md:p-8">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-muted-foreground">{t.stats.progress}</span>
              <span className="font-mono text-xs text-primary">+124%</span>
            </div>
            <svg viewBox={`0 -10 ${W} ${H + 20}`} className="mt-6 h-56 w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
              {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className="stroke-border" strokeDasharray="2 6" />)}
              <path d={`${d} L${W},${H} L0,${H} Z`} className="fill-primary/10" />
              <path data-line-path d={d} fill="none" className="stroke-primary" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" className="fill-background stroke-primary" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[0.6rem] text-muted-foreground">
              {t.stats.months.map((m) => <span key={m}>{m}</span>)}
            </div>
          </div>

          <div data-tile className="flex flex-col justify-between bg-primary p-6 text-primary-foreground md:col-span-4 md:p-8">
            <span className="eyebrow">{t.stats.milestone}</span>
            <div>
              <div className="display text-7xl">1:39</div>
              <p className="mt-2 font-medium">{t.stats.milestoneText}</p>
            </div>
            <div data-bars className="mt-6 flex h-16 items-end gap-1">
              {series.map((v, i) => <span key={i} data-bar className="flex-1 bg-primary-foreground" style={{ height: `${v}%`, opacity: 0.25 + i / 16 }} />)}
            </div>
          </div>

          <div data-tile className="bg-background p-6 md:col-span-12 md:p-8">
            <div className="eyebrow mb-4 text-muted-foreground">{t.stats.history}</div>
            <div className="grid gap-px bg-border sm:grid-cols-2 md:grid-cols-4">
              {results.map((r) => (
                <div key={r.e} className="bg-background p-4">
                  <div className="font-mono text-xs text-muted-foreground">{r.e}</div>
                  <div className="display mt-2 text-4xl">{r.tm}</div>
                  <div className="mt-1 font-mono text-xs text-primary">P{r.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
