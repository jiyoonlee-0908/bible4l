# PWABuilder로 플레이스토어 배포하기 (가장 쉬운 방법)

## Replit에서는 Android Studio를 사용할 수 없으므로, PWABuilder 웹 도구를 사용합니다.

### 1단계: 앱 배포 (Replit Deployments 사용)

먼저 앱을 공개 URL로 배포해야 합니다:

1. **Replit에서 Deploy 버튼 클릭**
2. **Build Command**: `rm -rf ~/.config/pulse /tmp/pulse-* && npm run build`
3. **Deploy 버튼 클릭**
4. 배포된 URL 기록 (예: `https://your-app.replit.app`)

### 2단계: PWABuilder 사용

1. **PWABuilder 웹사이트 접속**: https://www.pwabuilder.com/
2. **배포된 URL 입력**: `https://your-app.replit.app`
3. **"Start" 버튼 클릭**
4. PWA 요구사항 자동 검증
5. **"Package For Stores" 클릭**
6. **"Android" 탭 선택**
7. **"Generate Package" 클릭**

### 3단계: AAB 파일 다운로드

PWABuilder에서 자동으로 생성해주는 파일들:
- `app-release.aab` (플레이스토어 업로드용)
- `signing-key.keystore` (서명 키 - 반드시 백업!)
- `assetlinks.json` (웹사이트 연결용)

### 4단계: Google Play Console 업로드

1. **Play Console 접속**: https://play.google.com/console
2. **새 앱 만들기**
3. **앱 정보**:
   - 이름: `다개국어 성경듣기`
   - 패키지명: `com.bibleaudio.multilang`
   - 언어: 한국어
4. **AAB 파일 업로드** (PWABuilder에서 다운로드한 파일)

### 5단계: 앱 설명 작성

```
제목: 다개국어 성경듣기

간단한 설명:
한국어, 영어, 중국어, 일본어로 성경을 듣고 읽을 수 있는 무료 음성 성경 앱

자세한 설명:
다개국어 성경듣기는 4개 언어로 성경을 듣고 읽을 수 있는 무료 앱입니다.

주요 기능:
🎧 고품질 음성 읽기 (TTS)
📖 4개 언어 성경 텍스트 
⭐ 즐겨찾기 구절 저장
🎵 재생 속도 조절
📱 오프라인 사용 가능
🏆 읽기 계획 및 배지 시스템

지원 언어:
• 한국어 (개역개정)
• English (KJV) 
• 中文 (Chinese Union Version)
• 日本語 (Japanese)

설치 후 첫 실행시 고품질 음성을 위한 TTS 음성팩 다운로드를 안내합니다.
설정 > 일반 > 언어팩에서 한국어, 영어(미국), 일본어, 중국어 음성팩을 다운로드하시면 더 자연스러운 음성을 들을 수 있습니다.
```

### 6단계: TTS 권한 설명

Play Console의 "앱 콘텐츠" 섹션에서:

```
권한 사용 이유:
- 인터넷 접속: 성경 텍스트 다운로드
- 저장소 접근: 오프라인 사용을 위한 데이터 저장  
- TTS 권한: 텍스트 음성 변환 기능

첫 실행시 자동으로 TTS 음성팩 설치를 안내하며, 사용자가 동의하면 설정 앱의 언어팩 다운로드 페이지로 바로 이동합니다.
```

### 🎯 TTS 자동 설정 작동 방식

앱 설치 후:
1. **첫 실행시** → TTS 음성 데이터 자동 확인  
2. **음성팩 부족시** → "음성팩을 설치하시겠습니까?" 대화상자
3. **"확인" 클릭** → 설정 > 일반 > 언어팩으로 자동 이동
4. **다운로드 안내**: 한국어, 영어(미국), 일본어, 중국어(중국 본토)

### 다음 단계

1. ✅ 현재: 앱 코드 완성
2. 🔄 **지금 할 일**: Replit Deploy 버튼으로 앱 배포
3. 📱 **그 다음**: PWABuilder에서 AAB 생성
4. 🏪 **마지막**: Play Console에 업로드

훨씬 간단하고 확실한 방법입니다!