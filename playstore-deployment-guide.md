# 플레이스토어 배포 완전 가이드 (처음 하는 분용)

## 준비사항 ✅
- [x] Google Play Console 개발자 계정 등록 완료
- [x] PWA 앱 완성
- [x] Capacitor Android 설정 완료

## 단계별 배포 과정

### 1단계: AAB 파일 생성

#### 방법 1: Android Studio 사용 (추천)
```bash
# Replit Shell에서 실행
npm run build
npx cap sync android
npx cap open android
```

그러면 Android Studio가 열립니다:
1. **Build > Generate Signed Bundle/APK** 클릭
2. **Android App Bundle** 선택 → Next
3. **Create new keystore** 선택:
   - Key store path: `~/keystore.jks`
   - Password: 기억할 비밀번호 입력
   - Alias: `bible-audio-key`
   - Password: 동일한 비밀번호
   - Validity: 25년 이상
   - Certificate 정보 입력 (이름, 국가 등)
4. **release** 버전 선택 → Finish
5. `app-release.aab` 파일이 생성됨

#### 방법 2: 명령어 사용
```bash
# Keystore 생성 (최초 1회만)
keytool -genkey -v -keystore ~/keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias bible-audio-key

# AAB 파일 생성
cd android
./gradlew bundleRelease
```

### 2단계: Digital Asset Links 설정

앱과 웹사이트 연결을 위해 필수:

1. **assetlinks.json 파일 생성**:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.bibleaudio.multilang",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

2. **웹사이트에 업로드**:
   - 파일 위치: `https://yourdomain.com/.well-known/assetlinks.json`
   - 반드시 HTTPS 필요

3. **SHA256 지문 확인**:
```bash
keytool -list -v -keystore ~/keystore.jks -alias bible-audio-key
```

### 3단계: Google Play Console 앱 등록

1. **Play Console 접속**: https://play.google.com/console
2. **앱 만들기** 클릭
3. 앱 정보 입력:
   - 앱 이름: `다개국어 성경듣기`
   - 기본 언어: 한국어
   - 앱 또는 게임: 앱
   - 무료 또는 유료: 무료

### 4단계: 앱 정보 작성

#### 앱 콘텐츠
- **앱 카테고리**: 교육
- **콘텐츠 등급**: 모든 연령
- **타겟 고객층 및 콘텐츠**: 일반 고객

#### 스토어 등록정보
```
제목: 다개국어 성경듣기
간단한 설명: 한국어, 영어, 중국어, 일본어로 성경을 듣고 읽을 수 있는 음성 성경 앱

자세한 설명:
다개국어 성경듣기는 4개 언어(한국어, 영어, 중국어, 일본어)로 성경을 듣고 읽을 수 있는 무료 앱입니다.

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

모든 기능이 무료로 제공되며 광고 없이 사용할 수 있습니다.
```

#### 그래픽 자료 (필수)
- **앱 아이콘**: 512x512 PNG (이미 있음: icon-512.png)
- **피처 그래픽**: 1024x500 PNG (이미 있음: feature-graphic.png)
- **스크린샷**: 최소 2개 (핸드폰 세로: 1080x1920 또는 비슷한 비율)

### 5단계: AAB 파일 업로드

1. **프로덕션** 섹션으로 이동
2. **새 버전 만들기** 클릭
3. **app-release.aab** 파일 업로드
4. **버전 이름**: 1.0.0
5. **출시 노트** 작성:
```
초기 버전 출시
- 4개 언어 성경 음성 읽기
- 오프라인 사용 가능
- 즐겨찾기 및 읽기 계획 지원
```

### 6단계: 앱 서명 설정

1. **앱 서명** 섹션에서
2. **Google Play 앱 서명 사용** 선택 (추천)
3. 업로드 키 인증서 업로드

### 7단계: TTS 권한 설명

**권한 설명서**에 다음 내용 추가:
```
인터넷 권한: 성경 텍스트 다운로드용
저장소 권한: 음성 데이터 및 사용자 설정 저장용
오디오 권한: 텍스트 음성 변환(TTS) 기능용

앱 설치 후 첫 실행시 다음 권한이 요청됩니다:
1. 인터넷 접속 (성경 텍스트 다운로드)
2. 저장소 접근 (오프라인 사용을 위한 데이터 저장)
3. TTS 음성팩 설치 안내 (고품질 음성을 위해)

TTS 음성팩 설치 방법:
설정 > 일반 > 언어 및 입력 > 텍스트 음성 변환 > Google 텍스트 음성 변환 > 음성 데이터 설치
- 한국어
- 영어(미국)  
- 일본어
- 중국어(중국 본토)
```

### 8단계: 검토 및 게시

1. **검토** 탭에서 모든 항목 확인
2. **프로덕션으로 출시** 클릭
3. Google 검토 대기 (보통 1-3일)

## 중요 파일 백업

**반드시 백업하세요:**
- `~/keystore.jks` (키스토어 파일)
- 키스토어 비밀번호
- SHA256 지문

키스토어를 잃으면 앱 업데이트가 불가능합니다!

## 자동 TTS 권한 설정

앱이 설치되면:
1. 첫 실행시 TTS 음성 데이터 확인
2. 음성팩이 없으면 자동으로 설정 페이지로 안내
3. 사용자가 "확인" 클릭시 → 설정 > 일반 > 언어팩으로 이동
4. 수동 설치 방법도 안내 제공

## 문제 해결

### 업로드 오류
- 서명 키 문제: 새 키스토어 생성
- AAB 오류: Gradle 빌드 다시 실행

### 권한 거부
- 앱 설명에 권한 사용 이유 명시
- 개인정보 처리방침 링크 추가

### 검토 거부
- 스크린샷과 설명 일치 확인
- 콘텐츠 가이드라인 준수

## 연락처
문제 발생시 Google Play Console 지원센터 문의