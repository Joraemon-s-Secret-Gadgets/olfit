# API 명세서 (API Specification v4.9.0)

본 문서는 Olfít 프로젝트 백엔드에서 제공하는 API 엔드포인트와 요청/응답 규격을 정의합니다.

## 1. 공통 사항
- **Base URL**: `/api`
- **인증 방식**: 헤더를 통한 세션 관리 (`X-Session-ID`)
- **데이터 형식**: JSON (Content-Type: `application/json`)

---

## 2. 핵심 API 엔드포인트

### 2.1 통합 분석 및 추천 (Analyze & Recommend)
사용자의 OOTD 이미지와 선호 향료를 전달받아, 시각 분석(VLM), 아우라 점수 계산, 최종 향수 추천을 통합하여 처리합니다.

- **Endpoint**: `POST /analyze/`
- **Description**: 이미지 기반 스타일 분석 및 하이브리드 추천 결과 반환.

#### 요청 (Request)
- **Headers**:
  - `X-Session-ID`: (Required) 개인정보 동의 후 생성된 익명 세션 ID
- **Body**:
  ```json
  {
    "image": "data:image/jpeg;base64,...", // Base64 인코딩된 이미지 문자열
    "selectedNotes": ["베르가못", "머스크"]   // 사용자가 선택한 선호 향료 리스트 (Optional)
  }
  ```

#### 응답 (Response)
- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "type": "personal",
    "personalMood": "#포근한 #우아한 #앰버",    // 분석된 무드 (UI 명칭 치환 적용)
    "perfumeKeywords": ["#베르가못", "#머스크"], // 매칭 성분 (Top 3)
    "fashionStyle": "포근한 베이지색 니트를 입은 모습", // VLM 시각 요약
    "analysisMetadata": {
      "base64Image": "...",
      "selectedNotes": ["..."],
      "radarScores": {                     // UI 레이더 차트용 점수 (0.1 ~ 1.0)
        "플로랄": 0.2,
        "우디": 0.5,
        "앰버": 0.1,
        "프레시": 0.8,
        "구르망": 0.1
      },
      "readableQuery": "..."               // RAG 검색에 사용된 자연어 쿼리
    },
    "recommendations": [
      {
        "id": 123,
        "name": "디올 소바쥬",
        "brand": "DIOR",
        "price": "135,000원",
        "price_krw": 135000,
        "size": "100ml",
        "image": "...",
        "perfume": {
          "id": 123,
          "brand": "DIOR",
          "koreanName": "소바쥬",
          "englishName": "Sauvage",
          "productType": "Eau de Parfum",
          "family": "우디",
          "releaseYear": 2015,
          "price": { "raw": "135,000원", "amount": 135000.0, "currency": "KRW" },
          "description": "...",
          "notes": ["베르가못", "앰브록산"],
          "representativeNotes": ["베르가못", "앰브록산"],
          "notesPyramid": { "top": ["..."], "middle": ["..."], "base": ["..."] },
          "accords": ["Fresh Spicy", "Amber"],
          "keywords": { "ko": ["강렬한", "상쾌한"] },
          "auraProfile": {                 // L2 정규화된 아우라 벡터 (제곱합 1)
            "플로랄": 0.1234,
            "우디": 0.8765,
            "앰버": 0.1234,
            "프레시": 0.1234,
            "구르망": 0.0
          },
          "volume": "100ml"
        },
        "imageDetail": {
          "url": "...",
          "originalUrl": "...",
          "backendPath": "...",
          "base64": "..."                  // DB에 저장된 로컬 이미지의 Base64 데이터
        },
        "tags": ["Fresh Spicy", "Amber"],
        "notes": "베르가못, 앰브록산, ...",
        "family": "우디",
        "category": "Personal",
        "similarity": 95,                  // 최종 매칭 퍼센트 (0~98)
        "matchReason": "당신의 #[우디] 아우라와 완벽하게 공명하는...",
        "details": {
          "story": "...",
          "topNotes": "베르가못",
          "middleNotes": "라벤더",
          "baseNotes": "앰브록산",
          "bestFor": "데일리, 오피스"
        }
      }
    ]
  }
  ```
