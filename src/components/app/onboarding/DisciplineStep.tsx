import { useState } from "react";
import { Bike, Check, Footprints, Mountain } from "lucide-react";
import { Body, BottomBar, Notice, PrimaryButton, Title } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { athleteService, type Discipline } from "@/lib/app/athlete";
import { cn } from "@/lib/utils";
import { useOb } from "./context";

const ICONS = { run: Footprints, bike: Bike, both: Mountain };

export function DisciplineStep() {
  const { t } = useAppLang();
  const { data, goTo, refresh } = useOb();
  const [sel, setSel] = useState<Discipline | null>((data.profile?.discipline as Discipline) ?? null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(false);

  async function next() {
    if (!sel) return;
    setSaving(true); setErr(false);
    try { await athleteService.setDiscipline(sel); await refresh(); await goTo(3); } catch { setErr(true); } finally { setSaving(false); }
  }
  return (
    <>
      <Body>
        <Title>{t.ob.d.title}</Title>
        <div role="radiogroup" aria-label={t.ob.d.title} className="space-y-3">
          {(["run", "bike", "both"] as const).map((d) => {
            const Icon = ICONS[d]; const on = sel === d;
            return (
              <button key={d} type="button" role="radio" aria-checked={on} onClick={() => setSel(d)}
                className={cn("flex w-full items-center gap-4 rounded-3xl border p-5 text-left transition-all duration-200 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-ring",
                  on ? "border-foreground bg-muted ring-1 ring-foreground" : "hover:border-muted-foreground")}>
                <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl transition-colors", on ? "bg-primary text-primary-foreground" : "bg-muted")}><Icon className="size-6" aria-hidden /></span>
                <span className="flex-1"><span className="block text-xl font-bold">{t.ob.d[d].t}</span><span className="block text-sm text-muted-foreground">{t.ob.d[d].s}</span></span>
                <span aria-hidden className={cn("flex size-7 items-center justify-center rounded-full border transition-all", on ? "scale-100 border-primary bg-primary text-primary-foreground" : "scale-90")}>{on && <Check className="size-4" />}</span>
              </button>
            );
          })}
        </div>
        {err && <div className="mt-6"><Notice tone="error">{t.common.networkError}</Notice></div>}
      </Body>
      <BottomBar><PrimaryButton onClick={next} disabled={!sel} loading={saving}>{t.common.continue}</PrimaryButton></BottomBar>
    </>
  );
}
