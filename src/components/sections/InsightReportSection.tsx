/**
 * @file InsightReportSection.tsx
 * @description AI 인터뷰 결과를 바탕으로 사용자의 향기 아우라를 분석하여 시각화해 주는 섹션입니다.
 * 정밀한 레이더 차트 분석 결과와 함께 개인화된 향수 추천 리스트를 제공하며, 리포트 저장 기능을 포함합니다.
 */

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import RadarChart from "@/components/common/RadarChart";
import ProductCarousel from "@/components/report/ProductCarousel";
import ScentPyramid from "@/components/common/ScentPyramid";
import { radarData } from "@/data/reportData";
import { scentNotes } from "@/data/noteData";
import { getRecommendedProducts } from "@/services/recommendationEngine";
import { captureReportBlob, shareOrDownloadImage } from "@/services/reportCapture";
import { Share2, Check } from "lucide-react";
import { useRef, useMemo, useState } from "react";
import type { AnalysisResults } from "@/types";
import type { Product } from "@/data/productData";

interface InsightReportSectionProps {
  /** 분석 결과 데이터 */
  results: AnalysisResults | null;
  /** 제품 클릭 시 상세 정보를 보여주기 위한 콜백 */
  onProductClick: (product: Product) => void;
}

export default function InsightReportSection({ results, onProductClick }: InsightReportSectionProps) {
  const { ref: ref1, isVisible: vis1 } = useIntersectionObserver();
  const { ref: ref2, isVisible: vis2 } = useIntersectionObserver();
  const { ref: ref3, isVisible: vis3 } = useIntersectionObserver();
  const { ref: refPyramid, isVisible: visPyramid } = useIntersectionObserver();
  const reportRef = useRef<HTMLDivElement>(null);

  /** 정렬 상태 (추천순 / 가격순) */
  const [sortBy, setSortBy] = useState<"recommended" | "price">("recommended");
  /** 리포트 이미지 생성 중 상태 */
  const [isSaving, setIsSaving] = useState(false);
  /** 공유 완료 피드백 상태 */
  const [feedback, setFeedback] = useState<string | null>(null);

  // 추천 제품 데이터 메모이제이션
  const baseRecommendations = useMemo(() => getRecommendedProducts(results), [results]);

  // 사용자가 선택한 노드 데이터를 피라미드 슬롯 형태로 변환
  const slots = useMemo(() => {
    const selected = results?.analysisMetadata?.selectedNotes || [];
    return {
      Top: scentNotes.find(n => n.category === "Top" && selected.includes(n.name)) || null,
      Middle: scentNotes.find(n => n.category === "Middle" && selected.includes(n.name)) || null,
      Base: scentNotes.find(n => n.category === "Base" && selected.includes(n.name)) || null,
    };
  }, [results]);

  // 일치도 (가장 높은 추천 제품의 유사도 사용)
  const matchPercent = baseRecommendations.length > 0 ? baseRecommendations[0].similarity : 0;

  // 정렬 옵션이 적용된 최종 추천 리스트
  const recommendations = useMemo(() => {
    const sorted = [...baseRecommendations];
    if (sortBy === "price") {
      return sorted.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
        const priceB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
        return priceA - priceB;
      });
    }
    return sorted;
  }, [baseRecommendations, sortBy]);

  // 분석 로직 단계 설명 데이터
  const dynamicLogicSteps = [
    `업로드된 이미지에서 추출된 #현대적 #시크 무드 분석`,
    `사용자가 선택한 원료(${results?.analysisMetadata?.selectedNotes.join(", ") || "선택 없음"})와의 조화 계산`,
    `최적의 향기 아우라 매칭: ${recommendations[0]?.name || "분석 중"}`,
    "시각적 무드와 후각적 취향의 완벽한 밸런스 완성",
  ];

  /**
   * 인터뷰 결과에 따른 레이더 차트 수치를 시뮬레이션합니다.
   */
  const getDynamicRadarData = () => {
    if (!results) return radarData;
    const baseData = [
      { axis: "플로랄", value: 0.2 },
      { axis: "우디", value: 0.5 },
      { axis: "오리엔탈", value: 0.3 },
      { axis: "프레시", value: 0.4 },
      { axis: "구르망", value: 0.2 },
    ];
    return baseData.map(d => ({
      ...d,
      description: radarData.find(rd => rd.axis === d.axis)?.description,
      value: Math.max(0.1, Math.min(0.95, d.value + (Math.random() * 0.1)))
    }));
  };

  const currentRadarData = getDynamicRadarData();
  const theme = { bg: "bg-cream", accent: "text-wood", border: "border-wood/10" };

  /**
   * 분석 결과 공유 및 저장 핸들러
   */
  const handleShareResults = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const blob = await captureReportBlob(reportRef.current);
      if (!blob) throw new Error("Blob creation failed");

      const result = await shareOrDownloadImage(blob);
      
      if (result === "shared") {
        // 네이티브 공유 완료
      } else if (result === "copied") {
        setFeedback("이미지 복사 완료!");
        setTimeout(() => setFeedback(null), 2000);
      } else if (result === "downloaded") {
        setFeedback("이미지 저장 완료!");
        setTimeout(() => setFeedback(null), 2000);
      }
    } catch (err) {
      console.error("Report processing error:", err);
      alert("결과를 처리하던 중 문제가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderText = (text: string) => {
    return text.split("<br/>").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("<br/>").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <section id="report" className={`${theme.bg} py-24 md:py-40 transition-colors duration-1000`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        {!results && (
          <div className="max-w-2xl mx-auto text-center py-20 border border-wood/10 rounded-sm">
            <p className="text-wood/40 uppercase tracking-widest text-[11px] mb-4">Awaiting Analysis</p>
            <h2 className="text-xl sm:text-2xl font-light mb-8 break-keep px-4 text-wood">
              AI 비주얼 분석을 완료하면 <span className="hidden sm:inline"><br/></span> 당신만의 아우라 리포트가 생성됩니다.
            </h2>
          </div>
        )}

        {results && (
          <>
            <div ref={ref1} className={`flex flex-col items-center mb-20 transition-all duration-800 ${vis1 || results ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="label-upper text-wood/40 mb-4">Diagnosis Report</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight break-keep text-wood mb-10 text-center">
                당신의 비주얼 아우라 진단
              </h2>
              
              <div className="flex justify-center">
                <button 
                  onClick={handleShareResults}
                  disabled={isSaving}
                  className={`group flex items-center gap-3 px-8 py-3.5 border rounded-full text-[11px] sm:text-[12px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    isSaving 
                      ? "bg-wood/5 text-wood/30 border-wood/10 cursor-not-allowed" 
                      : feedback 
                        ? "bg-green-50 text-green-600 border-green-200" 
                        : "bg-wood text-cream border-wood hover:bg-wood/90 hover:shadow-lg active:scale-95"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-3 h-3 border-2 border-wood/20 border-t-wood rounded-full animate-spin" />
                      <span className="hidden sm:inline">고화질 리포트 정밀 생성 중...</span>
                      <span className="sm:hidden">생성 중...</span>
                    </>
                  ) : feedback ? (
                    <>
                      <Check size={16} />
                      {feedback}
                    </>
                  ) : (
                    <>
                      <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
                      Share & Save Report
                    </>
                  )}
                </button>
              </div>
            </div>

            <div ref={reportRef} id="report-content" className="p-4 md:p-8 rounded-lg bg-[#FDFCF0]">
              {/* 추가 블록 1: 나의 설계도 (My Scent Blueprint) */}
              <div ref={refPyramid} className={`mb-32 transition-all duration-1000 ${visPyramid || results ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex items-center gap-4 mb-12">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-wood/30">My Scent Blueprint</span>
                  <h3 className={`text-xl font-light tracking-widest uppercase ${theme.accent}`}>나의 설계도</h3>
                  <div className="h-px bg-wood/10 flex-1" />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
                  <div className="w-64 h-64 md:w-80 md:h-80">
                    <ScentPyramid slots={slots} isStatic={true} />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-wood/40 uppercase tracking-widest text-[11px] mb-2 font-mono">AI Analysis Result</p>
                    <h4 className="text-2xl md:text-3xl font-light text-wood break-keep leading-tight">
                      AI가 분석한 당신의 무드와 <br/>
                      <span className="font-medium text-gold">{matchPercent}%</span> 일치합니다
                    </h4>
                    <p className="mt-6 text-[13px] text-wood/60 leading-relaxed max-w-xs break-keep">
                      선택하신 {slots.Top?.name}, {slots.Middle?.name}, {slots.Base?.name} 노트를 바탕으로 당신의 시각적 아우라와 가장 조화로운 향기 밸런스를 찾았습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-32 animate-in fade-in duration-1000">
                <div className="flex items-center gap-4 mb-12">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-wood/30">Visual Analysis</span>
                  <h3 className={`text-xl font-light tracking-widest uppercase ${theme.accent}`}>Personal Aura</h3>
                  <div className="h-px bg-wood/10 flex-1" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                  <div ref={ref2} className={`transition-all duration-800 delay-100 ${vis2 || results ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <RadarChart data={currentRadarData} forceDraw={!!results} />
                  </div>

                  <div ref={ref3} className={`transition-all duration-800 delay-200 ${vis3 || results ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="space-y-0 mb-12">
                      {dynamicLogicSteps.map((step, i) => (
                        <div key={i} className={`group py-5 border-b ${theme.border} flex items-start gap-4 hover:bg-wood/[0.01] transition-colors duration-300`}>
                          <span className="text-[11px] font-medium text-wood/30 mt-0.5 font-mono">0{i + 1}</span>
                          <p className="text-[15px] leading-relaxed text-wood/70 group-hover:text-wood break-keep">{renderText(step)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-32 pt-24 border-t border-wood/10">
                  <div className="flex flex-col items-center mb-16 gap-8">
                    <div className="flex items-center gap-2 p-1 bg-wood/5 rounded-full border border-wood/10">
                      <button
                        onClick={() => setSortBy("recommended")}
                        className={`px-6 py-2 rounded-full text-[10px] font-medium uppercase tracking-widest transition-all ${
                          sortBy === "recommended" ? "bg-wood text-cream shadow-md" : "text-wood/40 hover:text-wood"
                        }`}
                      >
                        추천순
                      </button>
                      <button
                        onClick={() => setSortBy("price")}
                        className={`px-6 py-2 rounded-full text-[10px] font-medium uppercase tracking-widest transition-all ${
                          sortBy === "price" ? "bg-wood text-cream shadow-md" : "text-wood/40 hover:text-wood"
                        }`}
                      >
                        가격순
                      </button>
                    </div>

                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-wood/30 mb-2">Matching Selection</p>
                      <h3 className="text-2xl font-light tracking-tight text-wood">당신의 스타일을 닮은 향기</h3>
                      
                      {recommendations.length > 0 && (
                        <div className="mt-6 max-w-lg mx-auto px-6 py-4 bg-wood/[0.03] border border-wood/10 rounded-sm">
                          <p className="text-[13px] text-wood/70 leading-relaxed italic break-keep text-balance">
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
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// EOF: InsightReportSection.tsx
