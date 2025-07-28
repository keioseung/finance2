# Financial Analysis Dashboard

DART API를 활용한 기업 재무지표 종합 분석 플랫폼입니다.

## 🏗️ 아키텍처

- **Frontend**: Next.js 14 (TypeScript, Tailwind CSS, Recharts)
- **Backend**: FastAPI (Python)
- **API**: DART Open API
- **Deployment**: Vercel (Frontend), Render (Backend)

## 🚀 주요 기능

### 📊 재무 분석
- **수익성 지표**: ROE, ROA, 영업이익률 등
- **안정성 지표**: 부채비율, 유동비율, 자기자본비율 등
- **성장성 지표**: 매출성장률, 영업이익성장률 등
- **활동성 지표**: 총자산회전율, 재고자산회전율 등

### 🎯 시각화
- **레이더 차트**: 종합 재무건전성 평가
- **막대 그래프**: 카테고리별 상세 지표 분석
- **인터랙티브 차트**: Recharts 기반 반응형 차트

### 🔍 검색 기능
- 실시간 회사명 검색
- 자동완성 기능
- 다중 보고서 유형 지원

## 📁 프로젝트 구조

```
finance2/
├── backend/                 # FastAPI 백엔드
│   ├── main.py             # FastAPI 앱
│   ├── dart_service.py     # DART API 서비스
│   ├── models.py           # Pydantic 모델
│   ├── config.py           # 환경 설정
│   ├── requirements.txt    # Python 의존성
│   └── Procfile           # Render 배포 설정
├── frontend/               # Next.js 프론트엔드
│   ├── app/               # App Router
│   ├── components/        # React 컴포넌트
│   ├── lib/              # 유틸리티 함수
│   ├── types/            # TypeScript 타입
│   ├── package.json      # Node.js 의존성
│   └── vercel.json       # Vercel 배포 설정
└── README.md
```

## 🛠️ 설치 및 실행

### 백엔드 (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 프론트엔드 (Next.js)

```bash
cd frontend
npm install
npm run dev
```

## 🔧 환경 변수 설정

### 백엔드 (.env)
```env
DART_API_KEY=your_dart_api_key
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.vercel.app
```

### 프론트엔드 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 배포

### 백엔드 (Render)
1. Render에서 새 Web Service 생성
2. GitHub 저장소 연결
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. 환경 변수 설정

### 프론트엔드 (Vercel)
1. Vercel에서 새 프로젝트 생성
2. GitHub 저장소 연결
3. Framework Preset: Next.js
4. 환경 변수 설정

## 📊 API 엔드포인트

### POST /api/analyze
기업 재무 분석 요청

```json
{
  "company_name": "삼성전자",
  "year": "2023",
  "reprt_code": "11014"
}
```

### GET /api/companies/search
회사명 검색

```
/api/companies/search?query=삼성&limit=10
```

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크/라이트 모드**: 자동 테마 전환
- **로딩 상태**: 스켈레톤 UI 및 스피너
- **에러 핸들링**: 사용자 친화적 에러 메시지
- **접근성**: WCAG 2.1 준수

## 🔒 보안

- CORS 설정
- API 키 환경 변수 관리
- 입력 검증 (Pydantic)
- 에러 로깅

## 📈 성능 최적화

- **프론트엔드**: Next.js App Router, 이미지 최적화
- **백엔드**: 비동기 처리, 캐싱
- **API**: 요청 제한, 타임아웃 설정

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 🙏 감사의 말

- [DART Open API](https://opendart.fss.or.kr/) - 재무 데이터 제공
- [Next.js](https://nextjs.org/) - React 프레임워크
- [FastAPI](https://fastapi.tiangolo.com/) - Python 웹 프레임워크
- [Recharts](https://recharts.org/) - 차트 라이브러리
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크 