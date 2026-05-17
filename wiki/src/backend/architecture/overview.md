# 🏛️ Olfít 백엔드 아키텍처 개요 (Backend Overview)

Olfít 백엔드 시스템의 내부 구조, 핵심 컴포넌트 및 서비스 엔진을 기술한다.

## 1. 백엔드 서비스 정의
Olfít 백엔드는 **이미지 분석(VLM)**, **향기 도메인 매핑**, **하이브리드 추천 로직**을 통합 관리하는 핵심 애플리케이션 서버입니다. 프론트엔드의 요청을 받아 AI 모델(NVIDIA, OpenAI)과 벡터 데이터베이스(Pinecone)를 오케스트레이션하여 최적의 향수 추천 데이터를 산출합니다.

## 2. 백엔드 기술 스택 (Tech Stack)

| 구분 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Framework** | Django 5.0, Django REST Framework | RESTful API 및 비즈니스 로직 관리 |
| **Language** | Python 3.12 | 데이터 처리 및 AI 모델 연동 최적화 |
| **Search/Vector** | Pinecone, OpenAI Embedding | 고차원 시맨틱 검색 엔진 |
| **Task/Engine** | NumPy, Scikit-learn | 벡터 연산 및 코사인 유사도 계산 |
| **Database** | MySQL 8.0 (PyMySQL) | 정형 데이터 및 메타데이터 영속화 |

## 3. 백엔드 핵심 컴포넌트 구조

### 3.1 Scent Engine (`scent_engine/`)
- **VLEngine**: NVIDIA NIM API를 통해 이미지의 시각적 특징을 텍스트로 추출.
- **Mapper**: 추출된 시각적 키워드를 `rules.py`에 기반하여 향수 도메인 점수로 변환.
- **Rules**: 색상, 사물, 장면별 향기 계열 가중치 사전 관리.

### 3.2 Perfumes Service (`perfumes/services/`)
- **AuraService**: 시각 분석 데이터와 사용자의 명시적 취향 노트를 융합하여 5축 아우라 벡터 생성.
- **RecommendationService**: RAG 기반의 후보군 추출 및 하이브리드 재랭킹(Aura + RAG) 알고리즘 수행.

### 3.3 Data Access Layer
- **Django ORM**: MySQL RDB와의 상호작용 및 제품 상세 데이터 조회.
- **Pinecone Client**: 시맨틱 검색 수행 및 벡터 데이터 필터링.

---

## 4. 백엔드 오케스트레이션 흐름
백엔드는 복잡한 AI 파이프라인을 하나의 트랜잭션처럼 관리합니다.

1.  **Request Parsing**: 클라이언트의 이미지와 취향 데이터를 검증.
2.  **AI Orchestration**: VLM 분석 -> 임베딩 생성 -> 벡터 검색을 순차적으로 수행.
3.  **Hybrid Logic**: 정성적(RAG) 데이터와 정량적(Aura) 데이터를 결합하여 순위 재정렬.
4.  **Response Building**: 추천 사유(Match Reason) 생성 및 최종 결과 포맷팅.

---

## 5. 관련 문서
- [인프라 구성도 (infra_diagram.md)](./infra_diagram.md)
- [데이터 플로우 (data_flow.md)](./data_flow.md)
- [시퀀스 다이어그램 (sequence_diagram.md)](./sequence_diagram.md)
