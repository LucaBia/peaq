import { useState } from "react";
import { Body, BottomBar, Notice, PrimaryButton, Title } from "../ui";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { athleteService } from "@/lib/app/athlete";
import { isPlausibleRun, isPlausibleWkg } from "@/lib/app/validation";
import { cn } from "@/lib/utils";
import { useOb } from "./context";

const box = "rounded-[1.75rem] border-[1.5px] p-5 transition-colors";
const cap = "text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground";
const big = "min-w-0 border-b-2 border-transparent bg-transparent pb-1 text-5xl font-light tabular-nums leading-none outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground";

export function PerformanceStep() {
  const { t } = useAppLang();
  const { data, draft, setDraft, goTo } = useOb();
  const d = data.profile?.discipline ?? "both";
  const showRun = d !== "bike", showBike = d !== "run";
  const km = draft.runKm ?? 5;
  const min = draft.runMin ?? "", sec = draft.runSec ?? "", wkg = draft.wkg ?? "";
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(false);

  const runEntered = showRun && (min !== "" || sec !== "");
  const totalSec = Number(min || 0) * 60 + Number(sec || 0);
  const runErr = runEntered && (Number(sec || 0) > 59 || !isPlausibleRun(km, totalSec));
  const wkgNum = Number(wkg.replace(",", "."));
  const bikeEntered = showBike && wkg !== "";
  const bikeErr = bikeEntered && !isPlausibleWkg(wkgNum);

  async function save() {
    if (runErr || bikeErr) return;
    if (!runEntered && !bikeEntered) return goTo(5);
    setSaving(true); setErr(false);
    try { await athleteService.savePerformance(runEntered ? km : null, runEntered ? totalSec : null, bikeEntered ? wkgNum : null); await goTo(5); }
    catch { setErr(true); } finally { setSaving(false); }
  }

  const runBlock = showRun && (
    <section key="run" className={cn(box, runErr && "border-destructive")}>
      <h2 className={cap}>{fmt(t.ob.perf.runLabel, { km })}</h2>
      <div className="mt-3 flex items-baseline gap-2">
        <input id="run-min" inputMode="numeric" placeholder={t.ob.perf.min.toLowerCase()} aria-label={t.ob.perf.min} maxLength={3} value={min} aria-invalid={runErr || undefined} aria-describedby={runErr ? "run-err" : undefined}
          onChange={(e) => setDraft({ runMin: e.target.value.replace(/\D/g, "") })} className={cn(big, "w-[5.5rem] text-right")} />
        <span className="text-5xl font-light leading-none" aria-hidden>:</span>
        <input id="run-sec" inputMode="numeric" placeholder={t.ob.perf.sec.toLowerCase()} aria-label={t.ob.perf.sec} maxLength={2} value={sec} aria-invalid={runErr || undefined} aria-describedby={runErr ? "run-err" : undefined}
          onChange={(e) => setDraft({ runSec: e.target.value.replace(/\D/g, "") })} className={cn(big, "w-[5.5rem]")} />
      </div>
      <div role="radiogroup" aria-label={t.ob.perf.distance} className="mt-4 flex gap-2">
        {([5, 10] as const).map((k) => (
          <button key={k} type="button" role="radio" aria-checked={km === k} onClick={() => setDraft({ runKm: k })}
            className={cn("min-h-11 rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", km === k ? "bg-foreground text-background" : "bg-muted")}>{k} km</button>
        ))}
      </div>
      {runErr && <p id="run-err" role="alert" className="mt-3 text-sm text-destructive">{t.ob.perf.errRun}</p>}
    </section>
  );
  const bikeBlock = showBike && (
    <section key="bike" className={cn(box, bikeErr && "border-destructive")}>
      <h2 className={cap}><label htmlFor="wkg">{t.ob.perf.bikeLabel}</label></h2>
      <div className="mt-3 flex items-baseline gap-3">
        <input id="wkg" inputMode="decimal" placeholder="0,0" maxLength={4} value={wkg} aria-invalid={bikeErr || undefined} aria-describedby={bikeErr ? "wkg-err" : undefined}
          onChange={(e) => setDraft({ wkg: e.target.value.replace(/[^0-9.,]/g, "") })} className={cn(big, "w-28")} />
        <span className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background" aria-hidden>W/kg</span>
      </div>
      {bikeErr && <p id="wkg-err" role="alert" className="mt-3 text-sm text-destructive">{t.ob.perf.errBike}</p>}
    </section>
  );

  return (
    <>
      <Body>
        <Title sub={t.ob.perf.sub}>{t.ob.perf.title}</Title>
        <div className="space-y-4">
          {d === "bike" ? [bikeBlock] : [runBlock, bikeBlock]}
          <Notice>{t.ob.perf.provisional}</Notice>
          <p className="px-1 text-[0.9375rem] text-muted-foreground"><strong className="block text-base text-foreground">{t.ob.perf.honest}</strong>{t.ob.perf.integrity}</p>
          {err && <Notice tone="error">{t.common.networkError}</Notice>}
        </div>
      </Body>
      <BottomBar>
        <PrimaryButton onClick={save} loading={saving} disabled={runErr || bikeErr}>{runErr ? t.ob.perf.needRun : bikeErr ? t.ob.perf.needBike : t.common.continue}</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={() => goTo(5)}>{t.ob.skip}</PrimaryButton>
      </BottomBar>
    </>
  );
}
