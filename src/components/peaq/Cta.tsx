import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Magnetic } from "./core";

/** True when the visitor already has a session: the landing then offers "Open the app" instead of signing up. */
export function useSignedIn() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try { supabase.auth.getSession().then(({ data }) => setOn(!!data.session)).catch(() => {}); } catch { /* no backend configured */ }
  }, []);
  return on;
}

/** The main action of the landing: create the account (or open the app, for who is already in). */
export function SignupCta({ label, tone = "blue", className }: { label: string; tone?: "blue" | "white"; className?: string }) {
  const { t } = useLang();
  const signedIn = useSignedIn();
  const cls = cn("group inline-flex min-h-14 items-center gap-3 rounded-full pl-7 pr-2.5 text-lg font-semibold transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    tone === "blue" ? "bg-primary text-primary-foreground" : "bg-white text-black", className);
  const arrow = <span className={cn("grid size-9 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1", tone === "blue" ? "bg-white text-primary" : "bg-primary text-white")}><ArrowRight className="size-5" aria-hidden /></span>;
  return (
    <Magnetic strength={0.2}>
      {signedIn ? <Link to="/app" className={cls}>{t.nav.app}{arrow}</Link> : <Link to="/signup" search={{}} className={cls}>{label}{arrow}</Link>}
    </Magnetic>
  );
}

/** On phones, a bar with the main action that slides up once the opening has scrolled away and leaves before the last block. */
export function StickyCta() {
  const { t } = useLang();
  const signedIn = useSignedIn();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(window.scrollY > 520 && window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 620);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const cls = "flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-[0_18px_40px_-16px_rgb(12_62_242/0.7)] active:scale-[0.98]";
  return (
    <div inert={!on} className={cn("pb-safe fixed inset-x-0 bottom-0 z-40 px-4 transition-all duration-300 sm:hidden", on ? "translate-y-0 opacity-100" : "translate-y-full opacity-0")}>
      {signedIn ? <Link to="/app" className={cls}>{t.nav.app}<ArrowRight className="size-5" aria-hidden /></Link> : <Link to="/signup" search={{}} className={cls}>{t.screens.sticky}<ArrowRight className="size-5" aria-hidden /></Link>}
    </div>
  );
}
