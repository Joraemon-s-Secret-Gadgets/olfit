/**
 * @file ScentNoteCarousel.tsx
 * @description 향기의 계층(Top, Middle, Base)별로 하나의 원료를 선택하여 조화로운 향의 피라미드를 완성하는 슬롯 기반 캐러셀입니다.
 * 카테고리별 교체 로직, 슬롯 가이드 UI, 10초 주기 자동 재생 기능을 포함합니다.
 */

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Check, RefreshCw, Info } from 'lucide-react';
import { scentNotes } from "@/data/noteData";
import type { ScentNote } from "@/data/noteData";

interface ScentNoteCarouselProps {
  /** 선택된 노드들이 변경될 때 부모 컴포넌트로 전달하는 콜백 */
  onNotesChange?: (notes: string[]) => void;
}

export default function ScentNoteCarousel({ onNotesChange }: ScentNoteCarouselProps) {
  const [activeTab, setActiveTab] = useState<"Top" | "Middle" | "Base">('Top');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  /** 
   * 슬롯 기반 선택 상태 관리 
   * { Top: ScentNote | null, Middle: ScentNote | null, Base: ScentNote | null }
   */
  const [slots, setSlots] = useState<Record<string, ScentNote | null>>({
    Top: null,
    Middle: null,
    Base: null
  });

  const currentNotes = scentNotes.filter(n => n.category === activeTab);
  const totalNotes = currentNotes.length;
  const currentNote = currentNotes[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalNotes);
  }, [totalNotes]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalNotes) % totalNotes);
  }, [totalNotes]);

  const handleTabChange = (tab: "Top" | "Middle" | "Base") => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  /**
   * 노트를 슬롯에 담거나 교체하는 핸들러
   */
  const toggleNote = (note: ScentNote) => {
    setSlots(prev => {
      const isAlreadySelected = prev[note.category]?.enName === note.enName;
      const newSlots = {
        ...prev,
        [note.category]: isAlreadySelected ? null : note
      };

      // 부모에게 변경사항 전달 (필터링된 이름 리스트)
      if (onNotesChange) {
        const selectedNames = Object.values(newSlots)
          .filter((n): n is ScentNote => n !== null)
          .map(n => n.name);
        onNotesChange(selectedNames);
      }
      
      return newSlots;
    });
  };

  const resetNotes = () => {
    const emptySlots = { Top: null, Middle: null, Base: null };
    setSlots(emptySlots);
    if (onNotesChange) onNotesChange([]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(timer);
  }, [activeTab, currentIndex, handleNext]);

  const isSelected = slots[activeTab]?.enName === currentNote?.enName;
  const isAllSelected = slots.Top && slots.Middle && slots.Base;

  return (
    <div className="w-full bg-cream/30 rounded-sm border border-wood/5 p-8 md:p-12 flex flex-col items-center mt-12 relative overflow-hidden">
      {/* 배경 장식 (모든 슬롯이 채워졌을 때 우아한 광채 효과) */}
      <div className={`absolute inset-0 bg-wood/5 transition-opacity duration-[2000ms] ${isAllSelected ? 'opacity-100' : 'opacity-0'}`} />

      {/* 상단 헤더: 슬롯 가이드 UI */}
      <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center mb-16 gap-10">
        <div className="text-center md:text-left max-w-xs">
          <h3 className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-wood/30 mb-2">
            03. Scent Pyramid (향의 구조 설계)
          </h3>
          <p className="text-[11px] text-wood/50 leading-relaxed break-keep">
            {isAllSelected 
              ? "완벽한 향의 삼각형이 완성되었습니다. 당신의 감각이 조화롭게 정렬되었습니다." 
              : "탑, 미들, 베이스 노트에서 각각 가장 마음에 드는 원료를 하나씩 골라 조화를 완성하세요."}
          </p>
        </div>

        {/* 슬롯 상태 시각화 */}
        <div className="flex items-center gap-4 sm:gap-6">
          {(['Top', 'Middle', 'Base'] as const).map((cat) => (
            <div key={cat} className="flex flex-col items-center gap-2">
              <div 
                onClick={() => handleTabChange(cat)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex flex-col items-center justify-center cursor-pointer transition-all duration-700 ${
                  slots[cat] 
                    ? 'bg-wood border-wood shadow-lg scale-105' 
                    : activeTab === cat 
                      ? 'border-wood/40 bg-wood/5' 
                      : 'border-wood/10 bg-transparent'
                }`}
              >
                <span className={`text-[8px] uppercase tracking-tighter ${slots[cat] ? 'text-cream/50' : 'text-wood/30'}`}>{cat[0]}</span>
                {slots[cat] ? (
                  <Check size={14} className="text-cream animate-in zoom-in duration-500" />
                ) : (
                  <div className={`w-1 h-1 rounded-full ${activeTab === cat ? 'bg-wood animate-pulse' : 'bg-wood/10'}`} />
                )}
              </div>
              <span className={`text-[9px] uppercase tracking-widest font-medium transition-colors ${slots[cat] ? 'text-wood' : 'text-wood/30'}`}>
                {slots[cat] ? slots[cat]?.name : cat}
              </span>
            </div>
          ))}
          <div className="h-10 w-px bg-wood/10 mx-2 hidden sm:block" />
          <button 
            onClick={resetNotes}
            className="flex flex-col items-center gap-2 text-wood/30 hover:text-wood transition-colors group"
          >
            <div className="w-10 h-10 rounded-full border border-wood/10 flex items-center justify-center group-hover:border-wood/30">
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <span className="text-[8px] uppercase tracking-widest">Reset</span>
          </button>
        </div>
      </div>

      {/* 1. 탭 네비게이션 */}
      <div className="relative z-10 flex gap-6 md:gap-8 mb-16 w-full justify-center">
        {(['Top', 'Middle', 'Base'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`relative pb-2 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
              activeTab === tab ? 'text-wood' : 'text-wood/30 hover:text-wood/50'
            }`}
          >
            {tab} Note
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-wood" />
            )}
            {slots[tab] && (
              <div className="absolute -top-1 -right-2 w-1 h-1 bg-wood rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 2. 캐러셀 메인 영역 */}
      <div className="relative z-10 w-full flex flex-col items-center max-w-2xl">
        <div className="text-[10px] tracking-[0.3em] text-wood/30 uppercase mb-8 font-mono">
          {currentIndex + 1} / {totalNotes}
        </div>

        <div className="flex items-center justify-between w-full mb-10 gap-4 sm:gap-12">
          <button
            onClick={handlePrev}
            className="p-4 text-wood/20 hover:text-wood transition-colors flex-shrink-0"
            aria-label="Previous note"
          >
            <ChevronLeft size={24} strokeWidth={1} />
          </button>

          <div 
            key={`${activeTab}-${currentIndex}`}
            className="flex-1 text-center animate-in fade-in slide-in-from-bottom-2 duration-1000 ease-out cursor-pointer group"
            onClick={() => toggleNote(currentNote)}
          >
            <div className="relative inline-block mb-4">
              <h3 className={`text-3xl md:text-5xl font-light tracking-tight transition-all duration-700 ${isSelected ? 'text-wood scale-105' : 'text-wood/80'} mb-2`} style={{ fontFamily: "'Playfair Display', serif" }}>
                {currentNote?.name}
              </h3>
              {isSelected && (
                <div className="absolute -top-2 -right-6 text-wood animate-in zoom-in duration-500">
                  <Check size={20} strokeWidth={3} />
                </div>
              )}
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-wood/30 mb-6">{currentNote?.enName}</p>
            
            <div className="max-w-md mx-auto space-y-6">
              <p className="text-[15px] md:text-[17px] leading-relaxed text-wood/70 break-keep font-light transition-colors group-hover:text-wood/90 italic">
                "{currentNote?.description}"
              </p>
              
              <div className="flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] uppercase tracking-[0.2em] text-wood/40">Origin</span>
                <p className="text-[11px] text-wood/60 font-medium">{currentNote?.origin}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="p-4 text-wood/20 hover:text-wood transition-colors flex-shrink-0"
            aria-label="Next note"
          >
            <ChevronRight size={24} strokeWidth={1} />
          </button>
        </div>

        <button
          onClick={() => toggleNote(currentNote)}
          className={`px-10 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border ${
            isSelected 
              ? 'bg-wood text-cream border-wood shadow-lg' 
              : 'bg-transparent text-wood/60 border-wood/20 hover:border-wood/40 hover:text-wood'
          }`}
        >
          {isSelected ? 'In your Pyramid' : `Select as ${activeTab} Note`}
        </button>
      </div>

      {/* 3. 하단 점 인디케이터 */}
      <div className="relative z-10 flex gap-2 mt-16">
        {currentNotes.map((note, idx) => {
          const isNoteSelected = Object.values(slots).some(n => n?.enName === note.enName);
          return (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-1 rounded-full transition-all duration-500 ease-in-out relative ${
                currentIndex === idx 
                  ? 'w-8 bg-wood' 
                  : 'w-2 bg-wood/10 hover:bg-wood/20'
              }`}
            >
              {isNoteSelected && currentIndex !== idx && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-wood rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative z-10 mt-12 flex items-center gap-2 text-[9px] text-wood/20 tracking-[0.3em] uppercase italic">
        <Info size={10} />
        <span>Balanced selection ensures a more accurate AI style match</span>
      </div>
    </div>
  );
}



// EOF: ScentNoteCarousel.tsx
