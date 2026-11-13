import { useState } from "react";
import { Info } from "lucide-react";
import { Body, BottomBar, Field, Notice, PrimaryButton, TextInput, Title } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { athleteService } from "@/lib/app/athlete";
import { isPlausibleRun, isPlausibleWkg } from "@/lib/app/validation";
import { cn } from "@/lib/utils";
import { useOb } from "./context";

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
    <section key="run" className="space-y-4 rounded-3xl border p-5">
      <h2 className="text-lg font-bold">{t.ob.perf.run}</h2>
      <div role="radiogroup" aria-label={t.ob.perf.distance} className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
        {([5, 10] as const).map((k) => (
          <button key={k} type="button" role="radio" aria-checked={km === k} onClick={() => setDraft({ runKm: k })}
            className={cn("h-11 rounded-xl text-sm font-semibold transition-colors", km === k ? "bg-background shadow-sm" : "text-muted-foreground")}>{k} km</button>
        ))}
      </div>
      <Field id="run-min" label={t.ob.perf.time} error={runErr ? t.ob.perf.errRun : null}>
        <div className="flex items-center gap-2">
          <TextInput id="run-min" inputMode="numeric" placeholder={t.ob.perf.min} aria-label={t.ob.perf.min} maxLength={3} value={min} invalid={runErr}
            onChange={(e) => setDraft({ runMin: e.target.value.replace(/\D/g, "") })} className="text-center" />
          <span className="text-2xl font-bold">:</span>
          <TextInput id="run-sec" inputMode="numeric" placeholder={t.ob.perf.sec} aria-label={t.ob.perf.sec} maxLength={2} value={sec} invalid={runErr}
            onChange={(e) => setDraft({ runSec: e.target.value.replace(/\D/g, "") })} className="text-center" />
        </div>
      </Field>
    </section>
  );
  const bikeBlock = showBike && (
    <section key="bike" className="space-y-4 rounded-3xl border p-5">
      <h2 className="text-lg font-bold">{t.ob.perf.bike}</h2>
      <Field id="wkg" label={t.ob.perf.wkg} error={bikeErr ? t.ob.perf.errBike : null}>
        <TextInput id="wkg" inputMode="decimal" placeholder={t.ob.perf.wkgHint} maxLength={4} value={wkg} invalid={bikeErr}
          onChange={(e) => setDraft({ wkg: e.target.value.replace(/[^0-9.,]/g, "") })} />
      </Field>
    </section>
  );

  return (
    <>
      <Body>
        <Title sub={t.ob.perf.sub}>{t.ob.perf.title}</Title>
        <div className="space-y-4">
          {d === "bike" ? [bikeBlock] : [runBlock, bikeBlock]}
          <Notice><span className="flex gap-3"><Info className="mt-0.5 size-4 shrink-0" />{t.ob.perf.provisional}</span></Notice>
          <p className="px-1 text-sm text-muted-foreground">{t.ob.perf.integrity}</p>
          {err && <Notice tone="error">{t.common.networkError}</Notice>}
        </div>
      </Body>
      <BottomBar>
        <PrimaryButton onClick={save} loading={saving} disabled={runErr || bikeErr}>{t.common.continue}</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={() => goTo(5)}>{t.common.skip}</PrimaryButton>
      </BottomBar>
    </>
  );
}
