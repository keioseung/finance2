# 🚀 배포 가이드

이 문서는 Financial Analysis Dashboard를 Vercel(프론트엔드)과 Render(백엔드)에 배포하는 방법을 설명합니다.

## 📋 사전 준비

1. **GitHub 저장소 생성**
   - 이 프로젝트를 GitHub에 푸시
   - Public 또는 Private 저장소 선택

2. **DART API 키 발급**
   - [DART Open API](https://opendart.fss.or.kr/)에서 API 키 발급
   - 발급받은 키를 안전하게 보관

## 🔧 백엔드 배포 (Render)

### 1. Render 계정 생성 및 로그인
- [Render](https://render.com/)에서 계정 생성
- GitHub 계정으로 로그인

### 2. 새 Web Service 생성
1. Dashboard에서 "New +" 클릭
2. "Web Service" 선택
3. GitHub 저장소 연결

### 3. 서비스 설정
```
Name: financial-analysis-api
Environment: Python 3
Region: Singapore (Asia)
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 4. 환경 변수 설정
Settings > Environment Variables에서 다음 변수 추가:

```
DART_API_KEY = your_dart_api_key_here
CORS_ORIGINS = https://your-frontend-domain.vercel.app
```

### 5. 배포 확인
- "Create Web Service" 클릭
- 배포 완료 후 제공되는 URL 확인 (예: `https://your-api-name.onrender.com`)

## 🎨 프론트엔드 배포 (Vercel)

### 1. Vercel 계정 생성 및 로그인
- [Vercel](https://vercel.com/)에서 계정 생성
- GitHub 계정으로 로그인

### 2. 새 프로젝트 생성
1. Dashboard에서 "New Project" 클릭
2. GitHub 저장소 선택
3. Framework Preset: Next.js 선택

### 3. 프로젝트 설정
```
Project Name: financial-analysis-dashboard
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 4. 환경 변수 설정
Settings > Environment Variables에서 다음 변수 추가:

```
NEXT_PUBLIC_API_URL = https://your-api-name.onrender.com
```

### 5. 배포 확인
- "Deploy" 클릭
- 배포 완료 후 제공되는 URL 확인 (예: `https://your-project.vercel.app`)

## 🔄 CORS 설정 업데이트

백엔드 배포 후, 프론트엔드 URL을 백엔드 CORS 설정에 추가:

1. Render Dashboard에서 백엔드 서비스 선택
2. Settings > Environment Variables
3. `CORS_ORIGINS` 값을 업데이트:
   ```
   https://your-frontend-domain.vercel.app
   ```
4. "Save Changes" 클릭
5. 서비스 재배포

## 🧪 배포 테스트

### 1. 백엔드 API 테스트
```bash
curl https://your-api-name.onrender.com/health
```

예상 응답:
```json
{"status": "healthy"}
```

### 2. 프론트엔드 테스트
1. 브라우저에서 프론트엔드 URL 접속
2. 회사명 입력 (예: "삼성전자")
3. 분석 실행
4. 결과 확인

## 🔍 문제 해결

### 백엔드 배포 실패
- **Build Error**: `requirements.txt` 확인
- **Start Error**: `Procfile` 확인
- **API Key Error**: 환경 변수 설정 확인

### 프론트엔드 배포 실패
- **Build Error**: `package.json` 의존성 확인
- **API Connection Error**: `NEXT_PUBLIC_API_URL` 확인

### CORS 오류
- 백엔드 CORS 설정 확인
- 프론트엔드 URL이 허용 목록에 포함되어 있는지 확인

## 📊 모니터링

### Render 모니터링
- Logs 탭에서 실시간 로그 확인
- Metrics 탭에서 성능 모니터링

### Vercel 모니터링
- Analytics 탭에서 방문자 통계
- Functions 탭에서 서버리스 함수 모니터링

## 🔒 보안 고려사항

1. **API 키 보안**
   - 환경 변수로 관리
   - GitHub에 직접 노출 금지

2. **CORS 설정**
   - 필요한 도메인만 허용
   - 와일드카드 사용 금지

3. **HTTPS 강제**
   - Vercel과 Render 모두 HTTPS 기본 제공

## 💰 비용 최적화

### Render (백엔드)
- Free Tier: 월 750시간 (무료)
- Paid Plan: $7/월부터

### Vercel (프론트엔드)
- Hobby Plan: 무료
- Pro Plan: $20/월부터

## 🔄 자동 배포 설정

### GitHub Actions (선택사항)
`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      # Render 자동 배포 (GitHub 연동 시 자동)

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      # Vercel 자동 배포 (GitHub 연동 시 자동)
```

## 📞 지원

배포 중 문제가 발생하면:
1. 로그 확인
2. 환경 변수 재확인
3. 서비스 재배포
4. 필요시 GitHub Issues 생성 