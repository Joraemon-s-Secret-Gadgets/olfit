# 시각-향기 매핑 및 아우라 연산 (Visual-to-Scent & Aura Math)

이 문서는 VLM이 분석한 시각적 요소를 5대 향기 계열 점수로 변환하고, 이를 수치적으로 융합하는 **수학적 모델 및 알고리즘**을 정의합니다.

## 1. 아우라 연산의 수학적 모델

Olfít은 사용자의 스타일과 취향을 벡터 공간상의 점으로 표현하여 정밀한 추천을 수행합니다.

### 1.1 L2 정규화 (L2 Normalization)
코사인 유사도 연산 시 벡터의 크기(Magnitude)가 결과에 미치는 왜곡을 방지하기 위해, 모든 아우라 벡터를 단위 벡터로 정규화합니다.
- **수식**: $V_{normalized} = \frac{V}{\|V\|_2} = \frac{V}{\sqrt{\sum v_i^2}}$
- **목적**: 벡터의 방향(성분 구성비)만을 비교하여 향수의 진하기와 관계없이 '향의 성격'이 유사한 제품을 찾기 위함입니다.
- **적용**: `AuraService` 및 `load_perfumes` 단계에서 소수점 4자리까지 반올림하여 저장.

### 1.2 UI용 Ref Max 스케일링 (Ref Max Scaling)
레이더 차트 시각화 시, 향수 데이터의 특성상 특정 계열(예: 구르망)이 타 계열보다 점수가 낮게 형성되는 현상을 보정합니다.
- **수식**: $Score_{visual} = \text{clip}\left(\frac{Score_{raw}}{RefMax}, 0.1, 1.0\right)$
- **계열별 Ref Max**: 
  - 플로럴(10.0), 우디(7.0), 오리엔탈(7.0), 프레시(10.0), 구르망(4.0)
- **목적**: 사용자에게 각 축의 '충족도'를 직관적으로 전달하기 위한 UX 최적화 기법입니다.

### 1.3 시각-취향 하이브리드 융합 (Vector Fusion)
객관적인 스타일 분석과 주관적인 선호도를 가중 합산하여 최종 아우라를 도출합니다.
- **공식**: $V_{final} = (V_{visual} \times 0.6) + (V_{preference} \times 0.4)$
- **가중치 근거**: 
  - 사용자의 현재 '이미지(OOTD)'가 주는 분위기를 핵심(60%)으로 잡되, 사용자가 직접 선택한 '불변의 취향(Notes)'을 강력하게 반영(40%)하여 추천의 개인화 수준을 높였습니다.

---

## 2. 카테고리별 매핑 규칙 (Trigger Mapping)

VLM이 추출한 키워드는 `mapper.py`에 정의된 5가지 카테고리의 트리거에 의해 점수화됩니다.

| 카테고리 | 가중치 정책 | 매핑 사례 |
| :--- | :--- | :--- |
| **Colors** | 명도/채도 분석 | Black -> Woody/Musk 가산, White -> Fresh/Floral 가산 |
| **Objects** | 직접 성분 매칭 | Leather -> Ambery 가산, Wood -> Woody 가산 |
| **Scenes** | 공간 분위기 반영 | Office -> Modern/Clean, Beach -> Marine/Fresh |
| **Moods** | 감성 태깅 | Elegant -> Floral, Dark -> Woody/Oud |
| **Time/Season** | 온도감 보정 | Winter -> Warm/Ambery, Morning -> Bright/Fresh |

---

## 3. 문맥 보정 및 동적 연산 (Advanced Logic)

### 3.1 중복 매칭 멀티플라이어 (Multiplier)
동일한 성격의 트리거가 여러 번 발견될 경우, 점수가 단순 합산되지 않도록 감쇄 가중치를 적용합니다.
- **공식**: $\text{Multiplier} = \min(1.0 + (count-1) \times 0.25, 1.5)$

### 3.2 블랙(Black) 키워드의 이중성 처리
단순히 색상이 검정색인 것과, 전체 분위기가 어두운 것을 구분하여 처리합니다.
- **Normal Black**: 세련된 도시적 무드로 해석하여 **Musk/Clean** 비중 강화.
- **Dark Black**: 어둡고 묵직한 무드로 해석하여 **Leather/Oud/Incense** 비중 강화.
