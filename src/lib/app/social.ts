import type { League } from "@/lib/app/rating";
import { rows, rpc } from "@/lib/app/rpc";

/**
 * Following, athlete search and other athletes' profiles, through the database functions of docs/sql/02-seguire-atleti.sql.
 * The tables can't be read by the app: everything goes through those functions, which return public information only.
 * Still switched off: flip it once the screens have been tried against the real database with real accounts.
 * Until then the Profile shows Followers 0 and Following 0, and they are not links.
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

/** A row of the list / search functions, and the extra columns of `athlete_public`. */
export type AthleteRowDb = { user_id: string; username: string; bib_number: number | null; league: string | null; discipline: string | null; city: string | null; following: boolean };
export type AthletePublicDb = AthleteRowDb & { run_rating: number | null; run_league: string | null; bike_rating: number | null; bike_league: string | null; level: number; xp: number; races_done: number; followers: number; following_count: number };

export const toAthleteRow = (r: AthleteRowDb): AthleteRow => ({
  userId: r.user_id, username: r.username, bib: r.bib_number, league: r.league as League | null, discipline: r.discipline as AthleteRow["discipline"], city: r.city, following: r.following,
});
export const toAthletePublic = (r: AthletePublicDb): AthletePublic => ({
  ...toAthleteRow(r), level: r.level, xp: r.xp, racesDone: r.races_done, followers: r.followers, followingCount: r.following_count,
  ratings: {
    ...(r.run_rating != null && r.run_league && { run: { rating: r.run_rating, league: r.run_league as League } }),
    ...(r.bike_rating != null && r.bike_league && { bike: { rating: r.bike_rating, league: r.bike_league as League } }),
  },
});

const call = async (fn: string, userId: string) => { const { error } = await rpc(fn, { _user_id: userId }); if (error) throw error; };

export const socialService = {
  async counts(userId: string): Promise<FollowCounts> { return (await rows<FollowCounts>("follow_counts", { _user_id: userId }))[0] ?? { followers: 0, following: 0 }; },
  async followers(userId: string): Promise<AthleteRow[]> { return (await rows<AthleteRowDb>("list_followers", { _user_id: userId })).map(toAthleteRow); },
  async following(userId: string): Promise<AthleteRow[]> { return (await rows<AthleteRowDb>("list_following", { _user_id: userId })).map(toAthleteRow); },
  /** Athletes whose username contains `q` (two characters at least), 20 at most, never the one who searches. */
  async search(q: string): Promise<AthleteRow[]> { return q.trim().length < 2 ? [] : (await rows<AthleteRowDb>("search_athletes", { _q: q })).map(toAthleteRow); },
  /** null when the athlete doesn't exist, hasn't finished signing up, or one of the two has blocked the other. */
  async athlete(userId: string): Promise<AthletePublic | null> { const r = (await rows<AthletePublicDb>("athlete_public", { _user_id: userId }))[0]; return r ? toAthletePublic(r) : null; },
  follow: (userId: string): Promise<void> => call("follow_athlete", userId),
  unfollow: (userId: string): Promise<void> => call("unfollow_athlete", userId),
  report: (userId: string): Promise<void> => call("report_athlete", userId),
  /** Blocking also removes the two "follow" between them. */
  block: (userId: string): Promise<void> => call("block_athlete", userId),
  unblock: (userId: string): Promise<void> => call("unblock_athlete", userId),
};
