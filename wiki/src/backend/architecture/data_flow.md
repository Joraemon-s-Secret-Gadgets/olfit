# Olfít Data Flow

사용자 입력 이미지로부터 최종 추천 결과가 생성되기까지의 데이터 변환, 이동 경로 및 시스템의 안정적 데이터 흐름을 기술합니다.

## 1. 전체 데이터 흐름도 (End-to-End Flow)

Olfít의 데이터는 **[시각 분석] -> [아우라 융합] -> [시맨틱 검색] -> [하이브리드 재정렬]**의 단계를 거치며, 외부 서비스 장애 시 MySQL 기반의 로컬 폴백 경로를 활성화합니다.

<div align="center">
<img src="../../assets/backend/architecture/data_flow.png" style="width: 65%;">
</div>

### 1.1 데이터 이동 경로 상세
1. **Request**: 프론트엔드에서 Base64 이미지와 선호 노트를 `/api/analyze/` 엔드포인트로 전송합니다.
2. **Vision Stage**: `VLEngine`이 이미지를 NVIDIA NIM으로 전송하여 색상, 사물, 무드 등 **구조화된 시각 키워드(JSON)**를 획득합니다.
3. **Aura Stage**: 
    - `AuraService`가 시각 키워드와 선호 노트를 융합(60:40)하여 **5축 아우라 벡터**를 생성합니다.
    - 검색 품질 극대화를 위해 **대칭형 RAG 쿼리(Natural Language)**를 생성합니다.
4. **Retrieval Stage**:
    - **Normal**: 생성된 쿼리를 OpenAI를 통해 벡터화한 후 Pinecone에서 상위 30개 후보군을 검색합니다.
    - **Fallback**: 외부 API 장애 시, MySQL에서 사용자의 메인 아우라 계열(Family)을 기준으로 후보군을 추출합니다.
5. **Reranking Stage**: `RecommendationService`가 아우라 유사도, RAG 점수, 노트 가산점을 합산하여 최종 Top 5를 선정하고 상세 이미지를 로드합니다.

---

## 2. 저장소별 데이터 책임 및 규격

| 저장소 | 주요 데이터 항목 | 규격 및 특징 |
| :--- | :--- | :--- |
| **MySQL** | `Perfume`, `PerfumeDetail`, `PerfumeImage` | 정규화된 텍스트, 아우라 프로필(JSON), 이미지 Base64 |
| **Pinecone** | `embedding_doc` Vector, Metadata | 1536차원 밀집 벡터, 코사인 유사도 검색 최적화 |
| **Local Directory** | `static/perfumes/images/` | 물리적 이미지 자산 (Base64 변환용 원본) |

---

## 3. 핵심 데이터 변환 로직 (Transformation)

### 3.1 시각-향기 수치화 (Aura Quantization)
- **과정**: VLM이 출력한 추상적 키워드(예: "Romantic")를 `rules.py`의 가중치 사전에 따라 5차원 수치 데이터로 변환합니다.
- **결과**: 방향성이 정해진 **원천 점수 벡터(Raw Vector)** 생성.

### 3.2 벡터 정규화 및 융합 (Normalization & Fusion)
- **Normalization**: 코사인 유사도 계산을 위해 모든 벡터를 **L2 Norm**($||v||=1$)으로 정규화합니다.
- **Fusion**: 시각 벡터와 취향 벡터를 $6:4$ 비율로 융합하여 최종적인 **사용자 페르소나 벡터**를 도출합니다.

### 3.3 대칭형 검색 구조 (Symmetric Structure)
- **전략**: 임베딩 모델의 성능을 극대화하기 위해 질문(Query)과 답변(Document)의 문장 성분 구성을 대칭(Symmetry)으로 맞춥니다.
- **데이터 흐름**: `AuraService`가 생성한 쿼리 텍스트 → `OpenAI` → `Pinecone` 매칭.

---

## 4. 장애 시 데이터 흐름 (Fallback Data Flow)

외부 AI 인프라 장애 발생 시 시스템은 다음 경로로 데이터를 우회시켜 가용성을 확보합니다.

1. **VLM 장애**: 미리 정의된 `DUMMY_RESULT`를 분석 결과로 주입하여 이후 프로세스 강제 진행.
2. **Search 장애**: Pinecone 호출 실패 시 즉시 MySQL 쿼리로 전환.
    - `WHERE family = {user_main_family}` 필터링을 통해 아우라 유사도 기반 추천 수행.
