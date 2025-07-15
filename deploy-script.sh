#!/bin/bash

# 배포 전 완전 초기화 스크립트
set -e

echo "🔄 배포를 위한 완전 정리 중..."

# 모든 캐시와 임시 파일 삭제
rm -rf node_modules/.cache
rm -rf .vite
rm -rf dist
rm -rf client/dist
rm -rf /tmp/pulse-* 2>/dev/null || true
rm -rf ~/.npm/_cacache 2>/dev/null || true

# 환경변수 설정
export REPLIT_DISABLE_PACKAGE_LAYER_CACHING=1
export REPLIT_PRESERVE_DEVDEPS=1
export REPLIT_SKIP_LAYER_CACHE=1
export NODE_ENV=production

echo "✅ 정리 완료"
echo "🏗️ 깨끗한 빌드 시작..."

# 빌드 실행
npm run build

echo "🎯 배포 준비 완료!"
echo "이제 Replit Deploy 버튼을 클릭하세요."