import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/peaq/core";
import { useAppLang } from "@/lib/app/i18n";
import { LEGAL_PATH, LEGAL_PUBLISHED, legalBlocks, legalVisible, type LegalDoc } from "@/lib/legal";
import { cn } from "@/lib/utils";
import { Notice, PrimaryButton, Sheet } from "./ui";

/** **bold**, *italic* and `code` inside a line of the drafts. */
const inline = (s: string): ReactNode[] => s.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((x, k) =>
  x.startsWith("**") ? <strong key={k}>{x.slice(2, -2)}</strong> : x.startsWith("*") && x.length > 2 ? <em key={k}>{x.slice(1, -1)}</em>
    : x.startsWith("`") ? <code key={k} className="rounded bg-muted px-1 text-[0.9em]">{x.slice(1, -1)}</code> : x);

/** The text of one legal document. `skipTitle` leaves out its first heading, when the container already shows it. */
function LegalBody({ doc, skipTitle }: { doc: LegalDoc; skipTitle?: boolean }) {
  const { t, lang } = useAppLang();
  return (
    <>
      {!LEGAL_PUBLISHED && <Notice>{t.legal.draft}</Notice>}
      {lang === "en" && <Notice>{t.legal.italianOnly}</Notice>}
      {legalBlocks(doc).slice(skipTitle ? 1 : 0).map((b, k) => {
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
    </>
  );
}

/**
 * The sentence of the sign-up checkbox ("I accept the Terms of Service and the Privacy Policy"). Once the pages are
 * published (see lib/legal.ts) the two names open the text in a sheet over the form, so what has been typed stays there.
 */
export function TermsLabel() {
  const { t } = useAppLang();
  const [doc, setDoc] = useState<LegalDoc | null>(null);
  const [last, setLast] = useState<LegalDoc>("terms"); // keeps the text in place while the sheet slides away
  if (!legalVisible) return <>{t.auth.terms}</>;
  const first = legalBlocks(last)[0];
  const [before, terms, between, privacy, after] = t.legal.accept;
  // preventDefault: the sentence sits inside the checkbox label, and opening the text must not tick the box.
  const link = (d: LegalDoc, name: string | undefined) => (
    <button type="button" onClick={(e) => { e.preventDefault(); setLast(d); setDoc(d); }} className="font-medium text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{name}</button>
  );
  return (
    <>
      {before}{link("terms", terms)}{between}{link("privacy", privacy)}{after}
      <Sheet open={doc !== null} onOpenChange={(o) => { if (!o) setDoc(null); }} title={first?.type === "h1" ? first.text : t.legal[last]}>
        <div className="space-y-4 px-6 text-[0.9375rem] leading-relaxed text-foreground">
          <LegalBody doc={last} skipTitle />
          {/* Sticks to the very bottom of the sheet, covering its safe-area padding so no text shows under the button. */}
          <div className="sticky bg-background pt-3" style={{ bottom: "calc(-1 * max(env(safe-area-inset-bottom), 1rem))", paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}><PrimaryButton type="button" onClick={() => setDoc(null)}>{t.common.close}</PrimaryButton></div>
        </div>
      </Sheet>
    </>
  );
}

/** One legal document as a readable page, in the look of the athlete app. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { t } = useAppLang();
  const docs: LegalDoc[] = ["privacy", "terms", "cookie"];
  return (
    <div className="theme-app theme-athlete min-h-dvh">
      <header className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 pt-6">
        <Link to="/" aria-label="PEAQ"><Wordmark className="h-6 w-auto" /></Link>
        <nav className="flex gap-4 text-sm">
          {docs.map((d) => <Link key={d} to={LEGAL_PATH[d]} className={cn("min-h-11 content-center underline-offset-4 hover:underline", d === doc ? "font-semibold" : "text-muted-foreground")}>{t.legal[d]}</Link>)}
        </nav>
      </header>
      <main className="mx-auto max-w-2xl space-y-4 px-6 pb-20 pt-6 leading-relaxed"><LegalBody doc={doc} /></main>
    </div>
  );
}
