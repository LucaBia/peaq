import { useEffect, useId, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs a GSAP setup scoped to ref and reverts it on unmount. */
export function useGsap(ref: RefObject<HTMLElement | null>, fn: (ctx: gsap.Context) => void, deps: unknown[] = []) {
  useIso(() => {
    if (!ref.current) return;
    if (reducedMotion()) return;
    const ctx = gsap.context((self) => fn(self), ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Custom PEAQ wordmark: the Q's tail is a twin mountain peak breaking through the ring. */
export function Wordmark({ className, accent = true }: { className?: string; accent?: boolean }) {
  const id = useId().replace(/:/g, "");
  const peak = "M368 110L400 64L413 80L428 56L446 110Z";
  return (
    <svg viewBox="0 0 446 110" className={cn("block", className)} role="img" aria-label="PEAQ">
      <defs>
        <mask id={`q${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="446" height="110">
          <rect width="446" height="110" fill="white" />
          <path d={peak} fill="black" stroke="black" strokeWidth="14" strokeLinejoin="round" />
        </mask>
      </defs>
      <g fill="currentColor">
        <path d="M0 4h58c26 0 42 14 42 37s-16 37-42 37H30v28H0V4Zm30 26v22h24c9 0 14-4 14-11s-5-11-14-11H30Z" />
        <path d="M110 4h86v26h-56v12h50v24h-50v14h58v26h-88V4Z" />
        <path d="M250 4h30l44 102h-32l-27-66-27 66h-32L250 4Z" />
        <path mask={`url(#q${id})`} fillRule="evenodd" d="M386 4a51 51 0 1 1 0 102a51 51 0 1 1 0-102Zm0 27a24 24 0 1 0 0 48a24 24 0 1 0 0-48Z" />
      </g>
      <path className={accent ? "text-primary" : ""} fill="currentColor" d={peak} />
    </svg>
  );
}

export function Magnetic({ children, className, strength = 0.35 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || window.matchMedia("(hover: none)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * strength);
      yTo((e.clientY - r.top - r.height / 2) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength]);
  return <div ref={ref} className={cn("inline-block", className)}>{children}</div>;
}


/** Fades up every [data-reveal] inside ref as it scrolls into view. `data-reveal="0.2"` delays that element. */
export function useReveal(ref: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGsap(ref, (self) => {
    (self.selector?.("[data-reveal]") as HTMLElement[] | undefined)?.forEach((el) =>
      gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", delay: Number(el.dataset["reveal"]) || 0, scrollTrigger: { trigger: el, start: "top 90%" } }));
  }, deps);
}

/** Tilts its content towards the pointer, like a card held in the hand. Still on touch screens and with reduced motion. */
export function Tilt({ children, className, max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || window.matchMedia("(hover: none)").matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 2 * max);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 2 * max);
    };
    const leave = () => { rx(0); ry(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [max]);
  return <div className={cn("[perspective:1000px]", className)}><div ref={ref} className="[transform-style:preserve-3d]">{children}</div></div>;
}

/** Small upper-case label + big title of a landing section. */
export function Heading({ eyebrow, title, sub, className, light, strong }: { eyebrow?: string; title: string; sub?: string; className?: string; light?: boolean; /** Darker supporting text, for coloured backgrounds. */ strong?: boolean }) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <p data-reveal className={cn("mb-4 text-[0.8125rem] font-medium uppercase tracking-[0.12em]", light ? "text-white/75" : "text-primary")}>{eyebrow}</p>}
      <h2 data-reveal className="whitespace-pre-line text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[1.04] tracking-tight">{title}</h2>
      {sub && <p data-reveal="0.1" className={cn("mt-5 text-lg", light ? "text-white/80" : strong ? "text-[#4a4f5c]" : "text-muted-foreground")}>{sub}</p>}
    </div>
  );
}

export const wrap = "mx-auto w-full max-w-6xl px-5 md:px-8";
