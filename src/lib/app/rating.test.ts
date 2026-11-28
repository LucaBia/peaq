import { describe, expect, it } from "vitest";
import { LEAGUE_FLOOR, LEAGUES, leagueInk, leagueRange, nextLeague } from "./rating";
import { matchesSport, type AppEvent } from "./events";
import { initials } from "./rankings";

describe("leagues", () => {
  it("has the six leagues in order, with rising thresholds", () => {
    expect(LEAGUES).toEqual(["valle", "collina", "passo", "cresta", "vetta", "peaq"]);
    expect(LEAGUES.map((l) => LEAGUE_FLOOR[l])).toEqual([0, 200, 350, 500, 650, 800]);
  });
  it("knows the next league and stops at PEAQ", () => {
    expect(nextLeague("valle")).toBe("collina");
    expect(nextLeague("vetta")).toBe("peaq");
    expect(nextLeague("peaq")).toBeNull();
  });
  it("writes the rating range of a league", () => {
    expect(leagueRange("valle")).toBe("0–199");
    expect(leagueRange("cresta")).toBe("500–649");
    expect(leagueRange("peaq")).toBe("800+");
  });
  it("uses white text only on Cresta and PEAQ", () => {
    const white = leagueInk("cresta");
    expect(leagueInk("peaq")).toBe(white);
    for (const l of ["valle", "collina", "passo", "vetta"] as const) expect(leagueInk(l)).not.toBe(white);
  });
});

describe("events and rankings helpers", () => {
  const event = (discipline: AppEvent["discipline"]) => ({ discipline }) as AppEvent;
  it("filters events by sport, keeping the ones for both", () => {
    expect(matchesSport(event("run"), "all")).toBe(true);
    expect(matchesSport(event("run"), "run")).toBe(true);
    expect(matchesSport(event("run"), "bike")).toBe(false);
    expect(matchesSport(event("both"), "bike")).toBe(true);
  });
  it("makes two-letter initials from a username", () => {
    expect(initials("giometto")).toBe("GI");
    expect(initials("elena_b")).toBe("EL");
    expect(initials("")).toBe("?");
  });
});
