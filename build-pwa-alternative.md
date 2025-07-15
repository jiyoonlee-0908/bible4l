# 플레이스토어 배포 - 대안 방법

Bubblewrap에서 URL 검증 오류가 발생하고 있습니다. 다음 대안들을 시도해보세요:

## 방법 1: PWABuilder 사용 (추천)

1. **웹 브라우저에서 PWABuilder 접속:**
   - https://www.pwabuilder.com/ 이동
   - "Start Building" 클릭

2. **URL 입력:**
   - https://bible4.replit.app 입력
   - "Start" 클릭

3. **매니페스트 검증:**
   - PWABuilder가 자동으로 PWA 검증 수행
   - Service Worker와 Manifest 확인

4. **Android 패키지 생성:**
   - "Publish" 탭 클릭
   - "Android" 옵션 선택
   - "Generate Package" 클릭

5. **설정 입력:**
   - Package name: `com.bibleaudio.korean`
   - App name: `다개국어 성경듣기`
   - App version: `1.0.0`

6. **AAB 다운로드:**
   - 생성된 `.aab` 파일 다운로드
   - 플레이스토어에 업로드

## 방법 2: Android Studio 사용

1. **Android Studio 설치** (PC/Mac에서)
2. **새 프로젝트 생성** - Empty Activity
3. **WebView 설정:**
   ```kotlin
   webView.loadUrl("https://bible4.replit.app")
   webView.settings.javaScriptEnabled = true
   webView.settings.domStorageEnabled = true
   ```

## 방법 3: Cordova 사용

Shell에서 다음 시도:

```bash
npm install -g cordova
cordova create bibleapp com.bibleaudio.korean "다개국어 성경듣기"
cd bibleapp
cordova platform add android
cordova build android --release
```

## 방법 4: Bubblewrap 문제 해결

현재 URL 문제 해결을 위해:

1. **Replit 도메인 확인:**
   - 브라우저에서 https://bible4.replit.app 접속 확인
   - 주소가 정확한지 확인

2. **다른 URL 시도:**
   ```bash
   bubblewrap init --url https://bible4.replit.app/
   bubblewrap init --url https://bible4.replit.app/index.html
   ```

## 추천 순서

1. **PWABuilder** (가장 쉬움) ⭐
2. **Cordova** (중간 난이도)
3. **Android Studio** (고급)
4. **Bubblewrap 재시도** (문제 해결 후)

PWABuilder를 먼저 시도해보시고, 문제가 있으면 알려주세요!