import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Body, BottomBar, Notice, PrimaryButton, Title } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { athleteService, errorCode } from "@/lib/app/athlete";
import { bibRangeStatus, type BibStatus } from "@/lib/app/validation";
import { cn } from "@/lib/utils";
import { useOb } from "./context";

export function NumberStep() {
  const { t } = useAppLang();
  const { data, draft, setDraft, goTo, refresh } = useOb();
  const assigned = data.profile?.bib_number ?? null;
  const value = draft.bibInput ?? "";
  const [status, setStatus] = useState<BibStatus | "checking" | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (assigned || !value) return setStatus(null);
    const n = Number(value);
    const local = bibRangeStatus(n);
    if (local) return setStatus(local);
    setStatus("checking");
    const id = setTimeout(async () => { try { setStatus(await athleteService.bibStatus(n)); } catch { setStatus(null); } }, 350);
    return () => clearTimeout(id);
  }, [value, assigned]);

  async function pick() {
    setBusy(true); setErr(null);
    try { setDraft({ bibInput: String(await athleteService.randomBib()) }); } catch { setErr(t.common.networkError); } finally { setBusy(false); }
  }
  async function confirm() {
    if (assigned) return goTo(4);
    setBusy(true); setErr(null);
    try { await athleteService.claimBib(Number(value)); await refresh(); await goTo(4); }
    catch (e) {
      const c = errorCode(e);
      if (c === "taken") { setStatus("taken"); setErr(t.ob.n.conflict); }
      else if (c === "reserved") setStatus("reserved");
      else setErr(t.common.networkError);
    } finally { setBusy(false); }
  }

  const label = status && status !== "checking" ? t.ob.n[status] : null;
  return (
    <>
      <Body>
        <Title>{t.ob.n.title}</Title>
        {assigned ? (
          <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border-[1.5px] border-success p-8">
            <span className="font-display text-8xl leading-none">{assigned}</span>
            <span className="flex items-center gap-2 text-sm font-medium text-success"><Lock className="size-4" />{t.ob.n.assigned}</span>
          </div>
        ) : (
          <>
            <label htmlFor="bib" className="sr-only">{t.ob.n.placeholder}</label>
            <input id="bib" inputMode="numeric" pattern="[0-9]*" autoComplete="off" maxLength={4} placeholder={t.ob.n.placeholder} value={value}
              onChange={(e) => setDraft({ bibInput: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              aria-describedby="bib-status" aria-invalid={status === "taken" || status === "reserved" || status === "invalid" || undefined}
              className={cn("h-[9.375rem] w-full rounded-[1.75rem] border-[1.5px] bg-background text-center font-display text-8xl leading-none outline-none transition-colors placeholder:text-[1.75rem] placeholder:font-light placeholder:not-italic placeholder:text-muted-foreground focus:border-foreground",
                status === "available" && "border-success focus:border-success", (status === "taken" || status === "reserved" || status === "invalid") && "border-destructive focus:border-destructive")} />
            <p id="bib-status" aria-live="polite" className={cn("mt-3 min-h-5 text-center text-sm", !label ? "text-muted-foreground" : status === "available" ? "font-medium text-success" : "font-medium text-destructive")}>{label ?? t.ob.n.hint}</p>
            <button type="button" onClick={pick} disabled={busy} className="mx-auto mt-4 flex min-h-12 items-center rounded-full border-[1.5px] border-foreground px-6 font-medium transition-all hover:bg-muted active:scale-[0.98] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{t.ob.n.pick}</button>
            <ul className="mt-8 space-y-4">
              {t.ob.n.facts.map((f) => (
                <li key={f.t} className="flex gap-3"><span className="mt-[0.5625rem] size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden /><p><span className="block font-medium">{f.t}</span><span className="block text-[0.9375rem] text-muted-foreground">{f.d}</span></p></li>
              ))}
            </ul>
          </>
        )}
        {err && <div className="mt-6"><Notice tone="error">{err}</Notice></div>}
      </Body>
      <BottomBar>
        <PrimaryButton onClick={confirm} loading={busy && !!value} disabled={!assigned && status !== "available"}>{assigned ? t.common.continue : t.ob.n.confirm}</PrimaryButton>
      </BottomBar>
    </>
  );
}
