/** Rating service: only defines the provisional starting state. Real placement/updates happen server-side later. */
export const LEAGUES = ["valle", "collina", "passo", "cresta", "vetta", "peaq"] as const;
export type League = (typeof LEAGUES)[number];

export const PROVISIONAL_BASELINE = { rating: 300, league: "collina" as League, placementRaces: 3 };

export const leagueColorVar = (l: League) => (l === "peaq" ? "var(--gradient-peaq)" : `var(--league-${l})`);

/** XP needed for the next level. Only level 1 (200 XP) is defined so far. */
export const XP_FOR_NEXT_LEVEL: Record<number, number> = { 1: 200 };
