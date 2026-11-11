import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
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

/** Custom PEAQ wordmark: the Q's tail becomes a rising peak. */
export function Wordmark({ className, accent = true }: { className?: string; accent?: boolean }) {
  return (
    <svg viewBox="0 0 420 110" className={cn("block", className)} role="img" aria-label="PEAQ">
      <g fill="currentColor">
        {/* P */}
        <path d="M0 4h58c26 0 42 14 42 37s-16 37-42 37H30v28H0V4Zm30 26v22h24c9 0 14-4 14-11s-5-11-14-11H30Z" />
        {/* E */}
        <path d="M110 4h86v26h-56v12h50v24h-50v14h58v26h-88V4Z" />
        {/* A — apex replaced with a mountain peak, no crossbar */}
        <path d="M250 4h30l44 102h-32l-27-66-27 66h-32L250 4Z" />
      </g>
      {/* Q */}
      <path fill="currentColor" d="M372 2c27 0 48 22 48 52 0 13-4 25-11 34l-30 0c12-6 20-19 20-34 0-17-12-29-27-29s-27 12-27 29 12 29 27 29h2v25h-2c-28 0-50-23-50-54S344 2 372 2Z" />
      <path className={accent ? "text-primary" : ""} fill="currentColor" d="M378 108l18-26 10 12 14-20v34h-42Z" />
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

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || reducedMotion()) return;
    setOn(true);
  }, []);
  useEffect(() => {
    if (!on || !dot.current) return;
    const el = dot.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const move = (e: MouseEvent) => {
      xTo(e.clientX); yTo(e.clientY);
      const hot = (e.target as HTMLElement).closest("a,button,[data-cursor]");
      gsap.to(el, { scale: hot ? 3.2 : 1, duration: 0.3 });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [on]);
  if (!on) return null;
  return <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1.5 -mt-1.5 size-3 rounded-full bg-primary mix-blend-difference" />;
}

export function Counter({ to, decimals = 0, className, suffix = "" }: { to: number; decimals?: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) => v.toLocaleString("it-IT", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (reducedMotion()) { el.textContent = fmt(to); return; }
    const o = { v: 0 };
    el.textContent = fmt(0);
    const tw = gsap.to(o, { v: to, duration: 2, ease: "power3.out", onUpdate: () => { el.textContent = fmt(o.v); }, scrollTrigger: { trigger: el, start: "top 90%" } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [to, decimals, suffix]);
  return <span ref={ref} className={cn("tabular-nums", className)} />;
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("eyebrow flex items-center gap-3 text-muted-foreground", className)}>
      <span className="h-px w-8 bg-primary" />
      {children}
    </div>
  );
}

export function PreviewTag({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow inline-flex items-center gap-2 border border-primary/40 px-2.5 py-1 text-primary">
      <span className="size-1.5 rounded-full bg-primary animate-blink" />
      {children}
    </span>
  );
}

/** Splits text into masked words for reveal animations. */
export function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <span data-word className="inline-block">{w}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
