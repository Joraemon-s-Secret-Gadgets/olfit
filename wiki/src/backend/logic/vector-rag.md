# 시맨틱 검색 인프라 사양 (Search Engine Infrastructure)

Olfít의 고차원 의미 검색을 뒷받침하는 벡터 데이터베이스 및 임베딩 모델의 기술적 사양과 설정값을 정의합니다.

## 1. 벡터 임베딩 모델 (Embedding Model)

사용자의 자연어 쿼리와 향수 상세 설명을 벡터 공간으로 투영하기 위한 모델 사양입니다.

- **모델명**: OpenAI `text-embedding-3-small`
- **벡터 차원 (Dimensions)**: 1,536차원
- **유사도 측정 방식**: 코사인 유사도 (Cosine Similarity)
- **특징**: 이전 세대 모델 대비 비용 효율적이며, 향수 도메인의 다국어(한/영) 텍스트 간 의미적 관계를 정밀하게 포착합니다.

## 2. 벡터 데이터베이스 (Vector DB)

대규모 향수 벡터 데이터를 저장하고 실시간 유사도 검색을 수행하는 엔진 설정입니다.

- **플랫폼**: Pinecone (Serverless)
- **인덱스명**: `olfit-perfumes`
- **메타데이터 인덱싱**:
    - `perfume_id`: MySQL 레코드와 동기화를 위한 식별자
    - `brand`, `korean_name`: 필터링 및 결과 확인용
    - `representative_notes`: 하이브리드 재정렬 시 성분 가산점 계산용
    - `aura_floral`, `aura_woody` 등: 5축 아우라 프로필 데이터 포함

## 3. 검색 엔진 주요 파라미터 (Configuration)

시스템의 성능과 정확도를 제어하는 핵심 설정값입니다.

| 파라미터 | 설정값 | 비고 |
| :--- | :--- | :--- |
| `RAG_TOP_K` | 30 | Pinecone에서 1차로 추출할 후보군 수 |
| `EMBEDDING_BATCH_SIZE` | 100 | 벌크 인덱싱 시 API 호출 단위 |
| `RETRIEVAL_TIMEOUT` | 5.0s | 검색 엔진 응답 대기 시간 제한 |

## 4. 관련 프로세스 및 로직
- **데이터 인덱싱 흐름**: [데이터 정규화 파이프라인](../pipeline/data_ingestion_pipeline.md) 참조
- **대칭형 검색 전략**: [VLM-추천 통합 파이프라인](../pipeline/vlm_pipeline.md) 참조
- **최종 순위 결정 알고리즘**: [하이브리드 재랭킹 알고리즘](./reranking_algorithm.md) 참조
