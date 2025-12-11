## UtilKit
브라우저에서 모든 처리를 수행하는 개발/이미지 유틸리티 모음입니다. 서버 업로드 없이 동작합니다.

### 폴더 구조
- `frontend/` : React + Vite + TS UI
- `backend/` : 최소 Express 서버(헬스체크/정보). 실제 도구 처리는 모두 클라이언트에서 수행.

### 사전 요구사항
- Node.js 18+ (npm 포함)

### 설치
```bash
# 루트 기준
cd /Users/kimdonghyeon/2025/개발/유틸리티/utilkit

# 프론트엔드 의존성
cd frontend
npm install

# 백엔드 의존성 (선택)
cd ../backend
npm install
```

### 실행
```bash
# 프론트엔드 개발 서버
cd /Users/kimdonghyeon/2025/개발/유틸리티/utilkit/frontend
npm run dev
# 브라우저: http://localhost:5173

# 백엔드 (선택, 헬스체크/정적 서빙용)
cd /Users/kimdonghyeon/2025/개발/유틸리티/utilkit/backend
npm start
# 헬스체크: http://localhost:4000/health
```

### 포함된 클라이언트 도구
- JSON 포매터/검증
- Base64 인코딩/디코딩
- URL 인코딩/디코딩
- SHA 해시 생성기 (256/384/512)
- 색상 변환기 (HEX/RGB/HSL)
- UUID 생성기
- 정규식 테스터 (하이라이트)
- QR 코드 생성 (PNG 다운로드)
- 이미지 → Base64 변환 (FileReader)
- PDF → 이미지 변환 (pdfjs-dist)
- 이미지 → PDF 생성 (pdf-lib)
- PDF 합치기/분할/페이지 추출 (pdf-lib)
- PDF 텍스트 추출 (pdfjs-dist)
- PDF 베스트에포트 압축(재저장)
- PDF 6분할(2x3) 배치

### 빌드
```bash
cd /Users/kimdonghyeon/2025/개발/유틸리티/utilkit/frontend
# GitHub Pages 배포용 베이스 경로 지정 (리포지토리명이 utilkit이라면 /utilkit/)
VITE_BASE_PATH=/utilkit/ npm run build
```

### 주의
- 모든 변환/생성은 브라우저 메모리에서 처리됩니다. 파일 업로드는 서버로 전송되지 않습니다.

### GitHub Pages 배포
1) 리포지토리 Settings → Pages에서 **Build and deployment**를 GitHub Actions로 설정  
2) 브랜치 `main` 에 푸시하면 `.github/workflows/gh-pages.yml`가 자동으로 빌드/배포  
   - Vite `base`는 `VITE_BASE_PATH` 환경변수를 사용 (기본: `/<repo>/`)  
   - 로컬에서 베이스 경로를 바꿔 빌드하려면 `VITE_BASE_PATH=/<repo>/ npm run build`

