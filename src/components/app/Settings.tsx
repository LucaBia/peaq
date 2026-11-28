import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, Minus, Plus } from "lucide-react";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { cn } from "@/lib/utils";
import { BackHeader, PrimaryButton, Sheet } from "./ui";

type Doc = { doc_type: string; status: string; expires_on: string | null };

function Group({ title, children }: { title?: string; children: ReactNode }) {
  return <section>{title && <h2 className="px-4 pb-2 text-sm text-muted-foreground">{title}</h2>}<div className="divide-y overflow-hidden rounded-3xl border">{children}</div></section>;
}

/** One line of a settings list: a link when it has `to`, plain information otherwise. */
function Row({ label, value, to }: { label: string; value?: ReactNode; to?: string }) {
  const cls = "flex min-h-14 items-center gap-3 px-5 py-2";
  const inner = <><span className="flex-1 text-[1.0625rem]">{label}</span>{value != null && <span className="max-w-[55%] truncate text-sm text-muted-foreground">{value}</span>}{to && <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />}</>;
  return to ? <Link to={to} className={cn(cls, "hover:bg-muted/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring")}>{inner}</Link> : <div className={cls}>{inner}</div>;
}

/** Settings (Figma B4): only the rows that work today; the others arrive with their pages. */
export function SettingsScreen({ bib, username, discipline, documents, email, isAdmin, onLogout }: {
  bib: number | null; username: string; discipline: "run" | "bike" | "both" | null; documents: Doc[]; email: string | null; isAdmin: boolean; onLogout: () => void;
}) {
  const { t, lang } = useAppLang();
  const [confirm, setConfirm] = useState(false);
  const doc = (type: string, none: string) => {
    const d = documents.filter((x) => x.doc_type === type).at(-1);
    if (!d) return none;
    if (d.status === "approved" && d.expires_on) return fmt(t.set.validUntil, { d: new Date(d.expires_on).toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", { day: "numeric", month: "short", year: "numeric" }) });
    return t.ob.doc.status[d.status as "pending"];
  };
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={t.set.title} to="/app" />
      <div className="space-y-6 px-4 pb-8 pt-2">
        <Group title={t.set.profile}>
          <Row label={t.set.bib} value={bib ? `#${bib}` : "—"} />
          <Row label={t.set.username} value={username} />
          <Row label={t.set.sports} value={discipline ? t.disc[discipline] : "—"} />
          <Row label={t.set.medical} value={doc("medical_certificate", t.set.notAdded)} />
          <Row label={t.set.membership} value={doc("membership_card", t.set.notAddedF)} />
        </Group>
        <Group title={t.set.app}>
          <Row label={t.set.language} value={lang === "it" ? "Italiano" : "English"} to="/app/language" />
        </Group>
        <Group title={t.set.account}>
          {email && <Row label={t.set.email} value={email} />}
          <Row label={t.set.help} to="/app/help" />
          {isAdmin && <Row label={t.set.admin} to="/admin" />}
        </Group>
        <button type="button" onClick={() => setConfirm(true)} className="flex min-h-14 w-full items-center justify-center rounded-3xl border text-[1.0625rem] font-medium text-destructive hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{t.set.logout}</button>
      </div>
      <Sheet open={confirm} onOpenChange={setConfirm} title={t.set.logoutTitle}>
        <div className="space-y-3 px-6 pb-2">
          <p className="pb-2 text-muted-foreground">{t.set.logoutSub}</p>
          <PrimaryButton onClick={onLogout}>{t.set.logout}</PrimaryButton>
          <PrimaryButton variant="outline" onClick={() => setConfirm(false)}>{t.set.cancel}</PrimaryButton>
        </div>
      </Sheet>
    </main>
  );
}

/** Language (Figma B4.8): tapping a language switches the whole app. */
export function LanguageScreen() {
  const { t, lang, setLang } = useAppLang();
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={t.set.language} to="/app/settings" />
      <div className="px-4 pb-8 pt-2">
        <div role="radiogroup" aria-label={t.set.language} className="divide-y overflow-hidden rounded-3xl border">
          {([["it", "Italiano"], ["en", "English"]] as const).map(([l, name]) => (
            <button key={l} type="button" role="radio" aria-checked={lang === l} onClick={() => setLang(l)} className="flex min-h-14 w-full items-center justify-between gap-3 px-5 text-left text-[1.0625rem] hover:bg-muted/50">
              {name}{lang === l && <Check className="size-5 text-primary" aria-hidden />}
            </button>
          ))}
        </div>
        <p className="px-4 pt-3 text-sm text-muted-foreground">{t.set.langHint}</p>
      </div>
    </main>
  );
}

/** Help (Figma B4.12): the tutorial, the FAQ and the explanation pages. */
export function HelpScreen() {
  const { t } = useAppLang();
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={t.help.title} to="/app/settings" />
      <div className="px-4 pb-8 pt-2">
        <Group>
          <Row label={t.help.how} to="/how" />
          <Row label={t.help.faq} to="/app/faq" />
          <Row label={t.help.rating} to="/app/rating" />
          <Row label={t.help.leagues} to="/app/leagues" />
          <Row label={t.help.stage} to="/app/stage" />
          <Row label={t.help.rules} to="/app/rules" />
        </Group>
      </div>
    </main>
  );
}

/** FAQ (Figma B4.13): one card per question, the first one open. */
export function FaqScreen() {
  const { t } = useAppLang();
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={t.faq.title} to="/app/help" />
      <div className="space-y-2.5 px-4 pb-8 pt-2">
        {t.faq.items.map((x, i) => (
          <details key={x.q} open={i === 0} className="group rounded-3xl border px-5 open:border-foreground">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 font-semibold [&::-webkit-details-marker]:hidden">
              {x.q}<Plus className="size-5 shrink-0 group-open:hidden" aria-hidden /><Minus className="hidden size-5 shrink-0 group-open:block" aria-hidden />
            </summary>
            <p className="pb-4 text-[0.9375rem] text-muted-foreground">{x.a}</p>
            {i === 0 && <Link to="/app/rating" className="-mt-2 mb-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">{t.faq.more}<ChevronRight className="size-4" aria-hidden /></Link>}
          </details>
        ))}
      </div>
    </main>
  );
}

/** Race rules (Figma D5), for the pilot race: one card per topic. */
export function RulesScreen() {
  const { t } = useAppLang();
  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <BackHeader title={t.pilot.rulesTitle} onBack={() => window.history.back()} />
      <p className="px-5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t.pilot.title} · {t.ev.dateTbd}</p>
      <div className="space-y-2.5 px-4 pb-8 pt-4">
        {t.pilot.rules.map((x) => <section key={x.t} className="rounded-3xl border p-5"><h2 className="text-[1.0625rem] font-semibold">{x.t}</h2><p className="mt-1 text-[0.9375rem] text-muted-foreground">{x.d}</p></section>)}
      </div>
    </main>
  );
}
