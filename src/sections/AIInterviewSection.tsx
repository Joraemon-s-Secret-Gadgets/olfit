/**
 * @file AIInterviewSection.tsx
 * @description 사용자의 취향을 분석하기 위한 AI 채팅 인터뷰 섹션입니다.
 */

import { useState, useRef, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Send, Sparkles, Camera, MessageSquare } from "lucide-react";
import ChatMessage from "@/components/interview/ChatMessage";
import ImageUploader from "@/components/common/ImageUploader";
import { interviewFlows } from "@/data/interviewData";
import type { AnalysisResults } from "@/types";

type Message = {
  id: string;
  sender: "ai" | "user";
  text: string;
  options?: string[];
  image?: string;
};

export default function AIInterviewSection({ onComplete }: { onComplete?: (results: AnalysisResults) => void }) {
  const { ref, isVisible } = useIntersectionObserver();
  const [activeTrack, setActiveTrack] = useState<null | "personal">(null);
  const [inputType, setInputType] = useState<"options" | "image">("options");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      sender: "ai", 
      text: "안녕하세요. Olfit의 AI 조향사입니다. 당신의 오늘 스타일(OOTD) 사진을 보여주시거나, 원하시는 분위기를 말씀해 주세요.", 
      options: ["사진으로 분석하기", "질문으로 시작하기"] 
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [freeInput, setFreeInput] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const totalSteps = activeTrack === "personal" ? interviewFlows.personal.length : 1;
  const progress = activeTrack === "personal" 
    ? Math.min(((currentStep + 1) / totalSteps) * 100, 100)
    : 0;

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping, isAnalyzing]);

  /**
   * 이미지 처리 핸들러
   */
  const handleImageProcessed = (base64: string) => {
    // 사용자가 사진을 보낸 것으로 처리
    const newUserMsg: Message = { id: crypto.randomUUID(), sender: "user", text: "오늘의 스타일 사진을 업로드했습니다.", image: base64 };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsAnalyzing(true);

    // TODO: 실제 백엔드 API 연결 시점
    setTimeout(() => {
      setIsAnalyzing(false);
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "보내주신 스타일을 분석했습니다. 전체적으로 #미니멀 하고 #시크한 무드가 느껴지네요. 이 아우라에 어울리는 최적의 향기를 리포트에서 확인해 보세요.",
      };
      setMessages((prev) => [...prev, aiResponse]);
      
      if (onComplete) {
        onComplete({ 
          type: "personal", 
          personalMood: "시크한 무드", 
          fashionStyle: "미니멀 & 모던" 
        });
      }
      setCurrentStep(100); // 분석 완료 처리
    }, 3000);
  };

  const handleOptionSelect = (option: string) => {
    if (option === "사진으로 분석하기") {
      setInputType("image");
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "user", text: option }]);
      return;
    }
    
    if (option === "질문으로 시작하기") {
      setInputType("options");
      // 질문 트랙 시작
      const track = "personal";
      setActiveTrack(track);
      setCurrentStep(0);
      setMessages((prev) => [
        ...prev, 
        { id: crypto.randomUUID(), sender: "user", text: option },
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: interviewFlows.personal[0].ai,
          options: interviewFlows.personal[0].options,
        }
      ]);
      return;
    }

    const newUserMsg: Message = { id: crypto.randomUUID(), sender: "user", text: option };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    setTimeout(() => {
      if (!activeTrack) {
        const track = "personal";
        setActiveTrack(track);
        setCurrentStep(0);
        const nextAi: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: interviewFlows.personal[0].ai,
          options: interviewFlows.personal[0].options,
        };
        setMessages((prev) => [...prev, nextAi]);
      } else {
        const updatedAnswers = [...userAnswers, option];
        setUserAnswers(updatedAnswers);
        const nextStep = currentStep + 1;
        const currentFlow = interviewFlows.personal;

        if (nextStep < currentFlow.length) {
          const nextAi: Message = {
            id: crypto.randomUUID(),
            sender: "ai",
            text: currentFlow[nextStep].ai,
            options: currentFlow[nextStep].options,
          };
          setMessages((prev) => [...prev, nextAi]);
          setCurrentStep(nextStep);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              sender: "ai",
              text: "분석이 완료되었습니다. 당신을 위한 최적의 향기 번역 결과를 확인해 보세요.",
            },
          ]);
          if (onComplete) {
            onComplete({ type: "personal", personalMood: updatedAnswers[0], fashionStyle: updatedAnswers[1] });
          }
          setCurrentStep(nextStep);
        }
      }
      setIsTyping(false);
    }, 1200);
  };

  const handleFreeSubmit = () => {
    if (!freeInput.trim()) return;
    handleOptionSelect(freeInput.trim());
    setFreeInput("");
  };

  const isComplete = (activeTrack === "personal" && currentStep >= interviewFlows.personal.length) || currentStep === 100;

  return (
    <section id="interview" className="bg-wood text-cream py-24 md:py-40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        <div ref={ref} className={`transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12 md:mb-16">
            <p className="label-upper text-cream/40 mb-4">AI Interview</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight break-keep text-cream">
              {activeTrack === "personal" ? "Personal Scent Style" : "당신의 취향을 들려주세요"}
            </h2>
          </div>

          {activeTrack && !isComplete && (
            <div className="max-w-2xl mx-auto mb-10 md:mb-12">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-cream/40 mb-3">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-px bg-cream/10 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-cream transition-all duration-800"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            <div className="border-t border-cream/10 pt-8">
              <div 
                ref={scrollContainerRef}
                className="h-[450px] sm:h-[500px] overflow-y-auto pr-4 custom-scrollbar mb-6"
              >
                {messages.map((msg, idx) => (
                  <div key={msg.id}>
                    <ChatMessage 
                      msg={msg} 
                      index={idx} 
                      onOptionSelect={handleOptionSelect} 
                    />
                    {msg.image && (
                      <div className="flex justify-end mb-8">
                        <div className="max-w-[200px] rounded-sm overflow-hidden border border-cream/10">
                          <img src={msg.image} alt="Uploaded style" className="w-full h-auto" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 mb-8">
                    <div className="w-6 h-6 rounded-full bg-cream/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={12} className="text-cream/60" />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-1 h-1 bg-cream/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 h-1 bg-cream/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1 h-1 bg-cream/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* 이미지 업로더 영역: 사진 분석 모드일 때 노출 */}
              {inputType === "image" && !isComplete && (
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ImageUploader onImageProcessed={handleImageProcessed} isAnalyzing={isAnalyzing} />
                  <button 
                    onClick={() => setInputType("options")}
                    className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/40 hover:text-cream transition-colors mx-auto"
                  >
                    <MessageSquare size={12} />
                    질문 답변 방식으로 변경하기
                  </button>
                </div>
              )}

              {/* 하단 입력바: 질문 답변 모드일 때 노출 */}
              {inputType === "options" && !isTyping && !isComplete && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-cream/20 pb-2 mt-4">
                    <input
                      type="text"
                      value={freeInput}
                      onChange={(e) => setFreeInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFreeSubmit()}
                      placeholder="자유롭게 입력하거나 아래 버튼을 선택하세요"
                      className="flex-1 bg-transparent text-[14px] text-cream placeholder:text-cream/30 outline-none py-2"
                    />
                    <button
                      onClick={handleFreeSubmit}
                      className="p-2 hover:bg-cream/10 transition-colors"
                    >
                      <Send size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                  <button 
                    onClick={() => setInputType("image")}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/40 hover:text-cream transition-colors mx-auto"
                  >
                    <Camera size={12} />
                    사진 업로드 방식으로 변경하기
                  </button>
                </div>
              )}

              {isComplete && !isTyping && !isAnalyzing && (
                <div className="text-center mt-8 animate-fade-in">
                  <a
                    href="#report"
                    className="inline-flex items-center gap-2 text-[11px] sm:text-[12px] font-medium uppercase tracking-widest border border-cream/30 px-8 py-3.5 hover:bg-cream hover:text-wood transition-all duration-400"
                  >
                    분석 리포트 보기
                    <Sparkles size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
