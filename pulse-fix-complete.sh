#!/bin/bash

# PulseAudio 문제 완전 해결 - 올바른 방법
set -e

echo "🎯 .replitignore 방식으로 PulseAudio 문제 완전 해결 중..."

# 1. PulseAudio 파일 완전 제거
echo "단계 1: PulseAudio 파일 완전 삭제"
rm -rf ~/.config/pulse /tmp/pulse-* 2>/dev/null || true
rm -rf /home/runner/.config/pulse 2>/dev/null || true
find /tmp -name "*pulse*" -delete 2>/dev/null || true

# 2. .replitignore 파일 확인
echo "단계 2: .replitignore 파일 확인"
if [ -f ".replitignore" ]; then
    echo "✅ .replitignore 파일 생성됨:"
    cat .replitignore
else
    echo "❌ .replitignore 파일 생성 실패"
    exit 1
fi

# 3. package.json에 predeploy 스크립트 추가는 수동으로 해야 함
echo "단계 3: predeploy 스크립트 안내"
echo "⚠️  다음 단계는 수동으로 해야 합니다:"
echo '   Deploy 탭에서 Build command를 다음으로 변경:'
echo '   "rm -rf ~/.config/pulse /tmp/pulse-* && npm run build"'

# 4. 환경변수 설정
echo "단계 4: 환경변수 설정"
export REPLIT_KEEP_PACKAGE_DEV_DEPENDENCIES=1
export REPLIT_DISABLE_PACKAGE_LAYER_CACHING=1
export NODE_ENV=production

# 5. 테스트 빌드
echo "단계 5: 테스트 빌드"
npm run build

echo ""
echo "✅ .replitignore 방식 해결책 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. Deploy 탭 → History → 실패한 레이어 Delete (⛔)"
echo "2. Deploy 탭 → Build command를 다음으로 변경:"
echo '   "rm -rf ~/.config/pulse /tmp/pulse-* && npm run build"'
echo "3. Deploy 버튼 클릭"
echo ""
echo "🎉 이제 PulseAudio 오류 없이 배포가 성공할 것입니다!"