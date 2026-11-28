import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthScreen } from "@/components/app/AuthScreen";
import { Body, BottomBar, Field, Notice, PrimaryButton, TextInput, Title } from "@/components/app/ui";
import { useAppLang } from "@/lib/app/i18n";
import { authService, mapAuthError } from "@/lib/app/auth";
import { isEmail } from "@/lib/app/validation";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [
    { title: "Reimposta password — PEAQ" }, { name: "description", content: "Ricevi un link per reimpostare la password PEAQ." },
    { property: "og:title", content: "Reimposta password — PEAQ" }, { property: "og:description", content: "Ricevi un link per reimpostare la password PEAQ." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Forgot,
});

function Forgot() {
  const { t } = useAppLang();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const emailErr = submitted && !isEmail(email) ? t.auth.errEmail : null;

  async function submit(e: FormEvent) {
    e.preventDefault(); setSubmitted(true); setMsg(null);
    if (!isEmail(email) || loading) return;
    setLoading(true);
    try { await authService.requestReset(email); setMsg({ tone: "success", text: t.auth.forgotSent }); }
    catch (e) { const k = mapAuthError(e as never); setMsg({ tone: "error", text: k === "network" ? t.common.networkError : t.auth[k] }); }
    finally { setLoading(false); }
  }
  return (
    <AuthScreen backTo="/auth">
      <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
        <Body>
          <Title bars sub={t.auth.forgotSub}>{t.auth.forgotTitle}</Title>
          <div className="space-y-3">
            <Field id="email" label={t.auth.email} error={emailErr}>
              <TextInput id="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" value={email} invalid={!!emailErr} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
          </div>
        </Body>
        <BottomBar>
          <PrimaryButton type="submit" loading={loading}>{t.auth.forgotCta}</PrimaryButton>
          <Link to="/auth" search={{}} className="flex min-h-11 items-center justify-center text-[0.9375rem] font-medium text-primary underline-offset-4 hover:underline">{t.auth.backToLogin}</Link>
        </BottomBar>
      </form>
    </AuthScreen>
  );
}
