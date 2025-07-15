#!/bin/bash

# 맥북에서 고품질 성경 음성 파일 생성 스크립트
# 사용법: ./generate-voices.sh

echo "🎵 성경 음성 파일 생성 시작..."

# 음성 파일 저장 디렉토리 생성
mkdir -p client/public/audio/voices

# 한국어 음성 파일 생성 (Yuna)
echo "🇰🇷 한국어 음성 파일 생성 중..."
say -v "Yuna" -r 180 -o "client/public/audio/voices/ko-genesis-1-1.aiff" "태초에 하나님이 천지를 창조하시니라"
say -v "Yuna" -r 180 -o "client/public/audio/voices/ko-john-3-16.aiff" "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라"
say -v "Yuna" -r 180 -o "client/public/audio/voices/ko-matthew-16-24.aiff" "이에 예수께서 제자들에게 이르시되 누구든지 나를 따라오려거든 자기를 부인하고 자기 십자가를 지고 나를 따를 것이니라"

# 영어 음성 파일 생성 (Samantha)
echo "🇺🇸 영어 음성 파일 생성 중..."
say -v "Samantha" -r 180 -o "client/public/audio/voices/en-genesis-1-1.aiff" "In the beginning God created the heavens and the earth."
say -v "Samantha" -r 180 -o "client/public/audio/voices/en-john-3-16.aiff" "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
say -v "Samantha" -r 180 -o "client/public/audio/voices/en-matthew-16-24.aiff" "Then Jesus said to his disciples, Whoever wants to be my disciple must deny themselves and take up their cross and follow me."

# 중국어 음성 파일 생성 (Tingting)
echo "🇨🇳 중국어 음성 파일 생성 중..."
say -v "Tingting" -r 180 -o "client/public/audio/voices/zh-genesis-1-1.aiff" "起初神创造天地"
say -v "Tingting" -r 180 -o "client/public/audio/voices/zh-john-3-16.aiff" "神爱世人，甚至将他的独生子赐给他们，叫一切信他的，不至灭亡，反得永生"
say -v "Tingting" -r 180 -o "client/public/audio/voices/zh-matthew-16-24.aiff" "于是耶稣对门徒说，若有人要跟从我，就当舍己，背起他的十字架，来跟从我"

# 일본어 음성 파일 생성 (Kyoko)
echo "🇯🇵 일본어 음성 파일 생성 중..."
say -v "Kyoko" -r 180 -o "client/public/audio/voices/ja-genesis-1-1.aiff" "初めに、神が天と地を創造した"
say -v "Kyoko" -r 180 -o "client/public/audio/voices/ja-john-3-16.aiff" "神は、実に、そのひとり子をお与えになったほどに、世を愛された。それは御子を信じる者が、ひとりとして滅びることなく、永遠のいのちを持つためである"
say -v "Kyoko" -r 180 -o "client/public/audio/voices/ja-matthew-16-24.aiff" "それから、イエスは弟子たちに言われた。だれでもわたしについて来たいと思うなら、自分を捨て、自分の十字架を負い、そしてわたしについて来なさい"

# AIFF를 MP3로 변환 (더 작은 파일 크기)
echo "🔄 AIFF 파일을 MP3로 변환 중..."
for file in client/public/audio/voices/*.aiff; do
    if [ -f "$file" ]; then
        mp3_file="${file%.aiff}.mp3"
        ffmpeg -i "$file" -acodec mp3 -ab 128k "$mp3_file" 2>/dev/null
        rm "$file"  # 원본 AIFF 파일 삭제
        echo "✅ 변환 완료: $(basename "$mp3_file")"
    fi
done

echo "🎉 모든 음성 파일 생성 완료!"
echo "📁 파일 위치: client/public/audio/voices/"
ls -la client/public/audio/voices/