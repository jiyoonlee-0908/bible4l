# 음성 파일 업로드 가이드

## 맥북에서 음성 파일 생성하기

맥북에서 다음 명령어들을 터미널에서 실행하여 고품질 음성 파일을 생성하세요:

### 1. 한국어 음성 파일 (Yuna)
```bash
say -v "Yuna" -r 180 -o "ko-genesis-1-1.aiff" "태초에 하나님이 천지를 창조하시니라"
say -v "Yuna" -r 180 -o "ko-john-3-16.aiff" "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라"
say -v "Yuna" -r 180 -o "ko-matthew-16-24.aiff" "이에 예수께서 제자들에게 이르시되 누구든지 나를 따라오려거든 자기를 부인하고 자기 십자가를 지고 나를 따를 것이니라"
```

### 2. 영어 음성 파일 (Samantha)
```bash
say -v "Samantha" -r 180 -o "en-genesis-1-1.aiff" "In the beginning God created the heavens and the earth."
say -v "Samantha" -r 180 -o "en-john-3-16.aiff" "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
say -v "Samantha" -r 180 -o "en-matthew-16-24.aiff" "Then Jesus said to his disciples, Whoever wants to be my disciple must deny themselves and take up their cross and follow me."
```

### 3. 중국어 음성 파일 (Tingting)
```bash
say -v "Tingting" -r 180 -o "zh-genesis-1-1.aiff" "起初神创造天地"
say -v "Tingting" -r 180 -o "zh-john-3-16.aiff" "神爱世人，甚至将他的独生子赐给他们，叫一切信他的，不至灭亡，反得永生"
say -v "Tingting" -r 180 -o "zh-matthew-16-24.aiff" "于是耶稣对门徒说，若有人要跟从我，就当舍己，背起他的十字架，来跟从我"
```

### 4. 일본어 음성 파일 (Kyoko)
```bash
say -v "Kyoko" -r 180 -o "ja-genesis-1-1.aiff" "初めに、神が天と地を創造した"
say -v "Kyoko" -r 180 -o "ja-john-3-16.aiff" "神は、実に、そのひとり子をお与えになったほどに、世を愛された。それは御子を信じる者が、ひとりとして滅びることなく、永遠のいのちを持つためである"
say -v "Kyoko" -r 180 -o "ja-matthew-16-24.aiff" "それから、イエスは弟子たちに言われた。だれでもわたしについて来たいと思うなら、自分を捨て、自分の十字架を負い、そしてわたしについて来なさい"
```

### 5. AIFF를 MP3로 변환
```bash
# ffmpeg가 설치되어 있어야 합니다
for file in *.aiff; do
    ffmpeg -i "$file" -acodec mp3 -ab 128k "${file%.aiff}.mp3"
    rm "$file"
done
```

## 파일 업로드 방법

1. 생성된 MP3 파일들을 `client/public/audio/voices/` 폴더에 업로드
2. 파일명이 정확해야 합니다:
   - `ko-genesis-1-1.mp3`
   - `ko-john-3-16.mp3`
   - `ko-matthew-16-24.mp3`
   - `en-genesis-1-1.mp3`
   - `en-john-3-16.mp3`
   - `en-matthew-16-24.mp3`
   - `zh-genesis-1-1.mp3`
   - `zh-john-3-16.mp3`
   - `zh-matthew-16-24.mp3`
   - `ja-genesis-1-1.mp3`
   - `ja-john-3-16.mp3`
   - `ja-matthew-16-24.mp3`

## 현재 상태

- ✅ 미리 녹음된 음성 파일 재생 시스템 구축 완료
- ✅ 실시간 TTS 폴백 시스템 구축 완료
- ✅ 교차 모드에서 외국어 → 한국어 순서 재생 구현
- ✅ 재생/일시정지/속도 조절 기능 완성
- ⏳ 실제 음성 파일 업로드 필요

음성 파일 업로드가 완료되면 모든 기기에서 동일한 고품질 맥북 음성으로 성경을 들을 수 있습니다!