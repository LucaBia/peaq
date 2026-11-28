import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang, type Lang } from "@/lib/i18n";
import { useSignedIn } from "./Cta";
import { ScrollTrigger, Wordmark, wrap } from "./core";

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.nav.lang} className={cn("flex rounded-full border p-0.5 text-xs font-medium", className)}>
      {(["it", "en"] as Lang[]).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={cn("min-h-11 rounded-full px-3.5 uppercase transition-colors", lang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>{l}</button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t, lang } = useLang();
  const signedIn = useSignedIn();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // A language switch changes the height of the page: measure the scroll triggers again.
  useEffect(() => { const id = setTimeout(() => ScrollTrigger.refresh(), 150); return () => clearTimeout(id); }, [lang]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [["#how", t.nav.how], ["#leagues", t.nav.leagues], ["#stages", t.nav.stages], ["#races", t.nav.races]] as const;
  const pill = "inline-flex min-h-11 items-center rounded-full bg-primary px-5 font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]";
  const cta = signedIn ? <Link to="/app" className={pill}>{t.nav.app}</Link> : <Link to="/signup" search={{}} className={pill}>{t.nav.cta}</Link>;
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled || open ? "border-b bg-background/90 py-2.5 backdrop-blur-md" : "py-4")}>
      <nav className={cn(wrap, "flex items-center justify-between gap-4")}>
        <a href="#top" aria-label="PEAQ" className="flex min-h-11 w-24 items-center"><Wordmark className="w-full" /></a>
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map(([h, l]) => <li key={h}><a href={h} className="inline-flex min-h-11 items-center text-[0.9375rem] font-medium underline-offset-8 hover:underline">{l}</a></li>)}
        </ul>
        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch className="hidden sm:flex" />
          {!signedIn && <Link to="/auth" search={{}} className="hidden min-h-11 items-center px-2 font-medium underline-offset-8 hover:underline sm:inline-flex">{t.nav.login}</Link>}
          <span className="hidden sm:block">{cta}</span>
          <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-muted lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? t.nav.close : t.nav.menu}>
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </nav>
      {open && (
        <div className={cn(wrap, "pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden")}>
          <ul>
            {links.map(([h, l]) => <li key={h}><a href={h} onClick={() => setOpen(false)} className="flex min-h-14 items-center border-b text-2xl font-medium">{l}</a></li>)}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <LangSwitch />
            <div className="flex items-center gap-3">
              {!signedIn && <Link to="/auth" search={{}} className="inline-flex min-h-11 items-center px-2 font-medium">{t.nav.login}</Link>}
              {cta}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
