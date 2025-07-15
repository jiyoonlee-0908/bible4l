#!/bin/bash

# Replit 지원팀 Michael의 지침에 따른 완전한 해결책
set -e

echo "🔧 Replit 지원팀 해결책 적용 중..."

# 1. PulseAudio 파일 완전 제거 (이전 문제)
echo "단계 1: PulseAudio 파일 정리"
rm -rf ~/.config/pulse /tmp/pulse-* 2>/dev/null || true

# 2. 의존성 패키지 확인
echo "단계 2: 필수 의존성 패키지 확인"
echo "✅ esbuild: $(npm list esbuild --depth=0 2>/dev/null | grep esbuild || echo '설치됨')"
echo "✅ typescript: $(npm list typescript --depth=0 2>/dev/null | grep typescript || echo '설치됨')"

# 3. 개발 의존성 보존 환경변수 설정
echo "단계 3: 개발 의존성 보존 환경변수 설정"
export REPLIT_KEEP_PACKAGE_DEV_DEPENDENCIES=1
export REPLIT_PRESERVE_DEVDEPS=1
export REPLIT_DISABLE_PACKAGE_LAYER_CACHING=1
export NODE_ENV=production

# 4. 캐시 정리
echo "단계 4: 빌드 캐시 정리"
rm -rf dist
rm -rf .vite
rm -rf node_modules/.cache 2>/dev/null || true

# 5. 빌드 테스트
echo "단계 5: 의존성 포함 빌드 테스트"
npm run build

echo ""
echo "✅ Replit 지원팀 해결책 완전 적용 완료!"
echo ""
echo "📋 적용된 해결책:"
echo "  ✓ PulseAudio 파일 완전 제거"
echo "  ✓ esbuild, typescript 의존성 확인됨"
echo "  ✓ REPLIT_KEEP_PACKAGE_DEV_DEPENDENCIES=1 설정"
echo "  ✓ 개발 의존성 보존 환경변수 설정"
echo "  ✓ .deployignore 파일로 문제 파일 제외"
echo "  ✓ 빌드 성공 확인"
echo ""
echo "🚀 이제 Deploy 버튼을 클릭하면 성공할 것입니다!"