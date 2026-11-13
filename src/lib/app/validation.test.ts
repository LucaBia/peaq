import { describe, it, expect } from "vitest";
import { isAdult, bibRangeStatus, isValidUsername, isStrongPassword, isPlausibleRun, isPlausibleWkg } from "./validation";

describe("athlete rules", () => {
  it("requires athletes to be 18 or older", () => {
    const today = new Date(2026, 10, 13);
    expect(isAdult("2008-11-13", today)).toBe(true);
    expect(isAdult("2008-11-14", today)).toBe(false);
  });
  it("reserves bib numbers 1-100 and allows 101-9999", () => {
    expect(bibRangeStatus(100)).toBe("reserved");
    expect(bibRangeStatus(1)).toBe("reserved");
    expect(bibRangeStatus(101)).toBeNull();
    expect(bibRangeStatus(9999)).toBeNull();
    expect(bibRangeStatus(10000)).toBe("invalid");
    expect(bibRangeStatus(0)).toBe("invalid");
  });
  it("validates usernames", () => {
    expect(isValidUsername("marco_r.92")).toBe(true);
    expect(isValidUsername("Marco")).toBe(false);
    expect(isValidUsername("ab")).toBe(false);
  });
  it("requires strong passwords", () => {
    expect(isStrongPassword("Peaqrun1")).toBe(true);
    expect(isStrongPassword("peaqrun1")).toBe(false);
  });
  it("rejects implausible performances", () => {
    expect(isPlausibleRun(5, 20 * 60)).toBe(true);
    expect(isPlausibleRun(5, 10 * 60)).toBe(false);
    expect(isPlausibleWkg(3.2)).toBe(true);
    expect(isPlausibleWkg(9)).toBe(false);
  });
});
