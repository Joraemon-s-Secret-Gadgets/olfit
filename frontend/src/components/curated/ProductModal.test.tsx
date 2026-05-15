/**
 * @file ProductModal.test.tsx
 * @description 회귀 방지를 위한 테스트 파일입니다.
 * @lastModified 2026-05-15
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductModal from "./ProductModal";
import type { Product } from "@/data/productData";

const product: Product = {
  id: 1,
  name: "샹스 오 후레쉬 오 드 퍼 퓸",
  brand: "Chanel",
  price: "W250,000",
  price_krw: 250000,
  size: "100ml",
  image: "/product.jpg",
  tags: ["fresh"],
  notes: "시트론, 자스민, 앰버",
  family: "Fresh",
  mainAccords: [],
  moods: [],
  occasions: [],
  category: "Personal",
  details: {
    story:
      "샹스 오 후레쉬 오 드 퍼 퓸은 시트론의 생동감과 자스민의 부드러움이 자연스럽게 이어지는 향수입니다.",
    topNotes: "시트론",
    middleNotes: "자스민",
    baseNotes: "앰버",
    bestFor: "활기 있는 하루",
  },
};

describe("ProductModal", () => {
  it("renders fragrance concentration on its own semantic title line", () => {
    render(<ProductModal product={product} onClose={vi.fn()} />);

    const title = screen.getByRole("heading", {
      level: 3,
      name: "샹스 오 후레쉬 오 드 퍼퓸",
    });
    const titleParts = within(title);

    expect(titleParts.getByText("샹스 오 후레쉬").className).toContain("block");
    expect(titleParts.getByText("오 드 퍼퓸").className).toContain("block");
  });

  it("renders The Story with Korean word-preserving line wrapping", () => {
    render(<ProductModal product={product} onClose={vi.fn()} />);

    const story = screen.getByText((content) =>
      content.includes("샹스 오 후레쉬 오 드 퍼퓸은 시트론의 생동감"),
    );

    expect(story.textContent).not.toContain("퍼 퓸");
    expect(story.className).toContain("[word-break:keep-all]");
    expect(story.className).toContain("[overflow-wrap:normal]");
    expect(story.className).toContain("[line-break:strict]");
  });
});

// EOF: ProductModal.test.tsx
