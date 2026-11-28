import privacyMd from "../../docs/legale/01-informativa-privacy.md?raw";
import termsMd from "../../docs/legale/02-termini-di-servizio.md?raw";
import cookieMd from "../../docs/legale/03-cookie-policy.md?raw";

/**
 * Privacy, Terms and Cookie pages. Their text is read straight from the drafts in docs/legale/ (Italian, the
 * binding version): when the lawyer's final text replaces those files, the pages follow.
 *
 * OFF until the texts are final. In production the three pages send back to the home page and no link to them
 * is shown. In local development they are visible, with a "draft" banner, so they can be checked.
 */
export const LEGAL_PUBLISHED = false;
export const legalVisible = LEGAL_PUBLISHED || import.meta.env.DEV;

export type LegalDoc = "privacy" | "terms" | "cookie";
export const LEGAL_PATH = { privacy: "/privacy", terms: "/termini", cookie: "/cookie" } as const;
// While unpublished, the drafts (and the notes for the lawyer inside them) are left out of the production build altogether.
const SOURCE: Record<LegalDoc, string> = import.meta.env.DEV || LEGAL_PUBLISHED ? { privacy: privacyMd, terms: termsMd, cookie: cookieMd } : { privacy: "", terms: "", cookie: "" };

export type LegalBlock =
  | { type: "h1" | "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

/** Notes for the lawyer ("BOZZA…", "⚖️ …") stay in the file and never reach the page. */
const isNote = (text: string) => /^(\*\*BOZZA|⚖️)/.test(text);
const cells = (line: string) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
const isItem = (line: string) => /^\s*(- |\d+\. )/.test(line);

/** Turns one of the Markdown drafts into blocks: headings, paragraphs, lists, tables and quotes. */
export function legalBlocks(doc: LegalDoc): LegalBlock[] {
  const lines = SOURCE[doc].split("\n");
  const out: LegalBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    const heading = /^(#{1,3}) (.*)$/.exec(line);
    if (!line.trim() || line.trim() === "---") i++;
    else if (heading) { out.push({ type: `h${heading[1]!.length}` as "h1", text: heading[2]! }); i++; }
    else if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i]!.startsWith(">")) buf.push(lines[i++]!.replace(/^>\s?/, ""));
      const text = buf.filter(Boolean).join("\n");
      if (!isNote(text)) out.push({ type: "quote", text });
    } else if (line.startsWith("|")) {
      const table: string[][] = [];
      while (i < lines.length && lines[i]!.startsWith("|")) table.push(cells(lines[i++]!));
      out.push({ type: "table", head: table[0]!, rows: table.slice(1).filter((r) => !r.every((c) => /^:?-+:?$/.test(c))) });
    } else if (isItem(line)) {
      const items: string[] = [];
      while (i < lines.length && isItem(lines[i]!)) items.push(lines[i++]!.replace(/^\s*(- |\d+\. )/, ""));
      out.push({ type: /^\s*\d/.test(line) ? "ol" : "ul", items });
    } else {
      const buf: string[] = [];
      while (i < lines.length && lines[i]!.trim() && !/^(#{1,3} |>|\|)/.test(lines[i]!) && !isItem(lines[i]!)) buf.push(lines[i++]!.trim());
      out.push({ type: "p", text: buf.join(" ") });
    }
  }
  return out;
}
