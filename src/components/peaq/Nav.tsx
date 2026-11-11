import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLang, type Lang } from "@/lib/i18n";
import { Magnetic, Wordmark } from "./core";

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <div className={cn("eyebrow flex items-center gap-1", className)} role="group" aria-label={t.nav.lang}>
      {(["it", "en"] as Lang[]).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground">/</span>}
          <button onClick={() => setLang(l)} aria-pressed={lang === l} className={cn("px-1 py-1 transition-colors", lang === l ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

export function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [["#concept", t.nav.concept], ["#features", t.nav.features], ["#events", t.nav.events]] as const;
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "border-b bg-background/80 py-3 backdrop-blur-md" : "py-6")}>
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 md:px-10">
        <a href="#top" aria-label="PEAQ" className="w-24 text-foreground md:w-28"><Wordmark /></a>
        <ul className="hidden items-center gap-10 md:flex">
          {links.map(([h, l]) => (
            <li key={h}><a href={h} className="eyebrow text-foreground/80 transition-colors hover:text-primary">{l}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-4 md:gap-6">
          <LangSwitch className="hidden sm:flex" />
          <Magnetic className="hidden md:inline-block">
            <a href="#waitlist" className="eyebrow inline-flex bg-primary px-5 py-3 font-bold text-primary-foreground transition-transform hover:scale-105">{t.nav.cta}</a>
          </Magnetic>
          <button className="eyebrow md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? t.nav.close : t.nav.menu}>
            {open ? "✕" : "Menu"}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t bg-background px-5 py-8 md:hidden">
          <ul className="space-y-4">
            {links.map(([h, l]) => (
              <li key={h}><a href={h} onClick={() => setOpen(false)} className="display text-5xl">{l}</a></li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-between">
            <LangSwitch />
            <a href="#waitlist" onClick={() => setOpen(false)} className="eyebrow bg-primary px-5 py-3 font-bold text-primary-foreground">{t.nav.cta}</a>
          </div>
        </div>
      )}
    </header>
  );
}
