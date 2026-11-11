import { useRef } from "react";
import heroImg from "@/assets/hero-runner.jpg";
import { useLang } from "@/lib/i18n";
import { gsap, Magnetic, useGsap } from "./core";

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  useGsap(ref, () => {
    if (!ready) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from("[data-hero-img]", { scale: 1.25, duration: 2.2 }, 0)
      .from("[data-line] > span", { yPercent: 110, duration: 1.3, stagger: 0.08 }, 0.1)
      .from("[data-fade]", { opacity: 0, y: 20, duration: 1, stagger: 0.08 }, 0.6);
    gsap.to("[data-hero-img]", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
    gsap.to("[data-hero-type]", { yPercent: -25, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
  }, [ready, lang]);

  const L = ({ children, accent }: { children: string; accent?: boolean }) => (
    <span data-line className="block overflow-hidden"><span className={`block ${accent ? "text-primary" : ""}`}>{children}</span></span>
  );

  return (
    <section id="top" ref={ref} className="grain relative h-[100svh] min-h-[640px] overflow-hidden">
      <div className="absolute inset-0">
        <img data-hero-img src={heroImg} alt="" width={1920} height={1088} className="h-full w-full object-cover object-[70%_center] opacity-70" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/50" />
        <div className="absolute inset-0 grid-lines opacity-60" />
      </div>

      <div data-hero-type className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-24 md:px-10 md:pb-16">
        <div data-fade className="eyebrow mb-6 flex items-center gap-3 text-foreground/80">
          <span className="size-2 rounded-full bg-primary animate-blink" /> {t.status} — 2027
        </div>
        <h1 className="display text-[17vw] md:text-[10.5vw]">
          <L>{t.hero.l1}</L>
          <L>{t.hero.l2}</L>
          <span className="block md:pl-[18vw]"><L>{t.hero.l3}</L></span>
          <span className="block md:pl-[18vw]"><L accent>{t.hero.l4}</L></span>
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p data-fade className="max-w-sm text-base text-foreground/75 md:text-lg">{t.hero.sub}</p>
          <div data-fade>
            <Magnetic>
              <a href="#waitlist" className="group eyebrow inline-flex items-center gap-4 bg-primary py-5 pl-7 pr-5 text-sm font-bold text-primary-foreground glow-lime">
                {t.hero.cta}
                <span className="grid size-8 place-items-center bg-primary-foreground text-primary transition-transform group-hover:rotate-45">↗</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <div data-fade className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="eyebrow text-muted-foreground">{t.hero.scroll}</span>
        <span className="block h-12 w-px bg-foreground/20"><span className="block h-full w-px bg-primary animate-scrollcue" /></span>
      </div>
      <div data-fade className="eyebrow absolute right-5 top-28 z-10 hidden text-right text-muted-foreground md:right-10 md:block">
        45.4642° N<br />9.1900° E
      </div>
    </section>
  );
}
