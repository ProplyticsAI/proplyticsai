import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("MV3 content script bundling constraints", () => {
  it("keeps the content script standalone so Chrome can load it as a classic script", () => {
    const source = readFileSync(
      resolve(__dirname, "../../src/extension/contentScript.ts"),
      "utf8"
    );

    expect(source).not.toMatch(/^import\s/m);
  });
});
