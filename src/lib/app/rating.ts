/** Rating service: only defines the provisional starting state. Real placement/updates happen server-side later. */
export const LEAGUES = ["valle", "collina", "passo", "cresta", "vetta", "peaq"] as const;
export type League = (typeof LEAGUES)[number];

export const PROVISIONAL_BASELINE = { rating: 300, league: "collina" as League, placementRaces: 3 };

export const leagueColorVar = (l: League) => (l === "peaq" ? "var(--gradient-peaq)" : `var(--league-${l})`);

/** Lowest rating of each league: the same thresholds everywhere. The server decides the league; this is only for "points to the next league". */
export const LEAGUE_FLOOR: Record<League, number> = { valle: 0, collina: 200, passo: 350, cresta: 500, vetta: 650, peaq: 800 };
export const nextLeague = (l: League): League | null => LEAGUES[LEAGUES.indexOf(l) + 1] ?? null;
/** Text on a league colour: black on the light ones, white on Cresta and PEAQ. */
export const leagueInk = (l: League) => (l === "cresta" || l === "peaq" ? "oklch(1 0 0)" : "oklch(0.16 0.004 160)");

/** XP needed for the next level. Only level 1 (200 XP) is defined so far. */
export const XP_FOR_NEXT_LEVEL: Record<number, number> = { 1: 200 };

/** "0–199", "800+": the rating range of a league, for labels. */
export const leagueRange = (l: League) => { const n = nextLeague(l); return n ? `${LEAGUE_FLOOR[l]}–${LEAGUE_FLOOR[n] - 1}` : `${LEAGUE_FLOOR[l]}+`; };
