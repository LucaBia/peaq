import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { AppFrame, LangSwitch, Notice, PrimaryButton, Progress, TopBar } from "@/components/app/ui";
import { athleteService } from "@/lib/app/athlete";
import { useAppLang } from "@/lib/app/i18n";
import { OnboardingCtx, type Draft } from "@/components/app/onboarding/context";
import { PersonalStep } from "@/components/app/onboarding/PersonalStep";
import { DisciplineStep } from "@/components/app/onboarding/DisciplineStep";
import { NumberStep } from "@/components/app/onboarding/NumberStep";
import { PerformanceStep } from "@/components/app/onboarding/PerformanceStep";
import { DocumentsStep } from "@/components/app/onboarding/DocumentsStep";
import { BibStep } from "@/components/app/onboarding/BibStep";
import { IntroStep } from "@/components/app/onboarding/IntroStep";
import { NotificationsStep } from "@/components/app/onboarding/NotificationsStep";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [
    { title: "Crea il tuo profilo atleta — PEAQ" }, { name: "description", content: "Completa il tuo profilo atleta PEAQ e scegli il tuo numero permanente." },
    { property: "og:title", content: "Crea il tuo profilo atleta — PEAQ" }, { property: "og:description", content: "Completa il tuo profilo atleta PEAQ e scegli il tuo numero permanente." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Onboarding,
});

const FORM_STEPS = 5;

function Onboarding() {
  const { user } = Route.useRouteContext();
  const { t } = useAppLang();
  const nav = useNavigate();
  const q = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  const [step, setStep] = useState<number | null>(null);
  const [draft, setDraftState] = useState<Draft>({});
  const draftRef = useRef(draft); draftRef.current = draft;

  // Resume: never past what the stored profile supports.
  useEffect(() => {
    if (!q.data || step !== null) return;
    const { profile, priv, progress } = q.data;
    const maxStep = !profile ? 1 : !profile.discipline ? 2 : !profile.bib_number ? 3 : 9;
    const s = Math.min(progress?.current_step ?? 1, maxStep);
    if (s >= 9 && profile?.onboarding_completed_at) { nav({ to: "/app", replace: true }); return; }
    const saved = (progress?.draft ?? {}) as Draft;
    setDraftState({
      ...saved,
      username: saved.username ?? profile?.username ?? undefined, dob: saved.dob ?? priv?.date_of_birth, gender: saved.gender ?? priv?.gender,
      nationality: saved.nationality ?? profile?.nationality ?? undefined, cityId: saved.cityId ?? profile?.city_id ?? undefined,
    });
    if (!saved.cityLabel && profile?.city_id) athleteService.city(profile.city_id).then((c) => c && setDraftState((d) => ({ ...d, cityLabel: `${c.name}${c.region ? `, ${c.region}` : ""}` })));
    setStep(Math.max(1, s));
  }, [q.data, step, nav]);

  // Debounced draft autosave so closing the app keeps entered values.
  useEffect(() => {
    if (step === null) return;
    const id = setTimeout(() => { athleteService.saveProgress(user.id, step, draftRef.current).catch(() => {}); }, 1000);
    return () => clearTimeout(id);
  }, [draft, step, user.id]);

  const setDraft = useCallback((p: Partial<Draft>) => setDraftState((d) => ({ ...d, ...p })), []);
  const goTo = useCallback(async (n: number) => {
    await athleteService.saveProgress(user.id, Math.min(n, 9), draftRef.current);
    if (n >= 9) { await q.refetch(); nav({ to: "/app", replace: true }); return; }
    setStep(n);
    window.scrollTo({ top: 0 });
  }, [user.id, nav, q]);
  const back = useCallback(() => setStep((s) => Math.max(1, (s ?? 1) - 1)), []);

  const ctx = useMemo(() => q.data && { userId: user.id, data: q.data, draft, setDraft, goTo, back, refresh: q.refetch }, [q.data, draft, setDraft, goTo, back, q.refetch, user.id]);

  if (q.isError) return (
    <AppFrame><div className="flex flex-1 flex-col justify-center gap-4 p-6"><Notice tone="error">{t.common.networkError}</Notice><PrimaryButton onClick={() => q.refetch()}>{t.common.retry}</PrimaryButton></div></AppFrame>
  );
  if (!ctx || step === null) return <AppFrame><div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" aria-label={t.common.loading} /></div></AppFrame>;

  const showBack = step > 1 && step <= FORM_STEPS && !(step === 4 && false);
  return (
    <OnboardingCtx.Provider value={ctx}>
      <AppFrame>
        <TopBar onBack={showBack ? back : undefined} right={<LangSwitch />}>
          {step <= FORM_STEPS && <Progress step={step} total={FORM_STEPS} />}
        </TopBar>
        <div key={step} className="flex flex-1 flex-col">
          {step === 1 && <PersonalStep />}
          {step === 2 && <DisciplineStep />}
          {step === 3 && <NumberStep />}
          {step === 4 && <PerformanceStep />}
          {step === 5 && <DocumentsStep />}
          {step === 6 && <BibStep />}
          {step === 7 && <IntroStep />}
          {step === 8 && <NotificationsStep />}
        </div>
      </AppFrame>
    </OnboardingCtx.Provider>
  );
}
