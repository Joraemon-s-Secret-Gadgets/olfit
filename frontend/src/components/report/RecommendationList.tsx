<<<<<<< HEAD
import { memo, useCallback } from "react"; // 🛠️ REFACTOR (성능 최적화): memo, useCallback 도입
=======
>>>>>>> c5c5017 (feat(frontend): migrate react fragrance experienceAdds the Vite React application, Tailwind styling, Zustand state, API services, report capture flow, reusable UI components, and static imagery for the Olfit fragrance matching experience.)
import ProductCarousel from "./ProductCarousel";
import type { Product } from "@/data/productData";
import type { ScentNote } from "@/data/noteData";

interface RecommendationListProps {
  recommendations: (Product & { similarity: number, matchReason: string })[];
  onProductClick: (product: Product) => void;
  slots: {
    Top: ScentNote | null;
    Middle: ScentNote | null;
    Base: ScentNote | null;
  };
  sortBy: "recommended" | "price";
  onSortChange: (sort: "recommended" | "price") => void;
}

<<<<<<< HEAD
function RecommendationList({ 
=======
export default function RecommendationList({ 
>>>>>>> c5c5017 (feat(frontend): migrate react fragrance experienceAdds the Vite React application, Tailwind styling, Zustand state, API services, report capture flow, reusable UI components, and static imagery for the Olfit fragrance matching experience.)
  recommendations, 
  onProductClick, 
  slots, 
  sortBy, 
  onSortChange 
}: RecommendationListProps) {
<<<<<<< HEAD
  const sortButtonClass = "h-8 min-w-[72px] px-5 inline-flex items-center justify-center rounded-full text-[10px] leading-none font-medium uppercase tracking-widest [text-indent:0.15em] transition-all hover:font-bold";
  const sortLabelClass = "inline-block leading-none translate-y-[1.5px]";

  // 🛠️ REFACTOR (성능 최적화): 핸들러 메모이제이션으로 하위 컴포넌트 리렌더링 방지
  const handleRecommendedSort = useCallback(() => onSortChange("recommended"), [onSortChange]);
  const handlePriceSort = useCallback(() => onSortChange("price"), [onSortChange]);

  return (
    <div className="mt-32 pt-24 border-t border-wood/10">
      <div className="flex flex-col items-center mb-16 gap-8">
        <div className="inline-flex h-10 items-center gap-1 p-1 bg-wood/5 rounded-full border border-wood/10">
          <button
            type="button"
            onClick={handleRecommendedSort}
            className={`${sortButtonClass} ${
              sortBy === "recommended" ? "bg-wood text-cream shadow-md" : "text-wood"
            }`}
            data-capture-pill="sort"
          >
            <span className={sortLabelClass}>추천순</span>
          </button>
          <button
            type="button"
            onClick={handlePriceSort}
            className={`${sortButtonClass} ${
              sortBy === "price" ? "bg-wood text-cream shadow-md" : "text-wood"
            }`}
            data-capture-pill="sort"
          >
            <span className={sortLabelClass}>가격순</span>
=======
  return (
    <div className="mt-32 pt-24 border-t border-wood/10">
      <div className="flex flex-col items-center mb-16 gap-8">
        <div className="flex items-center gap-2 p-1 bg-wood/5 rounded-full border border-wood/10">
          <button
            onClick={() => onSortChange("recommended")}
            className={`px-6 py-2 rounded-full text-[10px] font-medium uppercase tracking-widest transition-all ${
              sortBy === "recommended" ? "bg-wood text-cream shadow-md" : "text-wood/40 hover:text-wood"
            }`}
          >
            추천순
          </button>
          <button
            onClick={() => onSortChange("price")}
            className={`px-6 py-2 rounded-full text-[10px] font-medium uppercase tracking-widest transition-all ${
              sortBy === "price" ? "bg-wood text-cream shadow-md" : "text-wood/40 hover:text-wood"
            }`}
          >
            가격순
>>>>>>> c5c5017 (feat(frontend): migrate react fragrance experienceAdds the Vite React application, Tailwind styling, Zustand state, API services, report capture flow, reusable UI components, and static imagery for the Olfit fragrance matching experience.)
          </button>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-wood/30 mb-2">Matching Selection</p>
          <h3 className="text-2xl font-light tracking-tight text-wood">당신의 스타일을 닮은 향기</h3>
          
          {recommendations.length > 0 && (
            <div className="mt-6 max-w-lg mx-auto px-6 py-4 bg-wood/[0.03] border border-wood/10 rounded-sm">
<<<<<<< HEAD
              <p className="text-[13px] text-wood leading-relaxed italic break-keep text-balance">
=======
              <p className="text-[13px] text-wood/70 leading-relaxed italic break-keep text-balance">
>>>>>>> c5c5017 (feat(frontend): migrate react fragrance experienceAdds the Vite React application, Tailwind styling, Zustand state, API services, report capture flow, reusable UI components, and static imagery for the Olfit fragrance matching experience.)
                "{recommendations[0].matchReason}"
              </p>
            </div>
          )}
        </div>
      </div>

      <ProductCarousel 
        products={recommendations} 
        onProductClick={onProductClick} 
        slots={slots}
      />
    </div>
  );
}
<<<<<<< HEAD

// 🛠️ REFACTOR (성능 최적화): 결과 리스트 컴포넌트 메모이제이션
export default memo(RecommendationList);
=======
>>>>>>> c5c5017 (feat(frontend): migrate react fragrance experienceAdds the Vite React application, Tailwind styling, Zustand state, API services, report capture flow, reusable UI components, and static imagery for the Olfit fragrance matching experience.)
