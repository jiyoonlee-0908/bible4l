# 플레이스토어 배포 빠른 명령어 모음

## 현재 상태: 빌드 완료 ✅

### 1. AAB 파일 생성 (2가지 방법)

#### 방법 A: Android Studio 사용 (GUI, 쉬움)
```bash
# Android Studio 열기
npx cap open android
```
Android Studio에서:
- Build > Generate Signed Bundle/APK 
- Android App Bundle 선택
- 새 키스토어 생성
- release 빌드 선택

#### 방법 B: 명령어 사용 (빠름)
```bash
# 1. 키스토어 생성 (최초 1회만)
keytool -genkey -v -keystore ~/bible-audio-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias bible-audio

# 2. 서명된 AAB 생성
cd android
./gradlew bundleRelease

# 3. 생성된 파일 위치
ls -la app/build/outputs/bundle/release/
```

### 2. SHA256 지문 확인
```bash
keytool -list -v -keystore ~/bible-audio-keystore.jks -alias bible-audio
```

### 3. assetlinks.json 생성
```bash
cat > client/public/.well-known/assetlinks.json << 'EOF'
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.bibleaudio.multilang",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
  }
}]
EOF
```

## TTS 자동 설정 확인

앱 설치 후 자동으로:
1. TTS 음성 데이터 확인
2. 없으면 설정 > 일반 > 언어팩으로 안내
3. 한국어, 영어(미국), 일본어, 중국어 다운로드 안내

## 플레이스토어 필수 정보

**앱 이름**: 다개국어 성경듣기
**패키지명**: com.bibleaudio.multilang  
**카테고리**: 교육
**등급**: 모든 연령

**권한 설명**:
- 인터넷: 성경 텍스트 다운로드
- 저장소: 음성 데이터 및 설정 저장  
- 오디오: TTS 음성 재생

## 다음 단계

1. ✅ 빌드 완료
2. 🔄 AAB 파일 생성 (위 명령어 사용)
3. 📱 Play Console에 업로드
4. 🎯 TTS 권한 자동 안내 테스트