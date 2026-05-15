/**
 * @file ProductCarousel.tsx
 * @description AI 분석을 통해 선정된 추천 제품들을 카드 형태로 보여주는 캐러셀 컴포넌트입니다.
 * Embla Carousel을 기반으로 수동 슬라이드 기능을 제공합니다.
 * @lastModified 2026-05-15
 */

import { useCallback, useEffect, memo } from "react"; // 🛠️ REFACTOR (성능 최적화): memo 도입
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/productData";
import type { ScentNote } from "@/data/noteData";
import { splitFragranceDisplayName } from "@/utils/koreanText";

interface ProductCarouselProps {
  /** 추천된 제품 리스트 (유사도 점수 포함) */
  products: (Product & { similarity: number })[];
  /** 추천순 기준 AI 베스트 픽 제품 ID */
  bestPickProductId?: Product["id"] | null;
  /** 제품 선택 시 호출되는 핸들러 */
  onProductClick: (product: Product) => void;
  /** 사용자가 선택한 노트 정보 */
  slots: {
    Top: ScentNote | null;
    Middle: ScentNote | null;
    Base: ScentNote | null;
  };
}

const imageSourceFor = (product: Product) => {
  const base64 = product.imageBase64 || product.imageDetail?.base64;
  if (base64) {
    return base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
  }

  return product.imageUrl || product.imageDetail?.url || product.image;
};

// 🛠️ REFACTOR (성능 최적화): 개별 상품 카드 컴포넌트 분리 및 메모이제이션
const ProductCard = memo(({
  item,
  isBestPick,
  onProductClick,
  slots
}: {
  item: Product & { similarity: number };
  isBestPick: boolean;
  onProductClick: (product: Product) => void;
  slots: ProductCarouselProps["slots"];
}) => {
  const displayNameParts = splitFragranceDisplayName(item.name);

  return (
    <div className="flex flex-[0_0_100%] min-w-0 px-4">
      <div
        onClick={() => onProductClick(item)}
        data-family={item.family}
        className="group cursor-pointer h-full min-h-[640px] md:min-h-[520px] w-full bg-white/50 backdrop-blur-sm border border-wood/5 p-8 sm:p-12 rounded-sm hover:bg-wood hover:border-wood transition-all duration-700 overflow-hidden flex flex-col md:flex-row items-center gap-10"
      >
        {/* 제품 이미지 및 유사도 배지 */}
        <div className="w-full md:w-1/2 aspect-square overflow-hidden bg-cream/50 rounded-sm relative">
          <img
            src={imageSourceFor(item)}
            alt={displayNameParts.displayName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            loading="lazy"
          />
          <div
            className="absolute top-4 right-4 h-7 min-w-[74px] px-3 inline-flex items-center justify-center rounded-full bg-wood/80 text-cream text-[10px] leading-none font-mono group-hover:bg-cream group-hover:text-wood transition-colors"
            data-capture-pill="match"
          >
            <span className="inline-block leading-none translate-y-[1.5px]">{item.similarity}% Match</span>
          </div>
        </div>

        {/* 제품 정보 영역 */}
        <div className="w-full md:w-1/2 text-left relative">
          {/* 베스트 추천 표시 */}
          {isBestPick && (
            <div
              className="h-6 min-w-[78px] px-2 inline-flex items-center justify-center bg-wood/10 border border-wood/20 rounded-sm mb-3 group-hover:bg-cream/10 group-hover:border-cream/30 transition-colors"
              data-capture-pill="best"
            >
              <span className="inline-block translate-y-px text-[9px] leading-none font-bold text-wood group-hover:text-cream tracking-[0.15em] uppercase [text-indent:0.15em]">Best Pick</span>
            </div>
          )}
          <p className="text-[11px] uppercase tracking-[0.2em] text-wood/70 group-hover:text-cream/70 group-hover:font-semibold mb-2 transition-all">{item.brand}</p>
          <h4
            className="text-2xl sm:text-3xl font-light text-wood group-hover:text-cream group-hover:font-medium mb-6 break-keep [word-break:keep-all] [overflow-wrap:normal] [line-break:strict] transition-all leading-tight"
            aria-label={displayNameParts.displayName}
          >
            <span className="block">{displayNameParts.name}</span>
            {displayNameParts.concentration && (
              <span className="block">{displayNameParts.concentration}</span>
            )}
          </h4>

          {/* 요약 상세 정보 */}
          <div className="space-y-4 mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-wood/60 group-hover:text-cream/60 group-hover:font-semibold block mb-1 transition-all">Notes</span>
              <p className="text-sm leading-relaxed text-wood group-hover:text-cream group-hover:font-semibold break-keep text-pretty transition-all">
                {item.notes}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-wood/60 group-hover:text-cream/60 group-hover:font-semibold block mb-1 transition-all">Family</span>
                <p className="text-sm font-medium text-wood group-hover:text-cream group-hover:font-bold transition-all">{item.family}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-wood/60 group-hover:text-cream/60 group-hover:font-semibold block mb-1 transition-all">Size</span>
                <p className="text-sm font-medium text-wood group-hover:text-cream group-hover:font-bold transition-all">{item.size}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-wood/60 group-hover:text-cream/60 group-hover:font-semibold block mb-1 transition-all">Price</span>
                <p className="text-sm font-medium text-wood group-hover:text-cream group-hover:font-bold transition-all">{item.price}</p>
              </div>
            </div>
          </div>

          {/* 추가 블록 2: 매칭 근거 텍스트 (Why This Scent) */}
          <div className="mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
            <p className="text-cream/60 text-xs italic break-keep">
              당신이 설계한 '{slots.Base?.name || slots.Middle?.name || slots.Top?.name || "선택된"}' 향기가 이 향수의 {item.family} 분위기를 완성해 줍니다
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-wood group-hover:text-cream group-hover:font-bold pt-6 border-t border-wood/10 group-hover:border-cream/20 transition-all">
            <span>Explore Details</span>
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
});

function ProductCarousel({ products, bestPickProductId, onProductClick, slots }: ProductCarouselProps) {
  /** 캐러셀 엔진 설정 */
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // 🛠️ REFACTOR (성능 최적화): 캐러셀 제어 함수 메모이제이션
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    emblaApi?.scrollTo(0, true);
  }, [emblaApi, products]);

  return (
    <div>
      <div className="relative max-w-4xl mx-auto px-12">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {products.map((item, index) => (
              <ProductCard
                key={item.id}
                item={item}
                isBestPick={bestPickProductId == null ? index === 0 : item.id === bestPickProductId}
                onProductClick={onProductClick}
                slots={slots}
              />
            ))}
          </div>
        </div>

        {/* 좌우 이동 네비게이션 버튼 */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-wood/20 hover:text-wood transition-colors"
        >
          <div className="w-full h-px bg-current rotate-[-45deg] absolute transform origin-left scale-x-50" />
          <div className="w-full h-px bg-current rotate-[45deg] absolute transform origin-left scale-x-50" />
          <span className="sr-only">Previous</span>
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-wood/20 hover:text-wood transition-colors"
        >
          <div className="w-full h-px bg-current rotate-[45deg] absolute transform origin-right scale-x-50" />
          <div className="w-full h-px bg-current rotate-[-45deg] absolute transform origin-right scale-x-50" />
          <span className="sr-only">Next</span>
        </button>
      </div>
    </div>
  );
}

// 🛠️ REFACTOR (성능 최적화): 캐러셀 컴포넌트 메모이제이션
export default memo(ProductCarousel);

// EOF: ProductCarousel.tsx
