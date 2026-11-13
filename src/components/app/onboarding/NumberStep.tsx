import { useEffect, useState } from "react";
import { Lock, Shuffle } from "lucide-react";
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
        <Title sub={t.ob.n.sub}>{t.ob.n.title}</Title>
        {assigned ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-success p-8">
            <span className="font-display text-8xl leading-none">{assigned}</span>
            <span className="flex items-center gap-2 text-sm font-medium text-success"><Lock className="size-4" />{t.ob.n.assigned}</span>
          </div>
        ) : (
          <>
            <label htmlFor="bib" className="sr-only">{t.ob.n.title}</label>
            <input id="bib" inputMode="numeric" pattern="[0-9]*" autoComplete="off" maxLength={4} placeholder={t.ob.n.placeholder} value={value}
              onChange={(e) => setDraft({ bibInput: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              aria-describedby="bib-status" aria-invalid={status === "taken" || status === "reserved" || status === "invalid" || undefined}
              className={cn("h-36 w-full rounded-3xl border-2 bg-background text-center font-display text-8xl leading-none outline-none transition-colors placeholder:text-4xl placeholder:text-border focus:border-foreground",
                status === "available" && "border-success focus:border-success", (status === "taken" || status === "reserved" || status === "invalid") && "border-destructive focus:border-destructive")} />
            <p id="bib-status" aria-live="polite" className={cn("mt-3 min-h-5 text-center text-sm font-medium", status === "available" ? "text-success" : "text-destructive")}>{label}</p>
            <button type="button" onClick={pick} disabled={busy} className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold hover:bg-muted disabled:opacity-50">
              <Shuffle className="size-4" />{t.ob.n.pick}
            </button>
            <p className="mt-8 text-center text-sm text-muted-foreground">{t.ob.n.permanent}</p>
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
