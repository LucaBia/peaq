import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAppLang } from "@/lib/app/i18n";
import { authService, oauthProviders, type OAuthProvider } from "@/lib/app/auth";
import { Notice } from "./ui";

const AppleLogo = () => (
  <svg viewBox="0 0 17 20" aria-hidden className="size-5 shrink-0 fill-current">
    <path d="M14.05 10.63c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.75.73 1.05 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.33-3.5ZM11.87 4.17c.6-.73 1.01-1.75.9-2.77-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.68.97.07 1.96-.49 2.56-1.22Z" />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" aria-hidden className="size-5 shrink-0">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
  </svg>
);

/** "or" + Continue with Apple / Google, as in Figma A6 Sign up. Renders nothing until a provider is enabled. */
export function SocialAuth() {
  const { t } = useAppLang();
  const [busy, setBusy] = useState<OAuthProvider | null>(null);
  const [err, setErr] = useState(false);
  if (oauthProviders.length === 0) return null;

  async function go(p: OAuthProvider) {
    setErr(false); setBusy(p);
    try { await authService.signInWithProvider(p); } // the browser leaves the page on success
    catch { setErr(true); setBusy(null); }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm text-muted-foreground" aria-hidden>
        <span className="h-px flex-1 bg-border" />{t.auth.or}<span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-3">
        {oauthProviders.map((p) => (
          <button key={p} type="button" onClick={() => go(p)} disabled={busy !== null} aria-busy={busy === p}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border bg-background px-4 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            {busy === p ? <Loader2 className="size-5 animate-spin" /> : p === "apple" ? <AppleLogo /> : <GoogleLogo />}
            <span>{p === "apple" ? t.auth.withApple : t.auth.withGoogle}</span>
          </button>
        ))}
      </div>
      {err && <Notice tone="error">{t.common.networkError}</Notice>}
      <p className="text-center text-xs text-muted-foreground">{t.auth.socialTerms}</p>
    </div>
  );
}
