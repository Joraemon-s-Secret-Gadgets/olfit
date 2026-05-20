# [확장 방안] LLM 기반 검색 쿼리 최적화 (Natural Query Generation)

이 문서는 향수 추천 엔진의 검색 정확도(RAG 성능)를 고도화하기 위해 실험적으로 구현된 **LLM 기반 자연어 쿼리 생성** 기능에 대한 설계 및 확장 가이드를 제공합니다.

## 1. 개요 (Overview)

현재 Olfít 시스템은 사용자의 시각적 분위기(VLM 분석 결과)와 성분 취향(Selected Notes)을 조합하여 검색 쿼리를 생성합니다. 기존 방식은 미리 정의된 템플릿(문장 구조)에 키워드를 삽입하는 방식을 사용하고 있으나, 검색 엔진(Vector DB) 내의 풍부한 향수 묘사와 문학적인 리뷰 데이터에 더 정교하게 매칭되기 위해서는 **감각적이고 서술적인 자연어 생성**이 필요합니다.

### 주요 목표
- **의미적 매칭 강화**: 단순 키워드 나열이 아닌, 향수의 실제 설명 문구와 유사한 '향수 도메인 특화' 문장 생성.
- **감성 지능 결합**: 시각적 요소(색상, 소재)를 후각적 형용사로 변환하여 임베딩 공간에서의 거리를 좁힘.
- **Few-shot 기반 제어**: LLM의 무작위성을 억제하고 일관된 출력 규격을 유지.

---

## 2. 아키텍처 및 로직 흐름 (적용 가이드)

LLM 기반 쿼리 생성 기능을 재도입할 경우, `AuraService`의 쿼리 생성 로직을 확장하여 통합합니다.

### 2.1 주요 컴포넌트 구성 경로
- **프롬프트 정의**: `backend/app/scent_engine/prompts.py` 내에 `NATURAL_QUERY_PROMPT` 상수를 추가 정의합니다.
- **학습 데이터**: `backend/app/scent_engine/query_few_shots.json` 파일을 생성하여 Few-shot 데이터를 관리합니다.
- **서비스 통합**: `AuraService` 클래스 내에 `generate_experimental_llm_query` 메서드를 추가하고, `calculate_combined_aura`의 마지막 단계에서 기존 템플릿 로직 대신 호출하도록 수정합니다.

### 2.2 처리 프로세스
1.  **Few-shot 로드**: 미리 준비된 고품질의 쿼리 생성 패턴 데이터를 로드합니다.
2.  **프롬프트 조립**:
    - **System Role**: 에이전트의 페르소나 설정 및 Few-shot 예시 주입.
    - **User Role**: 현재 분석된 VLM 결과 JSON과 사용자가 선택한 노트 리스트 전달.
3.  **LLM 추론**: `gpt-4o-mini` 등의 모델을 사용하여 쿼리 문장 생성 (Low Temperature 권장).
4.  **Fallback 전략**: LLM 호출 실패 시 기존 템플릿 기반 쿼리(`_generate_symmetric_korean_query`)로 자동 전환.

---

## 3. 프롬프트 및 학습 설계 (Few-shot Strategy)

LLM의 성능은 문맥(Context)과 예시(Example)에 크게 의존합니다.

### 3.1 시스템 프롬프트 가이드라인
- **페르소나**: "검색 쿼리 최적화 에이전트".
- **제약 사항**:
  - "XX한 스타일에는 OO한 향이 어울린다"와 같은 대화형 어투 금지.
  - 상품 설명 및 리뷰에 가까운 **밀도 높은 명사/형용사구** 중심 서술.
  - 150자 이내의 단일 문장으로 제한.
- **최적화 전략**: 시각 키워드를 후각적 언어로 치환 (예: `Black` + `Leather` → `스모키하고 묵직한 가죽의 질감`).

### 3.2 Few-shot 데이터 구조
```json
{
  "vlm_raw": { "visual_summary": "심플한 화이트 셔츠와 미니멀한 슬랙스를 입은 전문적인 오피스 룩.", "colors": ["white"], "mood": ["clean"], ... },
  "selected_notes": ["아이리스"],
  "target_query": "아이리스 노트가 중심이며... 모던하고 클린한 분위기가 뚜렷하게 느껴지는 제품입니다. #단정한 #세련된 #지적인..."
}
```

---

## 4. 기대 효과 및 성능 비교

| 항목 | 기존 방식 (Template-based) | 확장 방식 (LLM-based) |
| :--- | :--- | :--- |
| **유연성** | 고정된 문장 구조로 인해 표현이 단조로움 | 입력 키워드 간의 관계를 파악하여 유기적 서술 가능 |
| **임베딩 품질** | 단순 키워드 가중치에 의존 | 문장 내 문맥 정보를 활용한 고차원 의미 검색 |
| **도메인 적합성** | 기계적인 조합 | 전문 향수 비평/설명과 유사한 텍스트 생성 |

---

## 5. 향후 구현 시 고려 사항

1.  **지연 시간(Latency) 관리**: LLM 호출은 API 통신으로 인해 약 1~2초의 지연이 발생합니다. 비동기 처리 또는 쿼리 생성 단계의 스트리밍을 고려해야 합니다.
2.  **비용 최적화**: 모든 요청에 LLM을 사용하는 대신, 특정 신뢰도 이상의 VLM 결과가 도출되었을 때만 사용하거나 `gpt-4o-mini`와 같은 경량 모델을 활용하여 비용을 절감합니다.
3.  **캐싱**: 동일하거나 매우 유사한 VLM 결과(해시값 기준)에 대해서는 생성된 쿼리를 캐싱하여 재사용할 수 있습니다.
4.  **평가 루프**: 생성된 쿼리가 실제 추천 결과의 만족도를 얼마나 높였는지에 대한 A/B 테스트 지표를 수집해야 합니다.

---

## 6. 구현 청사진 (Implementation Blueprint)

향후 기능 활성화를 위해 참조할 핵심 프롬프트와 로직의 가이드라인입니다.

### 6.1 프롬프트 정의 (`scent_engine/prompts.py`에 추가 예시)
```python
NATURAL_QUERY_PROMPT = """
너는 향수 추천 RAG 시스템을 위한 '검색 쿼리 최적화 에이전트'다.
사용자의 시각적 분위기(VLM 추출)와 선호 성분(노트)을 조합하여, 검색 엔진(Vector DB)의 향수 상품 설명 및 리뷰 문서와 가장 유사하게 매칭될 수 있는 감각적인 묘사 문장을 생성하라.

[작성 가이드라인]
1. 조합: 시각적 요소(색상, 소재, 장면), 감성적 요소(무드), 선택한 노트(성분)를 하나의 자연스러운 후각적 묘사로 엮어라.
2. 문장 구조: "XX한 스타일에는 OO한 향이 어울린다" 같은 대화/추천형 어투는 절대 피하라. 대신, "XX한 무드를 담은 OO한 향수", "XX의 분위기가 느껴지는 OO 계열의 향" 등 '상품 설명'에 가까운 밀도 높은 명사/형용사구 중심으로 서술하라.
3. 임베딩 최적화: 시각적 키워드를 후각적/감각적 형용사로 변환하여 텍스트 간의 의미적 거리를 좁혀라. (예: 'black, leather' -> '깊고 스모키한 가죽의 묵직함')
4. 출력 제한: 150자 이내의 단일 문장으로 작성하며, 따옴표(" ")나 '결과:' 같은 접두어 없이 오직 완성된 문장 텍스트만 출력하라.

[학습된 쿼리 패턴]
{few_shots}

위 패턴과 가이드라인을 엄격히 준수하여 최종 쿼리 문장만을 출력하라.
"""
```

### 6.2 메서드 구현 (`AuraService` 클래스에 삽입)
```python
    def generate_experimental_llm_query(self, vl_result, selected_notes):
        """
        LLM과 Few-shot을 사용하여 자연어 쿼리를 생성합니다.
        AuraService.calculate_combined_aura()의 마지막 단계에서 이 메서드를 호출하여 
        기존의 템플릿 기반 쿼리(_generate_symmetric_korean_query)를 대체할 수 있습니다.
        """
        import os
        import json
        from openai import OpenAI
        from scent_engine.prompts import NATURAL_QUERY_PROMPT

        # 1. Few-shot 로드 및 포맷팅
        fs_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "scent_engine",
            "query_few_shots.json",
        )
        try:
            with open(fs_path, "r", encoding="utf-8") as f:
                few_shots = json.load(f)

            fs_formatted = ""
            for i, fs in enumerate(few_shots):
                fs_formatted += f"### 패턴 {i+1}\\n"
                fs_formatted += (f"- 입력 데이터: {json.dumps(fs['vlm_raw'], ensure_ascii=False)}\\n")
                fs_formatted += f"- 선택 노트: {', '.join(fs['selected_notes'])}\\n"
                fs_formatted += f"- 생성 쿼리: {fs['target_query']}\\n\\n"
        except Exception as e:
            fs_formatted = "패턴 데이터 없음"

        # 2. 프롬프트 구성 (System/User 역할 분리)
        system_content = NATURAL_QUERY_PROMPT.format(few_shots=fs_formatted)
        user_content = f"""[실제 요청 데이터]
        - 입력 데이터: {json.dumps(vl_result, ensure_ascii=False)}
        - 선택 노트: {', '.join(selected_notes)}
        """

        # 3. LLM API 호출 (OpenAI SDK 사용)
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_content},
                    {"role": "user", "content": user_content},
                ],
                temperature=0.3,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            # 실패 시 기존 대칭형 쿼리 생성 로직으로 Fallback
            return self._generate_symmetric_korean_query(vl_result, {}, {"플로럴": 0}, selected_notes)
```
