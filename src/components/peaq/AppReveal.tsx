import { useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { gsap, SectionLabel, useGsap, Wordmark } from "./core";

function Screen({ i }: { i: number }) {
  const bar = (w: string, c = "bg-foreground/15") => <div className={cn("h-2 rounded-full", c)} style={{ width: w }} />;
  switch (i) {
    case 0: return (
      <div className="space-y-4">
        <div className="flex items-center gap-3"><div className="size-12 rounded-full bg-primary" /><div className="space-y-1.5">{bar("90px", "bg-foreground/60")}{bar("60px")}</div></div>
        <div className="grid grid-cols-3 gap-2">{["37", "1.2K", "P12"].map((v) => <div key={v} className="bg-foreground/5 p-2"><div className="display text-2xl">{v}</div>{bar("70%")}</div>)}</div>
        <div className="space-y-2">{[1, 2, 3].map((k) => <div key={k} className="flex items-center gap-2 bg-foreground/5 p-2"><div className="size-6 bg-primary/70" />{bar("60%")}</div>)}</div>
      </div>);
    case 1: return (
      <div className="flex h-full flex-col justify-center">
        <div className="bg-primary p-4 text-primary-foreground"><div className="w-12"><Wordmark accent={false} /></div><div className="display mt-2 text-7xl">0427</div><div className="mt-2 font-mono text-[0.55rem] uppercase">Giulia Ferri · Milano</div></div>
      </div>);
    case 2: return (
      <div className="space-y-1.5">
        <div className="display mb-3 text-3xl text-primary">Milano</div>
        {[1, 2, 3, 4, 5, 6].map((k) => <div key={k} className={cn("flex items-center gap-2 p-2", k === 1 ? "bg-primary/20" : "bg-foreground/5")}><span className="display w-6 text-lg">{k}</span>{bar(`${80 - k * 8}%`)}</div>)}
      </div>);
    case 3: return (
      <div className="space-y-4">
        <div className="display text-5xl">1.284<span className="text-lg text-muted-foreground"> km</span></div>
        <div className="flex h-28 items-end gap-1">{[30, 45, 40, 60, 55, 70, 65, 85, 80, 95].map((h, k) => <div key={k} className="flex-1 bg-primary" style={{ height: `${h}%`, opacity: 0.4 + k / 16 }} />)}</div>
        <div className="grid grid-cols-2 gap-2">{[1, 2].map((k) => <div key={k} className="bg-foreground/5 p-2">{bar("50%", "bg-primary/70")}<div className="mt-2">{bar("80%")}</div></div>)}</div>
      </div>);
    default: return (
      <div className="space-y-2">
        {["City Run", "Climb", "Night Run"].map((n, k) => <div key={n} className="relative h-20 overflow-hidden bg-foreground/5 p-2"><div className="display text-2xl">{n}</div><div className="absolute bottom-2 left-2">{bar("60px", k === 0 ? "bg-primary" : "bg-foreground/30")}</div></div>)}
      </div>);
  }
}

export function AppReveal() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const [screen, setScreen] = useState(0);
  const n = t.app.screens.length;

  useGsap(ref, () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: "[data-app-pin]", start: "top top", end: "+=250%", scrub: 1, pin: true,
        onUpdate: (s) => setScreen(Math.min(n - 1, Math.floor(s.progress * n))),
      },
    })
      .fromTo("[data-phone]", { rotateY: -35, rotateX: 18, rotateZ: -8, scale: 0.85 }, { rotateY: 0, rotateX: 0, rotateZ: 0, scale: 1, ease: "power2.out", duration: 0.35 })
      .to("[data-phone]", { rotateY: 14, rotateZ: 3, ease: "none", duration: 0.65 });
  }, [lang]);

  return (
    <section ref={ref} className="relative border-t">
      <div data-app-pin className="relative grid min-h-[100svh] items-center overflow-hidden py-24">
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-5 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <SectionLabel>{t.app.eyebrow}</SectionLabel>
            <h2 className="display mt-8 text-[11vw] md:text-[4.8vw]">{t.app.title[0]}<br /><span className="text-primary">{t.app.title[1]}</span></h2>
            <ol className="mt-10 space-y-2">
              {t.app.screens.map((s, i) => (
                <li key={s}>
                  <button onClick={() => setScreen(i)} className={cn("flex w-full items-center gap-4 border-b py-3 text-left transition-colors", screen === i ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                    <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display text-2xl md:text-3xl">{s}</span>
                    <span className={cn("ml-auto h-px bg-primary transition-all duration-500", screen === i ? "w-16" : "w-0")} />
                  </button>
                </li>
              ))}
            </ol>
            <p className="eyebrow mt-6 text-muted-foreground">{t.app.preview}</p>
          </div>
          <div className="flex justify-center md:col-span-7" style={{ perspective: "1600px" }}>
            <div data-phone className="relative h-[600px] w-[290px] rounded-[44px] surface-metal p-[10px] shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
              <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-background">
                <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-graphite" />
                <div className="flex items-center justify-between px-6 pb-2 pt-10">
                  <div className="w-14 text-foreground"><Wordmark /></div>
                  <span className="eyebrow text-[0.55rem] text-primary">{t.app.screens[screen]}</span>
                </div>
                <div key={screen} className="h-[460px] px-5 pt-3 animate-in fade-in slide-in-from-bottom-4 duration-500"><Screen i={screen} /></div>
                <div className="absolute inset-x-0 bottom-0 flex justify-around border-t bg-card px-4 py-3">
                  {t.app.screens.map((s, i) => <span key={s} className={cn("size-1.5 rounded-full", i === screen ? "bg-primary" : "bg-foreground/25")} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
