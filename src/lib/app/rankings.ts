import type { League } from "@/lib/app/rating";
import { rows } from "@/lib/app/rpc";

export type RankSport = "run" | "bike";

/** One line of a city ranking. `rank` starts at 1; athletes appear only after their first race. */
export type RankEntry = { userId: string; username: string; rating: number; league: League; rank: number };

/** The signed-in athlete, as the Rankings screen needs them. */
export type RankMe = { userId: string; username: string; city: string | null; ratings: Partial<Record<RankSport, { rating: number; league: League }>> };

/** Two letters for an avatar without a photo. */
export const initials = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?";

/** A row of the `city_ranking` database function (docs/sql/01). */
export type RankingRow = { user_id: string; username: string; rating: number; league: string; rank: number | string };
export const toRankEntry = (r: RankingRow): RankEntry => ({ userId: r.user_id, username: r.username, rating: r.rating, league: r.league as League, rank: Number(r.rank) });

export const rankingsService = {
  /** City ranking for one sport, best rating first: only athletes who have run at least one race, 200 at most. */
  async city(sport: RankSport, cityId: string | null): Promise<RankEntry[]> {
    if (!cityId) return [];
    return (await rows<RankingRow>("city_ranking", { _discipline: sport, _city_id: cityId })).map(toRankEntry);
  },
};
