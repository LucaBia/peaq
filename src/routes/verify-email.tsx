import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { AuthScreen } from "@/components/app/AuthScreen";
import { Body, BottomBar, Notice, PrimaryButton, Title } from "@/components/app/ui";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { authService, mapAuthError } from "@/lib/app/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/verify-email")({
  validateSearch: z.object({ email: z.string().optional() }),
  head: () => ({ meta: [
    { title: "Controlla la tua email — PEAQ" }, { name: "description", content: "Conferma il tuo indirizzo email per attivare l'account PEAQ." },
    { property: "og:title", content: "Controlla la tua email — PEAQ" }, { property: "og:description", content: "Conferma il tuo indirizzo email per attivare l'account PEAQ." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Verify,
});

function Verify() {
  const { t } = useAppLang();
  const { email = "" } = Route.useSearch();
  const nav = useNavigate();
  const [wait, setWait] = useState(60);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "error" | "muted"; text: string } | null>(null);

  useEffect(() => { if (wait <= 0) return; const id = setTimeout(() => setWait(wait - 1), 1000); return () => clearTimeout(id); }, [wait]);
  // Continue automatically once a verified session appears (e.g. link opened in another tab).
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((ev, s) => { if (s?.user?.email_confirmed_at && ev === "SIGNED_IN") nav({ to: "/onboarding", replace: true }); });
    return () => data.subscription.unsubscribe();
  }, [nav]);

  async function resend() {
    setBusy(true); setMsg(null);
    try { await authService.resendConfirmation(email); setMsg({ tone: "success", text: t.auth.resent }); setWait(60); }
    catch (e) { const k = mapAuthError(e as never); setMsg({ tone: "error", text: k === "network" ? t.common.networkError : t.auth[k] }); }
    finally { setBusy(false); }
  }
  async function confirmed() {
    setBusy(true);
    const { data } = await supabase.auth.getUser();
    setBusy(false);
    if (data.user?.email_confirmed_at) nav({ to: "/onboarding", replace: true });
    else setMsg({ tone: "muted", text: t.auth.notYet });
  }

  return (
    <AuthScreen backTo="/signup">
      <Body>
        <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-muted"><MailCheck className="size-8" aria-hidden /></div>
        <Title sub={<>{t.auth.verifySub} <strong className="break-all text-foreground">{email}</strong></>}>{t.auth.verifyTitle}</Title>
        <p className="text-muted-foreground">{t.auth.verifyHint}</p>
        {msg && <div className="mt-6"><Notice tone={msg.tone}>{msg.text}{msg.tone === "muted" && <> <Link to="/auth" className="font-semibold text-foreground underline">{t.auth.login}</Link></>}</Notice></div>}
      </Body>
      <BottomBar>
        <PrimaryButton onClick={confirmed} loading={busy}>{t.auth.confirmed}</PrimaryButton>
        <PrimaryButton variant="outline" onClick={resend} disabled={!email || wait > 0 || busy}>{wait > 0 ? fmt(t.auth.resendWait, { s: wait }) : t.auth.resend}</PrimaryButton>
        <Link to="/signup" search={{ email }} className="block py-2 text-center text-sm font-medium text-muted-foreground hover:text-foreground">{t.auth.changeEmail}</Link>
      </BottomBar>
    </AuthScreen>
  );
}
