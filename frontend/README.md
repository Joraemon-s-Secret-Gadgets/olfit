<<<<<<< HEAD
# Olfít Connect: AI-Driven Fragrance Matching Platform

나만의 시각적 아우라와 향기 취향을 연결하여 최적의 향수를 제안하는 **Olfít Connect** 프로젝트의 공식 풀스택 저장소입니다.

## 🌟 Overview

Olfít Connect는 사용자가 업로드한 이미지(OOTD, 공간, 무드 등)를 **NVIDIA NIM (Gemma VLM)**으로 정밀 분석하고, 사용자의 명시적 성분 취향을 결합하여 개인화된 '향기 아우라'를 도출합니다. 800여 개의 실제 향수 데이터를 기반으로 한 다차원 벡터 매칭 알고리즘을 통해 감성과 데이터의 완벽한 연결(Connect)을 제공합니다.

## 🏗️ Architecture

본 저장소는 프론트엔드와 백엔드가 통합된 모노레포 구조로 설계되었습니다.

```text
4th_olfit_connect_playground/
├── frontend/           # React + TypeScript + TailwindCSS + Vite
│   ├── src/            # UI 컴포넌트 및 클라이언트 로직
│   └── Dockerfile      # Vite 개발 서버 컨테이너
├── backend/            # Django 6 + Django REST Framework
│   ├── app/            # Django 소스 및 지능형 추천 엔진 (scent_engine)
│   └── requirements.txt # 백엔드 의존성 통합 관리
├── database/           # MySQL 8.4 Docker 설정 및 초기화 SQL
├── docker-compose.yml  # 전체 시스템 오케스트레이션
└── .env                # NVIDIA API 키 및 DB 자격 증명 (통합 관리)
```

## 🚀 Getting Started

### 1. 환경 변수 설정
루트 디렉토리(`.env`)에 필요한 키를 입력합니다.
```env
NVIDIA_API_KEY=your_nvidia_api_key_here
SQL_DB_PASSWORD=your_db_password
```

### 2. 전체 시스템 가동 (Docker)
Docker Compose를 통해 프론트엔드, 백엔드, 데이터베이스를 한 번에 구축합니다. 데이터베이스 마이그레이션 및 초기 데이터(800+ 향수) 적재가 자동으로 진행됩니다.
```powershell
docker compose up -d --build
```
*   **Frontend Web**: `http://localhost:3000`
*   **Backend API**: `http://localhost:8000`
*   **Database Host**: `localhost:3307` (External Access)

## 🧠 Key Features

- **AI Emotional Mapping**: 이미지에서 색상, 사물, 무드를 추출하여 5축(Floral, Woody, Oriental, Fresh, Gourmand) 아우라 스코어 산출.
- **Symmetric Scent Search**: 100% 한글화된 대칭형 쿼리를 생성하여 이미지의 감성과 향수의 노트를 직관적으로 매칭.
- **High-Resolution Insights**: 분석 결과를 레이더 차트와 함께 고해상도 이미지 리포트로 캡처 및 공유.
- **Hybrid Storage Strategy**: 관계형 메타데이터와 유연한 JSON 상세 정보를 결합한 고성능 하이브리드 아키텍처.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Zustand, TailwindCSS, Framer Motion, html2canvas.
- **Backend**: Python 3.12, Django 6, DRF, OpenAI SDK (NVIDIA NIM).
- **AI/ML**: NVIDIA NIM (google/gemma-3n-e4b-it), NumPy, Scikit-learn.
- **Infrastructure**: Docker Compose, MySQL 8.4.

## 📝 License
이 프로젝트는 MIT License를 따릅니다.
=======
# Olfit (올핏) - AI 기반 개인화 향기 분석 플랫폼 (Frontend Implementation)

> **"당신의 비주얼 아우라를 향기로 완성하다"**
>
> Olfit은 AI 이미지 분석과 사용자 인터뷰를 통해 사용자의 고유한 분위기(Aura)를 파악하고, 그에 최적화된 향기 설계도(Scent Blueprint)와 제품을 제안하는 서비스의 **프론트엔드 파트를 구현**한 저장소입니다.

---

## 🔗 Live Demo
**[https://olfit-front.vercel.app/](https://olfit-front.vercel.app/)**

---

## 🚀 프로젝트 개요
본 저장소는 **React 19와 TypeScript**를 기반으로 Olfit 서비스의 **고도화된 프론트엔드 로직과 UI를 구현**하였습니다. 단순한 정보 제공을 넘어, AI 분석 데이터의 시각화와 감각적인 UX/UI를 통해 사용자에게 몰입감 있는 브랜드 경험을 제공하는 데 집중했습니다.

- **목적**: 시각적 무드 분석 기반 향기 큐레이션 서비스의 프론트엔드 구현
- **핵심 구현**: AI 이미지 분석 연동, 동적 향기 피라미드 설계, 데이터 시각화 리포트
- **UI/UX 지향점**: 프리미엄 브랜드의 감성을 담은 미니멀리즘 디자인과 매끄러운 인터랙션 구현

## 🛠 Tech Stack
현대적인 프론트엔드 생태계의 도구들을 활용하여 유지보수성과 성능을 확보했습니다.

### Core
- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite
- **State Management**: Zustand (전역 상태 관리)
- **Routing**: React Router 7

### Styling & UI
- **Styling**: Tailwind CSS (Utility-first)
- **UI Components**: Shadcn UI (Radix UI 기반의 접근성 준수 컴포넌트)
- **Icons**: Lucide React
- **Animations**: Tailwind Animate, CSS Keyframes & Intersection Observer

### Utilities & Data
- **Data Visualization**: Recharts (사용자 아우라 분석 레이더 차트)
- **Carousel**: Embla Carousel (제품 및 향기 노트 탐색)
- **Form Handling**: React Hook Form & Zod
- **Networking**: Axios

---

## ✨ Key Features (Frontend Implementation)
1. **AI Visual Analysis Flow**: 사용자가 업로드한 이미지를 바탕으로 시각적 무드를 분석하고 처리 과정을 애니메이션 단계로 시각화합니다.
2. **Interactive Scent Pyramid**: 탑/미들/베이스 노트를 사용자가 직접 조합하며 자신만의 향기 구조를 설계하는 인터랙티브 UI를 제공합니다.
3. **Dynamic Insight Report**: 분석된 성향 데이터를 레이더 차트와 맞춤형 텍스트로 변환하여 개인화된 결과 리포트를 생성합니다.
4. **Smart Recommendation Engine**: 사용자의 선택값과 제품 데이터를 비교 분석하여 유사도 점수와 매칭 사유를 동적으로 계산하여 출력합니다.
5. **Responsive & Immersive Design**: 모바일과 데스크탑 모두에서 최적화된 경험을 제공하며, 스크롤 기반의 자연스러운 등장 효과를 적용했습니다.

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 이상 권장)
- **Yarn** (패키지 매니저로 권장)

### Installation
```bash
# 저장소 클론
git clone https://github.com/Joraemon-s-Secret-Gadgets/4th_react_ts_playground.git

# 프로젝트 폴더로 이동
cd 4th_react_ts_playground

# 의존성 설치
yarn install
```

### Development
```bash
# 로컬 개발 서버 실행
yarn dev
```

---

## 📂 Project Structure
```text
src/
├── components/
│   ├── common/      # 피라미드, 레이더 차트 등 재사용 UI
│   ├── guide/       # 향기 교육 및 노트 선택 컴포넌트
│   ├── layout/      # 네비게이션 및 푸터
│   ├── report/      # 분석 결과 리포트 및 추천 리스트
│   └── sections/    # 메인 페이지의 대단위 섹션 구성
├── data/            # 제품 및 향기 노트 도메인 데이터
├── services/        # 추천 로직 및 API 연동 레이어
├── store/           # Zustand를 이용한 전역 상태 관리
├── hooks/           # 인터랙션 최적화를 위한 커스텀 훅
├── types/           # 도메인별 TypeScript 인터페이스
└── App.tsx          # 메인 라우팅 및 전역 레이아웃
```

---

## ✒️ Author
- **Name**: 전종혁 (JJonyeok)
- **GitHub**: [@JJonyeok2](https://github.com/JJonyeok2)
>>>>>>> 9010a83 (docs(project): add olfit migration guidesUpdates the project overview for the migrated monorepo and adds the vector RAG implementation guide plus frontend onboarding and presentation notes.)
