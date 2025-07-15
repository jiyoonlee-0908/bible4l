#!/bin/bash

# 최소한의 배포 스크립트 - Pulse 우회
set -e

echo "🔧 최소한의 배포 모드로 전환 중..."

# 모든 Pulse 관련 파일 제거
rm -rf /tmp/pulse-* 2>/dev/null || true
rm -rf ~/.config/pulse 2>/dev/null || true

# 최소한의 환경변수만 설정
export REPLIT_DISABLE_PACKAGE_LAYER_CACHING=1
export REPLIT_DISABLE_PULSE=1
export REPLIT_FORCE_SIMPLE_BUILD=1
export NODE_ENV=production

# 캐시 완전 정리
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .vite 2>/dev/null || true
rm -rf dist

echo "✅ Pulse 우회 설정 완료"
echo "🏗️ 단순 빌드 시작..."

# 단순 빌드
npm run build

echo "🎯 최소 배포 준비 완료!"
echo "이제 Deploy 버튼을 클릭하세요."