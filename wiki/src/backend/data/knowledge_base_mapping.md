# 지식 베이스 및 매핑 데이터 구조 (Knowledge Base & Mappings)

Olfít 백엔드는 향수 도메인의 지식을 수치화하고 정규화하기 위해 다수의 JSON 매핑 파일을 관리합니다. 이 데이터들은 `backend/app/perfumes/data/mappings/` 디렉토리에 위치하며, 시스템의 "브레인" 역할을 수행합니다.

## 1. 주요 매핑 파일 일람

### 1.1 `master_fragrance_map.json`
가장 핵심적인 데이터로, 성분 번역 및 계열 매핑 정보를 담고 있습니다.
- **`note_translations`**: 수천 개의 영문 노트명을 표준화된 한국어로 번역. (예: `Bergamot` -> `베르가못`)
- **`accord_to_category`**: 어코드(Accords)를 시스템의 5개 핵심 축(Floral, Woody 등)으로 매핑.
- **`note_to_accord`**: 개별 성분을 대표 어코드로 연결. (예: `장미` -> `Floral`)

### 1.2 `user_preference_map.json` (또는 `preference_expansion`)
사용자가 선택한 노트를 검색 엔진에 최적화된 키워드로 확장합니다.
- **`axis`**: 해당 노트가 속한 메인 아우라 축 정의.
- **`expansion`**: 검색 성능 향상을 위해 유사한 향기나 상위 카테고리 키워드 리스트 포함. (예: `베르가못` 선택 시 `시트러스`, `프레시` 키워드 함께 고려)

### 1.3 `fragrance_mood_descriptors.json`
VLM이 분석한 추상적인 분위기 키워드를 향수 도메인과 연결합니다.
- **역할**: "Elegant", "Urban", "Romantic" 등 100여 개의 형용사를 향수 계열별 가중치로 변환.

---

## 2. 매핑 데이터 업데이트 프로세스

새로운 브랜드나 향수가 추가되면서 미번역 노트가 발견되거나, 매핑 로직의 보정이 필요한 경우 다음 절차를 따릅니다.

1.  **데이터 수정**: 관련 JSON 파일에 새로운 항목 추가 또는 가중치 수정.
2.  **데이터 재로드**: `python manage.py load_perfumes` 명령어를 실행하여 MySQL DB의 아우라 점수와 `embedding_doc`을 갱신합니다.
3.  **인덱스 동기화**: `python manage.py index_to_pinecone` 명령어를 통해 갱신된 데이터를 벡터 검색 엔진(Pinecone)에 반영합니다.

---

## 3. 유지보수 주의사항
- **키값 일치**: `master_map`의 번역 키와 `AuraService`의 축 명칭(플로럴, 우디 등)이 정확히 일치해야 합니다.
- **데이터 백업**: 매핑 파일 수정 전 반드시 원본을 백업하거나 Git 커밋을 완료하여 로직 왜곡을 방지하십시오.
