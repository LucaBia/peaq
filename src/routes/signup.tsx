import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { AuthScreen } from "@/components/app/AuthScreen";
import { SocialAuth } from "@/components/app/SocialAuth";
import { Body, BottomBar, Checkbox, Field, Notice, PasswordInput, PrimaryButton, TextInput, Title } from "@/components/app/ui";
import { useAppLang } from "@/lib/app/i18n";
import { authService, mapAuthError } from "@/lib/app/auth";
import { isEmail, isStrongPassword } from "@/lib/app/validation";

export const Route = createFileRoute("/signup")({
  validateSearch: z.object({ email: z.string().optional() }),
  head: () => ({ meta: [
    { title: "Crea il tuo account — PEAQ" }, { name: "description", content: "Registrati a PEAQ e crea la tua identità di atleta." },
    { property: "og:title", content: "Crea il tuo account — PEAQ" }, { property: "og:description", content: "Registrati a PEAQ e crea la tua identità di atleta." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Signup,
});

function Signup() {
  const { t } = useAppLang();
  const nav = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState(search.email ?? "");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const show = (k: string) => submitted || touched[k];
  const errs = {
    email: !isEmail(email) ? t.auth.errEmail : null,
    pw: !isStrongPassword(pw) ? t.auth.errPassword : null,
    pw2: pw2 !== pw || !pw2 ? t.auth.errMatch : null,
    terms: !terms ? t.auth.errTerms : null,
  };
  const valid = !Object.values(errs).some(Boolean);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true); setErr(null);
    if (!valid || loading) return;
    setLoading(true);
    try {
      await authService.signUp(email, pw);
      nav({ to: "/verify-email", search: { email: email.trim() } });
    } catch (e) {
      const k = mapAuthError(e as never);
      setErr(k === "network" ? t.common.networkError : t.auth[k]);
    } finally { setLoading(false); }
  }

  return (
    <AuthScreen backTo="/">
      <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
        <Body>
          <Title sub={t.auth.signupSub}>{t.auth.signupTitle}</Title>
          <div className="space-y-5">
            <Field id="email" label={t.auth.email} error={show("email") ? errs.email : null}>
              <TextInput id="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" value={email} invalid={!!(show("email") && errs.email)}
                onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((s) => ({ ...s, email: true }))} />
            </Field>
            <Field id="pw" label={t.auth.password} error={show("pw") ? errs.pw : null} hint={t.auth.pwRules}>
              <PasswordInput id="pw" autoComplete="new-password" value={pw} invalid={!!(show("pw") && errs.pw)} onChange={(e) => setPw(e.target.value)} onBlur={() => setTouched((s) => ({ ...s, pw: true }))} />
            </Field>
            <Field id="pw2" label={t.auth.confirmPassword} error={show("pw2") ? errs.pw2 : null}>
              <PasswordInput id="pw2" autoComplete="new-password" value={pw2} invalid={!!(show("pw2") && errs.pw2)} onChange={(e) => setPw2(e.target.value)} onBlur={() => setTouched((s) => ({ ...s, pw2: true }))} />
            </Field>
            <div>
              <Checkbox id="terms" checked={terms} onChange={setTerms}>{t.auth.terms}</Checkbox>
              {submitted && errs.terms && <p role="alert" className="mt-2 text-sm text-destructive">{errs.terms}</p>}
            </div>
            {err && <Notice tone="error">{err}</Notice>}
            <SocialAuth />
          </div>
        </Body>
        <BottomBar>
          <PrimaryButton type="submit" loading={loading}>{t.auth.signupCta}</PrimaryButton>
          <p className="pb-1 text-center text-sm text-muted-foreground">{t.auth.haveAccount} <Link to="/auth" className="font-semibold text-foreground underline-offset-4 hover:underline">{t.auth.login}</Link></p>
        </BottomBar>
      </form>
    </AuthScreen>
  );
}
