/**
 * @file ProductCarousel.test.tsx
 * @description 회귀 방지를 위한 테스트 파일입니다.
 * @lastModified 2026-05-15
 */

import { render, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductCarousel from "./ProductCarousel";
import type { Product } from "@/data/productData";

const scrollTo = vi.fn();
const scrollPrev = vi.fn();
const scrollNext = vi.fn();
const emblaCarouselMock = vi.fn();

vi.mock("embla-carousel-react", () => ({
  default: (options: unknown) => emblaCarouselMock(options),
}));

const slots = {
  Top: null,
  Middle: null,
  Base: null,
};

const createProduct = (id: number, name: string): Product & { similarity: number } => ({
  id,
  name,
  brand: "Test Brand",
  price: "W100,000",
  price_krw: 100000,
  size: "50ml",
  image: "/product.jpg",
  tags: [],
  notes: "Citrus, Musk",
  family: "Fresh",
  mainAccords: [],
  moods: [],
  occasions: [],
  category: "Personal",
  similarity: 90,
  details: {
    story: "Test story",
    topNotes: "Citrus",
    middleNotes: "Floral",
    baseNotes: "Musk",
    bestFor: "Daily",
  },
});

describe("ProductCarousel", () => {
  beforeEach(() => {
    scrollTo.mockClear();
    scrollPrev.mockClear();
    scrollNext.mockClear();
    emblaCarouselMock.mockClear();
    emblaCarouselMock.mockReturnValue([
      vi.fn(),
      {
        scrollPrev,
        scrollNext,
        scrollTo,
      },
    ]);
  });

  it("resets to the first slide when product order changes", () => {
    const first = createProduct(1, "AI Pick");
    const second = createProduct(2, "Lowest Price");
    const third = createProduct(3, "Third Pick");
    const onProductClick = vi.fn();

    const { rerender } = render(
      <ProductCarousel
        products={[first, second, third]}
        onProductClick={onProductClick}
        slots={slots}
      />,
    );

    scrollTo.mockClear();

    rerender(
      <ProductCarousel
        products={[second, first, third]}
        onProductClick={onProductClick}
        slots={slots}
      />,
    );

    expect(scrollTo).toHaveBeenCalledWith(0, true);
  });

  it("keeps the Best Pick badge attached to the original AI pick", () => {
    const aiPick = createProduct(1, "AI Pick");
    const lowestPrice = createProduct(2, "Lowest Price");

    const { container } = render(
      <ProductCarousel
        products={[lowestPrice, aiPick]}
        bestPickProductId={aiPick.id}
        onProductClick={vi.fn()}
        slots={slots}
      />,
    );

    const renderedText = container.textContent || "";

    expect(renderedText.indexOf("Lowest Price")).toBeLessThan(
      renderedText.indexOf("Best Pick"),
    );
    expect(renderedText.indexOf("Best Pick")).toBeLessThan(
      renderedText.indexOf("AI Pick"),
    );
  });

  it("enables carousel loop navigation", () => {
    render(
      <ProductCarousel
        products={[createProduct(1, "AI Pick")]}
        onProductClick={vi.fn()}
        slots={slots}
      />,
    );

    expect(emblaCarouselMock).toHaveBeenCalledWith(
      expect.objectContaining({ loop: true }),
    );
  });

  it("renders product cards with stable full-height sizing", () => {
    const { container } = render(
      <ProductCarousel
        products={[createProduct(1, "AI Pick")]}
        onProductClick={vi.fn()}
        slots={slots}
      />,
    );

    const productCard = container.querySelector("[data-family='Fresh']");

    expect(productCard?.parentElement?.className).toContain("flex");
    expect(productCard?.className).toContain("h-full");
    expect(productCard?.className).toContain("min-h-[");
  });

  it("does not render per-product feedback buttons", () => {
    const { container } = render(
      <ProductCarousel
        products={[createProduct(1, "AI Pick")]}
        onProductClick={vi.fn()}
        slots={slots}
      />,
    );

    const buttons = within(container).getAllByRole("button");

    expect(buttons).toHaveLength(2);
    expect(within(container).getByRole("button", { name: "Previous" })).toBeVisible();
    expect(within(container).getByRole("button", { name: "Next" })).toBeVisible();
  });

  it("keeps Korean fragrance concentration words from splitting in product names", () => {
    const { container } = render(
      <ProductCarousel
        products={[createProduct(1, "샹스 오 후레쉬 오 드 퍼 퓸")]}
        onProductClick={vi.fn()}
        slots={slots}
      />,
    );

    const productName = container.querySelector("h4");

    expect(productName?.getAttribute("aria-label")).toBe("샹스 오 후레쉬 오 드 퍼퓸");
    expect(productName?.textContent).not.toContain("퍼 퓸");
    expect(productName?.className).toContain("[word-break:keep-all]");
    expect(productName?.className).toContain("[overflow-wrap:normal]");
  });

  it("renders fragrance concentration on its own semantic line", () => {
    const { container } = render(
      <ProductCarousel
        products={[createProduct(1, "샹스 오 후레쉬 오 드 퍼퓸")]}
        onProductClick={vi.fn()}
        slots={slots}
      />,
    );

    const productName = container.querySelector("h4");
    expect(productName).not.toBeNull();

    const nameParts = within(productName as HTMLElement);
    expect(nameParts.getByText("샹스 오 후레쉬").className).toContain("block");
    expect(nameParts.getByText("오 드 퍼퓸").className).toContain("block");
  });
});

// EOF: ProductCarousel.test.tsx
