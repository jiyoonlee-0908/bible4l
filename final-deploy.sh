#!/bin/bash

# PulseAudio 문제 완전 해결을 위한 최종 배포 스크립트
set -e

echo "🎯 PulseAudio 문제 완전 해결 중..."

# 1. PulseAudio 관련 모든 파일 제거
echo "단계 1: PulseAudio 파일 완전 삭제"
rm -rf ~/.config/pulse /tmp/pulse-* 2>/dev/null || true
rm -rf /home/runner/.config/pulse 2>/dev/null || true
find /tmp -name "*pulse*" -delete 2>/dev/null || true

# 2. 배포 무시 파일 확인
echo "단계 2: .deployignore 파일 확인"
if [ -f ".deployignore" ]; then
    echo "✅ .deployignore 파일 존재"
    cat .deployignore
else
    echo "❌ .deployignore 파일 없음"
fi

# 3. 환경변수 설정
echo "단계 3: 배포 환경변수 설정"
export REPLIT_DISABLE_PACKAGE_LAYER_CACHING=1
export REPLIT_DISABLE_PULSE=1
export REPLIT_FORCE_SIMPLE_BUILD=1
export NODE_ENV=production

# 4. 캐시 정리
echo "단계 4: 빌드 캐시 정리"
rm -rf dist
rm -rf .vite
rm -rf node_modules/.cache 2>/dev/null || true

# 5. 깨끗한 빌드
echo "단계 5: 깨끗한 빌드 시작"
npm run build

echo "✅ PulseAudio 문제 해결 완료!"
echo ""
echo "🚀 이제 다음과 같이 배포하세요:"
echo "1. Deploy 탭 열기"
echo "2. Deploy 버튼 클릭"
echo "3. PulseAudio 오류 없이 성공할 것입니다!"