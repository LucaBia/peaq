import { describe, expect, it } from "vitest";
import { legalBlocks, type LegalDoc } from "./legal";

describe("legal pages", () => {
  const docs: LegalDoc[] = ["privacy", "terms", "cookie"];
  it("reads each draft into blocks, starting from its title", () => {
    for (const d of docs) {
      const blocks = legalBlocks(d);
      expect(blocks.length).toBeGreaterThan(5);
      expect(blocks[0]!.type).toBe("h1");
    }
  });
  it("never shows the notes for the lawyer", () => {
    for (const d of docs) expect(JSON.stringify(legalBlocks(d))).not.toMatch(/BOZZA|⚖️/);
  });
  it("keeps tables and lists", () => {
    const types = legalBlocks("privacy").map((b) => b.type);
    expect(types).toContain("table");
    expect(types).toContain("ul");
  });
});
