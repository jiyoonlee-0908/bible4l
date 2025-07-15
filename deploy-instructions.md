# 배포 지침 - History 없는 경우

## Deploy 설정 변경

Deploy 탭에서 다음과 같이 설정하세요:

### Build Command 변경
기존: `npm run build`
변경: `rm -rf ~/.config/pulse /tmp/pulse-* && npm run build`

### 설정 위치
Deploy 탭 → Settings → Build Command 입력란

### 배포 순서
1. Deploy 탭 열기
2. Settings에서 Build Command 변경
3. Deploy 버튼 클릭

## 백업 방법

만약 Build Command 변경이 안 된다면:

```bash
# 터미널에서 직접 실행
rm -rf ~/.config/pulse /tmp/pulse-* && npm run build
```

그 후 Deploy 버튼 클릭

## 확인사항

✅ .replitignore 파일 생성됨
✅ PulseAudio 파일 모두 삭제됨  
✅ 빌드 성공 확인됨
✅ 환경변수 설정됨

이제 배포가 성공할 것입니다.