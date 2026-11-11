import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion, Wordmark } from "./core";
import { useLang } from "@/lib/i18n";

export function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const { t } = useLang();
  useEffect(() => {
    if (reducedMotion()) { setGone(true); onDone(); return; }
    const o = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { setGone(true); onDone(); } });
    tl.from("[data-l-mark]", { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "expo.inOut" }, 0)
      .to(o, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, "0"); } }, 0)
      .to("[data-l-bar]", { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0)
      .to("[data-l-mark]", { y: -40, opacity: 0, duration: 0.5, ease: "power3.in" }, 1.45)
      .to(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, 1.6);
    return () => { tl.kill(); };
  }, [onDone]);
  if (gone) return null;
  return (
    <div ref={ref} className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-background" style={{ clipPath: "inset(0 0 0 0)" }} aria-label={t.loader} role="status">
      <div data-l-mark className="w-[min(70vw,520px)] text-foreground"><Wordmark /></div>
      <div className="absolute bottom-10 left-6 right-6 flex items-end justify-between md:left-10 md:right-10">
        <span className="eyebrow text-muted-foreground">{t.status}</span>
        <span ref={num} className="display text-5xl text-primary md:text-7xl">000</span>
      </div>
      <div data-l-bar className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-primary" />
    </div>
  );
}
