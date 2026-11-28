import type { League } from "@/lib/app/rating";

/**
 * Following, athlete search and other athletes' profiles. Switched off: the database has no `follows` table yet and
 * athletes can only read their own profile (RLS). Wire `socialService` to the functions proposed in
 * docs/10-seguire-atleti-note-per-luca.md, then flip this: the Profile counters, the lists and the links appear.
 */
export const SOCIAL_OPEN = false;

/** An athlete as the others see them in a list: only public information. */
export type AthleteRow = {
  userId: string; username: string; bib: number | null; league: League | null; discipline: "run" | "bike" | "both" | null; city: string | null;
  /** Whether the signed-in athlete follows them. */
  following: boolean;
};

/** The public profile of another athlete. */
export type AthletePublic = AthleteRow & {
  ratings: Partial<Record<"run" | "bike", { rating: number; league: League }>>;
  level: number; xp: number; racesDone: number; followers: number; followingCount: number;
};

export type FollowCounts = { followers: number; following: number };

const off = () => Promise.reject(new Error("social_not_available"));

export const socialService = {
  async counts(_userId: string): Promise<FollowCounts> { return { followers: 0, following: 0 }; },
  async followers(_userId: string): Promise<AthleteRow[]> { return []; },
  async following(_userId: string): Promise<AthleteRow[]> { return []; },
  /** Athletes whose username starts with or contains `q`. */
  async search(_q: string): Promise<AthleteRow[]> { return []; },
  async athlete(_userId: string): Promise<AthletePublic | null> { return null; },
  follow: (_userId: string): Promise<void> => off(),
  unfollow: (_userId: string): Promise<void> => off(),
  report: (_userId: string): Promise<void> => off(),
  block: (_userId: string): Promise<void> => off(),
};
