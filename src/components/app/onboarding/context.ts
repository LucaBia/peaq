import { createContext, useContext } from "react";
import type { athleteService } from "@/lib/app/athlete";

export type OnboardingData = Awaited<ReturnType<typeof athleteService.loadAll>>;
export type Draft = {
  username?: string; dob?: string; gender?: string; nationality?: string; cityId?: string; cityLabel?: string;
  runKm?: 5 | 10; runMin?: string; runSec?: string; wkg?: string; bibInput?: string;
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
