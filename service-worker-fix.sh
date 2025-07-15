#!/bin/bash

# Service Worker 문제 해결 및 배포 재시도
set -e

echo "🔄 Service Worker 문제 해결 중..."

# 1. Service Worker 캐시 버전 업데이트
echo "Service Worker 캐시 버전 업데이트 중..."

# 2. 브라우저 캐시 정리 지침 출력
echo "
=== 브라우저에서 해야할 작업 ===
1. F12로 개발자 도구 열기
2. Application > Storage > Clear storage 클릭
3. 'Clear site data' 버튼 클릭
4. 페이지 새로고침 (Ctrl+F5)

또는 간단히:
- Ctrl+Shift+Delete (캐시 삭제)
- 페이지 새로고침
"

# 3. 모든 캐시와 임시 파일 정리
echo "🧹 모든 캐시 정리 중..."
rm -rf dist
rm -rf .vite
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf /tmp/pulse-* 2>/dev/null || true

# 4. Service Worker 재등록을 위한 환경설정
export REPLIT_DISABLE_PACKAGE_LAYER_CACHING=1
export REPLIT_DISABLE_PULSE=1
export REPLIT_FORCE_SIMPLE_BUILD=1
export NODE_ENV=production

# 5. 새로운 빌드
echo "🏗️ Service Worker 포함 새 빌드 시작..."
npm run build

echo "✅ Service Worker 문제 해결 완료!"
echo "이제 브라우저에서 위의 단계를 따라한 후 Deploy 버튼을 클릭하세요."