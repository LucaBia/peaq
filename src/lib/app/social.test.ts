import { describe, expect, it } from "vitest";
import { toRankEntry } from "./rankings";
import { toAthletePublic, toAthleteRow, type AthletePublicDb } from "./social";

// Rows exactly as the database functions of docs/sql/01 and 02 returned them in the dry run of 28 Nov 2026.
const row: AthletePublicDb = {
  user_id: "00ce8902-0b53-43f3-a2e9-b3f82837e979", username: "prova_b", bib_number: 9002, league: "passo", discipline: "bike", city: "Padova", following: true,
  run_rating: null, run_league: null, bike_rating: 380, bike_league: "passo", level: 1, xp: 0, races_done: 0, followers: 1, following_count: 0,
};

describe("rows of the social database functions", () => {
  it("maps a list row to what the screens use", () => {
    expect(toAthleteRow(row)).toEqual({ userId: row.user_id, username: "prova_b", bib: 9002, league: "passo", discipline: "bike", city: "Padova", following: true });
  });
  it("maps a public profile, with only the sports the athlete has", () => {
    const a = toAthletePublic(row);
    expect(a.ratings).toEqual({ bike: { rating: 380, league: "passo" } });
    expect([a.level, a.xp, a.racesDone, a.followers, a.followingCount]).toEqual([1, 0, 0, 1, 0]);
  });
});

describe("rows of city_ranking", () => {
  it("maps a ranking row; rank arrives as a bigint, sometimes as text", () => {
    expect(toRankEntry({ user_id: "u1", username: "prova_a", rating: 612, league: "cresta", rank: "1" })).toEqual({ userId: "u1", username: "prova_a", rating: 612, league: "cresta", rank: 1 });
  });
});
