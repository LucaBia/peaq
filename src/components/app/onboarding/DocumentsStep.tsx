import { useRef, useState } from "react";
import { ChevronRight, FileText, Paperclip, ShieldCheck, Trash2 } from "lucide-react";
import { Body, BottomBar, Field, Notice, OptionList, PrimaryButton, SelectButton, Sheet, TextInput, Title } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { athleteService, type DocumentRow } from "@/lib/app/athlete";
import { cn } from "@/lib/utils";
import { useOb } from "./context";

const ORGS = ["FIDAL", "UISP", "CSI", "FCI", "RUNCARD", "OTHER"] as const;
const okFile = (f: File) => f.size <= 10 * 1024 * 1024 && ["application/pdf", "image/jpeg", "image/png"].includes(f.type);

function FilePick({ file, onFile, id }: { file: File | null; onFile: (f: File | null) => void; id: string }) {
  const { t } = useAppLang();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} id={id} type="file" accept="application/pdf,image/jpeg,image/png" className="sr-only" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
      <button type="button" onClick={() => ref.current?.click()} className="flex min-h-14 w-full items-center gap-3 rounded-3xl border-[1.5px] border-dashed px-5 py-2 text-left text-sm hover:bg-muted">
        <Paperclip className="size-5 shrink-0 text-muted-foreground" /><span className={file ? "truncate" : "text-muted-foreground"}>{file?.name ?? t.ob.doc.file}</span>
      </button>
    </>
  );
}

export function DocumentsStep() {
  const { t } = useAppLang();
  const { userId, data, goTo } = useOb();
  const [docs, setDocs] = useState<DocumentRow[]>(data.documents);
  const [medFile, setMedFile] = useState<File | null>(null); const [medExp, setMedExp] = useState("");
  const [org, setOrg] = useState<string>(""); const [card, setCard] = useState(""); const [cardExp, setCardExp] = useState(""); const [cardFile, setCardFile] = useState<File | null>(null);
  const [orgSheet, setOrgSheet] = useState(false);
  const [open, setOpen] = useState<null | "med" | "card">(null);
  const [busy, setBusy] = useState<null | "med" | "card" | "next">(null);
  const [err, setErr] = useState<string | null>(null);

  async function add(kind: "med" | "card") {
    const file = kind === "med" ? medFile : cardFile;
    if (file && !okFile(file)) return setErr(t.ob.doc.errFile);
    setBusy(kind); setErr(null);
    try {
      const row = await athleteService.uploadDocument(userId, kind === "med"
        ? { type: "medical_certificate", file, expiresOn: medExp }
        : { type: "membership_card", file, organization: org, cardNumber: card, expiresOn: cardExp });
      setDocs((d) => [...d, row]);
      if (kind === "med") { setMedFile(null); setMedExp(""); } else { setOrg(""); setCard(""); setCardExp(""); setCardFile(null); }
      setOpen(null);
    } catch { setErr(t.common.networkError); } finally { setBusy(null); }
  }
  async function remove(d: DocumentRow) {
    try { await athleteService.removeDocument(d); setDocs((x) => x.filter((y) => y.id !== d.id)); } catch { setErr(t.common.networkError); }
  }
  async function next() {
    setBusy("next"); setErr(null);
    try { await athleteService.completeOnboarding(); await goTo(6); } catch { setErr(t.common.networkError); } finally { setBusy(null); }
  }

  // Compact cards as in Figma A9c: the title row opens the form underneath.
  const box = "rounded-[1.75rem] border-[1.5px] px-5 py-4";
  const head = (k: "med" | "card", title: string, sub: string, action: string) => (
    <button type="button" onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k} className="flex min-h-11 w-full items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
      <span><span className="block text-xl font-medium">{title}</span><span className="block text-[0.8125rem] text-muted-foreground">{sub}</span></span>
      <span className="flex shrink-0 items-center text-[0.9375rem] font-medium text-primary">{action}<ChevronRight className={cn("size-4 transition-transform", open === k && "rotate-90")} aria-hidden /></span>
    </button>
  );

  return (
    <>
      <Body>
        <Title sub={t.ob.doc.sub}>{t.ob.doc.title}</Title>
        <div className="space-y-4">
          <p className="rounded-3xl bg-primary/[0.07] p-4 text-[0.9375rem] text-primary"><strong>{t.ob.doc.friendly[0]}</strong>{t.ob.doc.friendly[1]}</p>

          <section className={box}>
            {head("med", t.ob.doc.medical, t.ob.doc.medicalSub, t.ob.doc.upload)}
            {open === "med" && (
              <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <FilePick id="med-file" file={medFile} onFile={setMedFile} />
                <Field id="med-exp" label={t.ob.doc.expiry}><TextInput id="med-exp" type="date" value={medExp} onChange={(e) => setMedExp(e.target.value)} /></Field>
                <PrimaryButton variant="outline" onClick={() => add("med")} disabled={!medFile} loading={busy === "med"}>{t.ob.doc.add}</PrimaryButton>
              </div>
            )}
          </section>

          <section className={box}>
            {head("card", t.ob.doc.membership, t.ob.doc.membershipSub, t.ob.doc.add)}
            {open === "card" && (
              <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <Field id="org" label={t.ob.doc.org}><SelectButton id="org" placeholder={t.ob.p.choose} value={org ? (org === "OTHER" ? "—" : org === "RUNCARD" ? "Runcard" : org) : undefined} onClick={() => setOrgSheet(true)} /></Field>
                <Field id="card" label={t.ob.doc.cardNumber}><TextInput id="card" autoCapitalize="characters" maxLength={40} value={card} onChange={(e) => setCard(e.target.value)} /></Field>
                <Field id="card-exp" label={t.ob.doc.expiry}><TextInput id="card-exp" type="date" value={cardExp} onChange={(e) => setCardExp(e.target.value)} /></Field>
                <FilePick id="card-file" file={cardFile} onFile={setCardFile} />
                <PrimaryButton variant="outline" onClick={() => add("card")} disabled={!org || !card.trim()} loading={busy === "card"}>{t.ob.doc.add}</PrimaryButton>
              </div>
            )}
          </section>

          <section aria-disabled className={cn(box, "border-dashed opacity-70")}>
            <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-medium">{t.ob.doc.peaqTitle}</h2><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{t.common.comingSoon}</span></div>
            <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{t.ob.doc.peaqSub}</p>
          </section>

          {docs.length > 0 && (
            <section className="space-y-2">
              <h2 className="px-1 text-sm font-semibold">{t.ob.doc.uploaded}</h2>
              {docs.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-3xl bg-muted p-4">
                  <FileText className="size-5 shrink-0" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{d.doc_type === "medical_certificate" ? t.ob.doc.medical : `${t.ob.doc.membership}${d.organization && d.organization !== "OTHER" ? ` · ${d.organization}` : ""}`}</p>
                    <p className="text-xs text-muted-foreground">{t.ob.doc.status[d.status as keyof typeof t.ob.doc.status]}{d.expires_on ? ` · ${d.expires_on}` : ""}</p>
                  </div>
                  {d.status === "pending" && <button type="button" onClick={() => remove(d)} aria-label={t.ob.doc.remove} className="flex size-11 items-center justify-center rounded-full hover:bg-background"><Trash2 className="size-4" /></button>}
                </div>
              ))}
            </section>
          )}
          <p className="flex gap-2 px-1 text-sm text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0" />{t.ob.doc.privacy}</p>
          {err && <Notice tone="error">{err}</Notice>}
        </div>
      </Body>
      <BottomBar>
        <PrimaryButton onClick={next} loading={busy === "next"}>{t.common.continue}</PrimaryButton>
        {docs.length === 0 && <PrimaryButton variant="ghost" onClick={next} disabled={busy === "next"}>{t.ob.skip}</PrimaryButton>}
      </BottomBar>
      <Sheet open={orgSheet} onOpenChange={setOrgSheet} title={t.ob.doc.org}>
        <OptionList options={ORGS.map((o) => ({ value: o, label: o === "OTHER" ? "—" : o === "RUNCARD" ? "Runcard" : o }))} value={org} onSelect={(v) => { setOrg(v); setOrgSheet(false); }} />
      </Sheet>
    </>
  );
}
