import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/peaq/core";
import { useAppLang } from "@/lib/app/i18n";
import { LEGAL_PATH, LEGAL_PUBLISHED, legalBlocks, legalVisible, type LegalDoc } from "@/lib/legal";
import { cn } from "@/lib/utils";
import { Notice } from "./ui";

/** **bold**, *italic* and `code` inside a line of the drafts. */
const inline = (s: string): ReactNode[] => s.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((x, k) =>
  x.startsWith("**") ? <strong key={k}>{x.slice(2, -2)}</strong> : x.startsWith("*") && x.length > 2 ? <em key={k}>{x.slice(1, -1)}</em>
    : x.startsWith("`") ? <code key={k} className="rounded bg-muted px-1 text-[0.9em]">{x.slice(1, -1)}</code> : x);

/** Links to Terms and Privacy for the sign-up screen. Renders nothing until the pages are published (see lib/legal.ts). */
export function LegalLinks({ className }: { className?: string }) {
  const { t } = useAppLang();
  if (!legalVisible) return null;
  const link = "font-medium underline underline-offset-4";
  return <p className={cn("text-sm text-muted-foreground", className)}><Link to={LEGAL_PATH.terms} target="_blank" className={link}>{t.legal.terms}</Link> · <Link to={LEGAL_PATH.privacy} target="_blank" className={link}>{t.legal.privacy}</Link></p>;
}

/** One legal document as a readable page, in the look of the athlete app. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { t, lang } = useAppLang();
  const docs: LegalDoc[] = ["privacy", "terms", "cookie"];
  return (
    <div className="theme-app theme-athlete min-h-dvh">
      <header className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 pt-6">
        <Link to="/" aria-label="PEAQ"><Wordmark className="h-6 w-auto" /></Link>
        <nav className="flex gap-4 text-sm">
          {docs.map((d) => <Link key={d} to={LEGAL_PATH[d]} className={cn("min-h-11 content-center underline-offset-4 hover:underline", d === doc ? "font-semibold" : "text-muted-foreground")}>{t.legal[d]}</Link>)}
        </nav>
      </header>
      <main className="mx-auto max-w-2xl space-y-4 px-6 pb-20 pt-6 leading-relaxed">
        {!LEGAL_PUBLISHED && <Notice>{t.legal.draft}</Notice>}
        {lang === "en" && <Notice>{t.legal.italianOnly}</Notice>}
        {legalBlocks(doc).map((b, k) => {
          switch (b.type) {
            case "h1": return <h1 key={k} className="pt-2 text-[2rem] font-bold leading-tight tracking-tight">{b.text}</h1>;
            case "h2": return <h2 key={k} className="pt-6 text-xl font-bold tracking-tight">{inline(b.text)}</h2>;
            case "h3": return <h3 key={k} className="pt-2 text-[1.0625rem] font-semibold">{inline(b.text)}</h3>;
            case "quote": return <blockquote key={k} className="whitespace-pre-line rounded-3xl bg-muted p-5">{inline(b.text)}</blockquote>;
            case "ul": return <ul key={k} className="list-disc space-y-1.5 pl-5">{b.items.map((x, j) => <li key={j}>{inline(x)}</li>)}</ul>;
            case "ol": return <ol key={k} className="list-decimal space-y-1.5 pl-5">{b.items.map((x, j) => <li key={j}>{inline(x)}</li>)}</ol>;
            case "table": return (
              <div key={k} className="overflow-x-auto rounded-2xl border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted"><tr>{b.head.map((c, j) => <th key={j} className="p-3 font-semibold">{inline(c)}</th>)}</tr></thead>
                  <tbody className="divide-y">{b.rows.map((r, j) => <tr key={j}>{r.map((c, i) => <td key={i} className="p-3 align-top">{inline(c)}</td>)}</tr>)}</tbody>
                </table>
              </div>
            );
            default: return <p key={k}>{inline(b.text)}</p>;
          }
        })}
      </main>
    </div>
  );
}
