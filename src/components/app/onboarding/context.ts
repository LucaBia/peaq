import { createContext, useContext } from "react";
import type { athleteService } from "@/lib/app/athlete";

export type OnboardingData = Awaited<ReturnType<typeof athleteService.loadAll>>;
export type Draft = {
  username?: string | undefined; dob?: string | undefined; gender?: string | undefined; nationality?: string | undefined; cityId?: string | undefined; cityLabel?: string | undefined;
  runKm?: 5 | 10 | undefined; runMin?: string | undefined; runSec?: string | undefined; wkg?: string | undefined; bibInput?: string | undefined;
};

export type Ctx = {
  userId: string;
  data: OnboardingData;
  draft: Draft;
  setDraft: (patch: Partial<Draft>) => void;
  /** Persists progress, then moves to the given step. */
  goTo: (step: number) => Promise<void>;
  back: () => void;
  refresh: () => Promise<unknown>;
};

export const OnboardingCtx = createContext<Ctx | null>(null);
export const useOb = () => useContext(OnboardingCtx)!;
