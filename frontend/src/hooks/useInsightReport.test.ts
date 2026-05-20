/**
 * @file useInsightReport.test.ts
 * @description 회귀 방지를 위한 테스트 파일입니다.
 * @lastModified 2026-05-15
 */

import { describe, expect, it } from "vitest";
import { sortByPriceKrw } from "./useInsightReport";

describe("sortByPriceKrw", () => {
  it("sorts recommendations by backend-provided KRW price instead of display price text", () => {
    const products = [
      { id: "usd", price: "$150", price_krw: 207000 },
      { id: "eur", price: "€120", price_krw: 180000 },
      { id: "krw", price: "₩90,000", price_krw: 90000 },
    ];

    expect(sortByPriceKrw(products).map((product) => product.id)).toEqual([
      "krw",
      "eur",
      "usd",
    ]);
  });

  it("places missing or invalid KRW prices after priced recommendations", () => {
    const products = [
      { id: "missing", price: "정보없음" },
      { id: "zero", price: "정보없음", price_krw: 0 },
      { id: "priced", price: "₩280,000", price_krw: 280000 },
    ];

    expect(sortByPriceKrw(products).map((product) => product.id)).toEqual([
      "priced",
      "missing",
      "zero",
    ]);
  });
});

// EOF: useInsightReport.test.ts
