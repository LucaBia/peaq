import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthScreen } from "@/components/app/AuthScreen";
import { Body, BottomBar, Field, Notice, PasswordInput, PrimaryButton, Title } from "@/components/app/ui";
import { useAppLang } from "@/lib/app/i18n";
import { authService, mapAuthError } from "@/lib/app/auth";
import { isStrongPassword } from "@/lib/app/validation";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Nuova password — PEAQ" }, { name: "description", content: "Imposta una nuova password per il tuo account PEAQ." },
    { property: "og:title", content: "Nuova password — PEAQ" }, { property: "og:description", content: "Imposta una nuova password per il tuo account PEAQ." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Reset,
});

function Reset() {
  const { t } = useAppLang();
  const nav = useNavigate();
  const [state, setState] = useState<"checking" | "ready" | "invalid">("checking");
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [submitted, setSubmitted] = useState(false); const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.get("error_code")) { setState("invalid"); return; }
    const { data } = supabase.auth.onAuthStateChange((ev, s) => { if (ev === "PASSWORD_RECOVERY" || s) setState("ready"); });
    supabase.auth.getSession().then(({ data: d }) => { if (d.session) setState("ready"); });
    const timer = setTimeout(() => setState((s) => (s === "checking" ? "invalid" : s)), 6000);
    return () => { data.subscription.unsubscribe(); clearTimeout(timer); };
  }, []);

  const pwErr = submitted && !isStrongPassword(pw) ? t.auth.errPassword : null;
  const pw2Err = submitted && pw !== pw2 ? t.auth.errMatch : null;

  async function submit(e: FormEvent) {
    e.preventDefault(); setSubmitted(true); setErr(null);
    if (!isStrongPassword(pw) || pw !== pw2 || loading) return;
    setLoading(true);
    try { await authService.updatePassword(pw); toast.success(t.auth.resetDone); nav({ to: "/onboarding", replace: true }); }
    catch (e) { const k = mapAuthError(e as never); setErr(k === "network" ? t.common.networkError : t.auth[k]); }
    finally { setLoading(false); }
  }

  if (state === "invalid") return (
    <AuthScreen backTo="/auth">
      <Body><Title bars>{t.auth.resetTitle}</Title><Notice tone="error">{t.auth.resetInvalid}</Notice></Body>
      <BottomBar><Link to="/forgot-password"><PrimaryButton tabIndex={-1}>{t.auth.forgotCta}</PrimaryButton></Link></BottomBar>
    </AuthScreen>
  );
  return (
    <AuthScreen>
      <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
        <Body>
          <Title bars sub={t.auth.pwRules}>{t.auth.resetTitle}</Title>
          <div className="space-y-3">
            <Field id="pw" label={t.auth.password} error={pwErr}><PasswordInput id="pw" autoComplete="new-password" value={pw} invalid={!!pwErr} onChange={(e) => setPw(e.target.value)} /></Field>
            <Field id="pw2" label={t.auth.confirmPassword} error={pw2Err}><PasswordInput id="pw2" autoComplete="new-password" value={pw2} invalid={!!pw2Err} onChange={(e) => setPw2(e.target.value)} /></Field>
            {err && <Notice tone="error">{err}</Notice>}
          </div>
        </Body>
        <BottomBar><PrimaryButton type="submit" loading={loading} disabled={state !== "ready"}>{state === "ready" ? t.auth.resetCta : t.common.loading}</PrimaryButton></BottomBar>
      </form>
    </AuthScreen>
  );
}
