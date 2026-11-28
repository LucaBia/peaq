import { useState } from "react";
import { Check } from "lucide-react";
import { Body, BottomBar, Notice, PrimaryButton, Title } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { athleteService, type Discipline } from "@/lib/app/athlete";
import { cn } from "@/lib/utils";
import { useOb } from "./context";

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
        <div role="radiogroup" aria-label={t.ob.d.title.replace("\n", " ")} className="space-y-3">
          {(["run", "bike", "both"] as const).map((d) => {
            const on = sel === d;
            return (
              <button key={d} type="button" role="radio" aria-checked={on} onClick={() => setSel(d)}
                className={cn("flex min-h-[7.5rem] w-full items-center justify-between gap-4 rounded-[1.75rem] border-[1.5px] px-6 text-left transition-all duration-200 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  on ? "border-foreground ring-[2.5px] ring-inset ring-foreground" : "hover:border-muted-foreground")}>
                <span><span className="block text-[1.875rem] font-light leading-tight">{t.ob.d[d].t}</span><span className="block text-muted-foreground">{t.ob.d[d].s}</span></span>
                {on && <Check className="size-7 shrink-0 animate-in zoom-in-50 duration-200" aria-hidden />}
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
