import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppFrame, LangSwitch, PrimaryButton } from "@/components/app/ui";
import { Wordmark } from "@/components/peaq/core";
import { supabase } from "@/integrations/supabase/client";
import { useAppLang } from "@/lib/app/i18n";
import { LEAGUES } from "@/lib/app/rating";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [
    { title: "Benvenuto in PEAQ" }, { name: "description", content: "Gare per runner e ciclisti, divise per livello." },
    { property: "og:title", content: "Benvenuto in PEAQ" }, { property: "og:description", content: "Gare per runner e ciclisti, divise per livello." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Welcome,
});

/** First screen for who isn't signed in (Figma A1–A3): a short splash, then Sign up / Log in. */
function Welcome() {
  const { t } = useAppLang();
  const nav = useNavigate();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) nav({ to: "/app", replace: true }); });
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => setSplash(false), still ? 0 : 1800);
    return () => clearTimeout(id);
  }, [nav]);

  if (splash) return (
    <AppFrame>
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <Wordmark className="h-9 w-auto animate-in zoom-in-95 fade-in duration-500" />
        <p className="text-lg text-muted-foreground animate-in fade-in fill-mode-both delay-500 duration-700">{t.welcome.tagline}</p>
      </div>
    </AppFrame>
  );
  return (
    <AppFrame>
      <div className="pt-safe flex justify-end px-4"><LangSwitch /></div>
      <div className="flex flex-1 flex-col justify-center px-6 animate-in fade-in duration-500">
        <Wordmark className="h-8 w-auto self-start" />
        <div className="mt-8 flex gap-1" aria-hidden>{LEAGUES.map((l) => <span key={l} className="h-1.5 w-7 rounded-full" style={{ background: `var(--league-${l})` }} />)}</div>
        <h1 className="mt-4 whitespace-pre-line text-5xl font-bold leading-[1.1] tracking-tight">{t.welcome.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t.welcome.sub}</p>
      </div>
      <div className="pb-safe space-y-3 px-4">
        <Link to="/signup" search={{}} className="block"><PrimaryButton tabIndex={-1}>{t.auth.signup}</PrimaryButton></Link>
        <Link to="/auth" search={{}} className="block"><PrimaryButton variant="outline" tabIndex={-1}>{t.auth.login}</PrimaryButton></Link>
      </div>
    </AppFrame>
  );
}
