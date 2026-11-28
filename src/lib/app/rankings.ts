import type { League } from "@/lib/app/rating";

export type RankSport = "run" | "bike";

/** One line of a city ranking. `rank` starts at 1; athletes appear only after their first race. */
export type RankEntry = { userId: string; username: string; rating: number; league: League; rank: number };

/** The signed-in athlete, as the Rankings screen needs them. */
export type RankMe = { userId: string; username: string; city: string | null; ratings: Partial<Record<RankSport, { rating: number; league: League }>> };

/** Two letters for an avatar without a photo. */
export const initials = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?";

export const rankingsService = {
  /**
   * City ranking for one sport, best rating first.
   *
   * Empty for now: athletes can only read their own rating (RLS), and nobody has raced yet. When the
   * `city_ranking` database function exists (proposal in docs/08-classifiche-note-per-luca.md), call it here
   * and map its rows to RankEntry: the screen already shows podium, list, your position and "next to beat".
   */
  async city(_sport: RankSport, _cityId: string | null): Promise<RankEntry[]> {
    return [];
  },
};
