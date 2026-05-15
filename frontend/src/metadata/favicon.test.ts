/**
 * @file favicon.test.ts
 * @description 회귀 방지를 위한 테스트 파일입니다.
 * @lastModified 2026-05-15
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("favicon metadata", () => {
  it("registers the Olfit favicon used by browser tabs", () => {
    const root = process.cwd();
    const indexHtml = readFileSync(resolve(root, "index.html"), "utf8");
    const faviconPath = resolve(root, "public", "olfit-favicon.svg");

    expect(indexHtml).toContain('rel="icon"');
    expect(indexHtml).toContain('href="/olfit-favicon.svg"');
    expect(existsSync(faviconPath)).toBe(true);
    const favicon = readFileSync(faviconPath, "utf8");

    expect(favicon).toContain("<svg");
    expect(favicon).toContain("#2b1208");
    expect(favicon).toContain("#f4b55f");
    expect(favicon).toContain("id=\"perfumeBottle\"");
    expect(favicon).toContain("id=\"scentTrail\"");
  });
});

// EOF: favicon.test.ts
