import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, PreviewTag, reducedMotion, SectionLabel, SplitWords, useGsap, Wordmark } from "./core";

const profiles = [
  { name: "Giulia Ferri", num: "0427", city: "Milano", disc: "Running", since: "2027" },
  { name: "Marco Bellandi", num: "1186", city: "Firenze", disc: "Cycling", since: "2027" },
  { name: "Sara Conti", num: "0093", city: "Torino", disc: "Running", since: "2027" },
];

function FakeCode({ seed }: { seed: string }) {
  const cells = Array.from({ length: 121 }, (_, i) => {
    const r = Math.sin((i + 1) * (Number(seed) + 7)) * 10000;
    return r - Math.floor(r) > 0.5;
  });
  const corner = (i: number) => { const x = i % 11, y = Math.floor(i / 11); return (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7); };
  return (
    <div className="grid size-20 grid-cols-11 gap-[1px] md:size-24" aria-hidden>
      {cells.map((on, i) => <span key={i} className={corner(i) || on ? "bg-primary-foreground" : ""} />)}
    </div>
  );
}

export function AthleteBib() {
  const ref = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);
  const { t, lang } = useLang();
  const [idx, setIdx] = useState(0);
  const p = profiles[idx];

  useGsap(ref, () => {
    gsap.from("[data-word]", { yPercent: 110, duration: 1.1, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 70%" } });
    gsap.from(card.current, { rotateX: 60, rotateZ: -12, y: 200, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: card.current, start: "top 85%" } });
  }, [lang]);

  useEffect(() => {
    const el = card.current;
    if (!el || reducedMotion() || window.matchMedia("(hover: none)").matches) return;
    const rx = gsap.quickTo(el, "rotateX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(el, "rotateY", { duration: 0.8, ease: "power3" });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      rx(-y * 18); ry(x * 22);
      if (shine.current) shine.current.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, color-mix(in oklab, var(--foreground) 35%, transparent), transparent 55%)`;
    };
    const leave = () => { rx(0); ry(0); };
    const parent = el.parentElement!;
    parent.addEventListener("mousemove", move); parent.addEventListener("mouseleave", leave);
    return () => { parent.removeEventListener("mousemove", move); parent.removeEventListener("mouseleave", leave); };
  }, []);

  const next = () => {
    if (reducedMotion() || !card.current) return setIdx((i) => (i + 1) % profiles.length);
    gsap.to(card.current, { rotateY: 90, duration: 0.35, ease: "power2.in", onComplete: () => {
      setIdx((i) => (i + 1) % profiles.length);
      gsap.fromTo(card.current, { rotateY: -90 }, { rotateY: 0, duration: 0.6, ease: "expo.out" });
    } });
  };

  return (
    <section id="features" ref={ref} className="relative overflow-hidden border-t py-24 md:py-40">
      <div className="pointer-events-none absolute -right-[10vw] top-1/2 -translate-y-1/2 display text-[45vw] text-outline opacity-40 select-none" aria-hidden>{p.num}</div>
      <div className="relative mx-auto grid max-w-[1600px] items-center gap-16 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-6">
          <SectionLabel>{t.bib.eyebrow}</SectionLabel>
          <h2 className="display mt-8 text-[11vw] md:text-[5.6vw]">
            <SplitWords text={t.bib.title[0]} className="block" />
            <SplitWords text={t.bib.title[1]} className="block text-primary" />
          </h2>
          <p className="mt-8 max-w-md text-lg text-foreground/70">{t.bib.text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <PreviewTag>{t.bib.preview}</PreviewTag>
            <button onClick={next} className="eyebrow border px-4 py-2 transition-colors hover:border-primary hover:text-primary">{t.bib.next} →</button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{t.bib.note}</p>
        </div>

        <div className="flex justify-center md:col-span-6" style={{ perspective: "1400px" }}>
          <div ref={card} className="relative w-full max-w-[440px] select-none" style={{ transformStyle: "preserve-3d" }}>
            <div className="relative aspect-[1.25/1] overflow-hidden bg-primary p-5 text-primary-foreground shadow-2xl glow-lime md:p-7">
              <div className="absolute inset-x-0 top-0 flex justify-between px-4 pt-2">
                {[0, 1].map((k) => <span key={k} className="size-3 rounded-full bg-background" />)}
              </div>
              <div className="flex items-start justify-between">
                <div className="w-20"><Wordmark accent={false} /></div>
                <div className="text-right font-mono text-[0.6rem] uppercase leading-tight tracking-widest">Athlete ID<br />{t.bib.preview}</div>
              </div>
              <div className="display mt-2 text-[7.5rem] leading-[0.8] md:text-[9rem]">{p.num}</div>
              <div className="mt-3 flex items-end justify-between gap-4 border-t border-primary-foreground/30 pt-3">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-[0.62rem] uppercase tracking-wider">
                  <dt className="opacity-60">{t.bib.athlete}</dt><dd className="font-bold">{p.name}</dd>
                  <dt className="opacity-60">{t.bib.city}</dt><dd className="font-bold">{p.city}</dd>
                  <dt className="opacity-60">{t.bib.discipline}</dt><dd className="font-bold">{p.disc}</dd>
                  <dt className="opacity-60">{t.bib.since}</dt><dd className="font-bold">{p.since}</dd>
                </dl>
                <FakeCode seed={p.num} />
              </div>
              <div className="absolute inset-y-0 right-0 w-2 bg-[repeating-linear-gradient(0deg,var(--primary-foreground)_0_2px,transparent_2px_6px)] opacity-40" />
              <div ref={shine} className="pointer-events-none absolute inset-0 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
