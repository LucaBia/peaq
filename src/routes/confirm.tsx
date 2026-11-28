import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthScreen } from "@/components/app/AuthScreen";
import { Body, BottomBar, PrimaryButton, Title } from "@/components/app/ui";
import { useAppLang } from "@/lib/app/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/confirm")({
  head: () => ({ meta: [
    { title: "Verifica email — PEAQ" }, { name: "description", content: "Conferma dell'indirizzo email PEAQ." },
    { property: "og:title", content: "Verifica email — PEAQ" }, { property: "og:description", content: "Conferma dell'indirizzo email PEAQ." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Confirm,
});

/** Public landing for the email confirmation link. The auth client reads the token from the URL itself. */
function Confirm() {
  const { t } = useAppLang();
  const nav = useNavigate();
  const [failed, setFailed] = useState(false);
  // Apple/Google sign-in lands here too (?via=oauth): on failure it needs its own message, not "link expired".
  const [oauth] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("via") === "oauth");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1) + "&" + window.location.search.slice(1));
    if (params.get("error") || params.get("error_code")) { setFailed(true); return; }
    let done = false;
    const go = () => { if (!done) { done = true; nav({ to: "/onboarding", replace: true }); } };
    const { data } = supabase.auth.onAuthStateChange((_e, s) => { if (s) go(); });
    supabase.auth.getSession().then(({ data: d }) => { if (d.session) go(); });
    const timer = setTimeout(() => { if (!done) setFailed(true); }, 8000);
    return () => { data.subscription.unsubscribe(); clearTimeout(timer); };
  }, [nav]);

  if (!failed) return (
    <AuthScreen><Body className="flex flex-col items-center justify-center gap-4 text-muted-foreground"><Loader2 className="size-8 animate-spin" /><p>{t.auth.callbackWorking}</p></Body></AuthScreen>
  );
  if (oauth) return (
    <AuthScreen>
      <Body><Title sub={t.auth.oauthFailedSub}>{t.auth.oauthFailed}</Title></Body>
      <BottomBar>
        <Link to="/signup" search={{}}><PrimaryButton tabIndex={-1}>{t.auth.signup}</PrimaryButton></Link>
        <Link to="/auth" search={{}} className="block py-2 text-center text-sm font-medium text-muted-foreground">{t.auth.login}</Link>
      </BottomBar>
    </AuthScreen>
  );
  return (
    <AuthScreen>
      <Body><Title sub={t.auth.linkExpiredSub}>{t.auth.linkExpired}</Title></Body>
      <BottomBar>
        <Link to="/auth"><PrimaryButton tabIndex={-1}>{t.auth.login}</PrimaryButton></Link>
        <Link to="/verify-email" search={{}} className="block py-2 text-center text-sm font-medium text-muted-foreground">{t.auth.resend}</Link>
      </BottomBar>
    </AuthScreen>
  );
}
