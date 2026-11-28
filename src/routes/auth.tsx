import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthScreen } from "@/components/app/AuthScreen";
import { SocialAuth } from "@/components/app/SocialAuth";
import { Body, BottomBar, Field, Notice, PasswordInput, PrimaryButton, TextInput, Title } from "@/components/app/ui";
import { useAppLang } from "@/lib/app/i18n";
import { authService, mapAuthError } from "@/lib/app/auth";
import { isEmail } from "@/lib/app/validation";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ email: z.string().optional() }),
  head: () => ({ meta: [
    { title: "Accedi — PEAQ" }, { name: "description", content: "Accedi al tuo profilo atleta PEAQ." },
    { property: "og:title", content: "Accedi — PEAQ" }, { property: "og:description", content: "Accedi al tuo profilo atleta PEAQ." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Login,
});

function Login() {
  const { t } = useAppLang();
  const nav = useNavigate();
  const [email, setEmail] = useState(Route.useSearch().email ?? "");
  const [pw, setPw] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<{ msg: string; unconfirmed?: boolean } | null>(null);
  const emailErr = submitted && !isEmail(email) ? t.auth.errEmail : null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true); setErr(null);
    if (!isEmail(email) || !pw || loading) return;
    setLoading(true);
    try {
      await authService.signIn(email, pw);
      nav({ to: "/onboarding", replace: true });
    } catch (e) {
      const k = mapAuthError(e as never);
      setErr({ msg: k === "network" ? t.common.networkError : t.auth[k], unconfirmed: k === "errNotConfirmed" });
    } finally { setLoading(false); }
  }

  return (
    <AuthScreen backTo="/">
      <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
        <Body>
          <Title sub={t.auth.loginSub}>{t.auth.loginTitle}</Title>
          <div className="space-y-5">
            <Field id="email" label={t.auth.email} error={emailErr}>
              <TextInput id="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" value={email} invalid={!!emailErr} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field id="pw" label={t.auth.password}>
              <PasswordInput id="pw" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
            </Field>
            <Link to="/forgot-password" className="inline-block py-2 text-sm font-medium underline-offset-4 hover:underline">{t.auth.forgot}</Link>
            {err && (
              <Notice tone="error">
                {err.msg}
                {err.unconfirmed && <> <Link to="/verify-email" search={{ email }} className="font-semibold underline">{t.auth.resend}</Link></>}
              </Notice>
            )}
            <SocialAuth />
          </div>
        </Body>
        <BottomBar>
          <PrimaryButton type="submit" loading={loading}>{t.auth.loginCta}</PrimaryButton>
          <p className="pb-1 text-center text-sm text-muted-foreground">{t.auth.noAccount} <Link to="/signup" search={{}} className="font-semibold text-foreground underline-offset-4 hover:underline">{t.auth.signup}</Link></p>
        </BottomBar>
      </form>
    </AuthScreen>
  );
}
