import { useRef } from "react";
import runImg from "@/assets/runner-close.jpg";
import rideImg from "@/assets/cyclist.jpg";
import heroImg from "@/assets/hero-runner.jpg";
import { useLang } from "@/lib/i18n";
import { gsap, PreviewTag, SectionLabel, useGsap } from "./core";

const art = [heroImg, rideImg, runImg, rideImg];

export function Events() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { t, lang } = useLang();

  useGsap(ref, () => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const el = track.current!;
      const dist = () => el.scrollWidth - window.innerWidth + 80;
      gsap.to(el, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: "[data-ev-pin]", start: "top top", end: () => `+=${dist()}`, scrub: 1, pin: true, invalidateOnRefresh: true } });
      gsap.utils.toArray<HTMLElement>("[data-ev-img]").forEach((img) => {
        gsap.fromTo(img, { xPercent: -12 }, { xPercent: 12, ease: "none", scrollTrigger: { trigger: "[data-ev-pin]", start: "top top", end: () => `+=${dist()}`, scrub: true } });
      });
    });
  }, [lang]);

  return (
    <section id="events" ref={ref} className="relative border-t">
      <div data-ev-pin className="flex min-h-[100svh] flex-col justify-center overflow-hidden py-24">
        <div className="mx-auto mb-12 flex w-full max-w-[1600px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <SectionLabel>{t.events.eyebrow}</SectionLabel>
            <h2 className="display mt-8 text-[13vw] md:text-[6vw]">{t.events.title[0]}<br /><span className="text-primary">{t.events.title[1]}</span></h2>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <PreviewTag>{t.events.concept}</PreviewTag>
            <p className="max-w-xs text-sm text-muted-foreground md:text-right">{t.events.note}</p>
          </div>
        </div>
        <div ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:w-max md:snap-none md:gap-6 md:overflow-visible md:px-10">
          {t.events.list.map((e, i) => (
            <article key={e.t} data-cursor className="group relative h-[62vh] w-[82vw] shrink-0 snap-center overflow-hidden border bg-card md:h-[64vh] md:w-[38vw]">
              <div className="absolute inset-0 overflow-hidden">
                <img data-ev-img src={art[i]} alt="" loading="lazy" className="h-full w-[125%] max-w-none object-cover opacity-50 grayscale transition-all duration-700 group-hover:opacity-70 group-hover:grayscale-0" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="display absolute -right-4 -top-6 text-[14rem] leading-none text-outline">{String(i + 1).padStart(2, "0")}</div>
              <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="eyebrow border border-foreground/30 px-2 py-1">{e.d}</span>
                  <span className="eyebrow text-primary">{t.events.concept}</span>
                </div>
                <div>
                  <div className="mb-4 h-px w-full bg-gradient-to-r from-primary to-transparent" />
                  <h3 className="display text-5xl md:text-6xl">{e.t}</h3>
                  <div className="mt-4 flex gap-6 font-mono text-xs uppercase tracking-widest text-foreground/70">
                    <span>{e.l}</span><span className="text-primary">{e.k}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
