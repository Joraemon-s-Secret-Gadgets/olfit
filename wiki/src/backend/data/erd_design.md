# ERD 설계 및 데이터 모델링 (final)

Olfít 프로젝트의 데이터베이스 구조와 Django 모델 구현 방향을 정의합니다.

### ERD 다이어그램
![ERD](../../assets/backend/data/olfit_erd.png)

## 1. 데이터베이스 아키텍처 개요
초기 경량화 설계에서 확장되어, **데이터의 무결성**, **재처리 가능성**, **대규모 서비스 확장**을 고려한 RDB 중심의 하이브리드(Relational + JSON) 설계를 채택합니다.

## 2. 주요 테이블 정의

### 2.1 Brand (Master)
브랜드 정보를 관리하는 마스터 테이블입니다.
- `id`: PK (BigInt)
- `name`: 브랜드 공식 명칭 (Unique)
- `country_code`: 국가 코드 (예: KR, FR, UK)
- `created_at`: 생성일

### 2.2 Perfume (Core Metadata)
검색, 필터링, 정렬의 기준이 되는 핵심 메타데이터 테이블입니다.
- `id`: PK (BigInt)
- `brand`: Brand 테이블 참조 (FK)
- `korean_name`: 한글 상품명
- `english_name`: 영문 상품명
- `product_type`: 기본 분류 (perfume, cologne 등)
- `family`: 5대 핵심 계열 (Floral, Woody, Oriental, Fresh, Gourmand)
- `release_year`: 출시 연도
- `created_at`: 생성일
- `updated_at`: 수정일

### 2.3 PerfumeDetail (JSON Specs)
Perfume과 1:1 대응하며, 가공된 복합 속성 데이터를 JSON 형식으로 저장합니다.
- `id`: PK (BigInt)
- `perfume`: Perfume 테이블 참조 (FK/Unique)
- `data`: JSON 필드 (가격, 노트, 어코드, 키워드, 아우라 프로필 등 포함)

**JSON 내부 구조 예시:**
```json
{
  "price": {
    "amount": 150,
    "currency": "USD",
    "raw": "$150.00"
  },
  "volume": "100ml",
  "description": "상쾌하고 깨끗한 연꽃과 대나무 향의 조화...",
  "notes": ["대나무", "서양배", "연꽃", ...],
  "representative_notes": ["대나무", "연꽃", "머스크"],
  "accords": ["우디", "플로럴", "머스키"],
  "keywords": ["상쾌한", "우아한", "평화로운"],
  "aura_profile": {
    "floral": 0.2, "woody": 0.5, "oriental": 0.1, "fresh": 0.8, "gourmand": 0.0
  }
}
```

### 2.4 PerfumeImage (Asset Management)
이미지 처리 상태와 경로를 관리하며, PerfumeDetail과 1:N 대응(한 향수에 여러 이미지 가능) 구조입니다.
- `id`: PK (BigInt)
- `perfume_detail`: PerfumeDetail 참조 (FK)
- `original_url`: 원본 이미지 URL (Unique per detail)
- `processed_path`: 가공 후 저장 경로
- `base64_data`: 저장된 base64 인코딩 데이터 (필요시)

### 2.5 PerfumeRawData (Raw Archive)
수집된 가공 전 원본 데이터를 아카이빙하여 파이프라인 변경 시 재가공이 가능하도록 합니다.
- `id`: PK (BigInt)
- `perfume`: Perfume 참조 (FK/Unique)
- `raw_json`: 수집 당시의 원본 데이터 전체 (Full Schema)

---

## 3. Django 모델 구현

위 설계를 바탕으로 한 Django 모델 구성입니다. `models.JSONField`를 사용하여 하이브리드 구조를 구현합니다.

```python
from django.db import models

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    country_code = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Perfume(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='perfumes')
    korean_name = models.CharField(max_length=255)
    english_name = models.CharField(max_length=255)
    product_type = models.CharField(max_length=50)
    family = models.CharField(max_length=50)
    release_year = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.brand.name}] {self.korean_name}"

class PerfumeDetail(models.Model):
    perfume = models.OneToOneField(Perfume, on_delete=models.CASCADE, related_name='detail')
    data = models.JSONField(help_text="Price, Notes, Accords, Keywords, Aura Profile etc.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PerfumeImage(models.Model):
    perfume_detail = models.OneToOneField(PerfumeDetail, on_delete=models.CASCADE, related_name='image')
    original_url = models.URLField(max_length=500)
    processed_path = models.CharField(max_length=500, blank=True, null=True)
    processed_base64 = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PerfumeRawData(models.Model):
    perfume = models.OneToOneField(Perfume, on_delete=models.CASCADE, related_name='raw_data')
    raw_json = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
```
