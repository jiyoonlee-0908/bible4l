// 맥북에서 고품질 음성 파일 생성 유틸리티
import { Language } from '@shared/schema';

export interface VoiceSettings {
  voice: string;
  rate: number;
  volume: number;
  pitch: number;
}

export const macVoiceSettings: Record<string, VoiceSettings> = {
  'ko': { voice: 'Yuna', rate: 0.9, volume: 0.8, pitch: 1.0 },
  'en': { voice: 'Samantha', rate: 0.9, volume: 0.8, pitch: 1.0 },
  'zh': { voice: 'Tingting', rate: 0.9, volume: 0.8, pitch: 1.0 },
  'ja': { voice: 'Kyoko', rate: 0.9, volume: 0.8, pitch: 1.0 }
};

export class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  async generateAudioFile(text: string, language: Language): Promise<Blob | null> {
    const settings = macVoiceSettings[language];
    if (!settings) {
      console.error(`Voice settings not found for language: ${language}`);
      return null;
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 음성 설정
      const voices = speechSynthesis.getVoices();
      const targetVoice = voices.find(v => 
        v.name.toLowerCase().includes(settings.voice.toLowerCase()) ||
        v.voiceURI.toLowerCase().includes(settings.voice.toLowerCase())
      );
      
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      
      utterance.rate = settings.rate;
      utterance.volume = settings.volume;
      utterance.pitch = settings.pitch;

      // 음성 재생 시작시 녹음 시작
      utterance.onstart = () => {
        console.log(`🎤 Recording started for ${language}: ${text.substring(0, 50)}...`);
      };

      // 음성 재생 완료시 녹음 완료
      utterance.onend = () => {
        console.log(`✅ Recording completed for ${language}`);
        // 실제 파일 생성은 브라우저 제한으로 불가능
        // 대신 음성 재생만 수행
        resolve(null);
      };

      utterance.onerror = (event) => {
        console.error(`❌ TTS Error for ${language}:`, event.error);
        resolve(null);
      };

      speechSynthesis.speak(utterance);
    });
  }

  // 브라우저에서 음성 파일 다운로드 (수동)
  async downloadAudioManually(text: string, language: Language, filename: string) {
    console.log(`
📝 수동 음성 파일 생성 가이드:

언어: ${language}
음성: ${macVoiceSettings[language]?.voice}
텍스트: ${text}
파일명: ${filename}

macOS에서 음성 파일 생성 방법:
1. 터미널 열기
2. 다음 명령어 실행:
   say -v "${macVoiceSettings[language]?.voice}" -r ${macVoiceSettings[language]?.rate * 200} -o "/Users/$(whoami)/Desktop/${filename}" "${text}"

3. 생성된 파일을 client/public/audio/ 폴더에 복사
    `);
  }
}

// 주요 성경 구절들을 위한 음성 파일 생성 큐
export const generateBibleAudioFiles = async () => {
  const generator = new AudioGenerator();
  
  const sampleTexts = {
    ko: [
      "태초에 하나님이 천지를 창조하시니라",
      "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니",
      "나를 따라오려거든 자기를 부인하고 자기 십자가를 지고 나를 따를 것이니라"
    ],
    en: [
      "In the beginning God created the heavens and the earth",
      "For God so loved the world that he gave his one and only Son",
      "Whoever wants to be my disciple must deny themselves and take up their cross and follow me"
    ],
    zh: [
      "起初神创造天地",
      "神爱世人，甚至将他的独生子赐给他们",
      "若有人要跟从我，就当舍己，背起他的十字架，来跟从我"
    ],
    ja: [
      "初めに、神が天と地を創造した",
      "神は、実に、そのひとり子をお与えになったほどに、世を愛された",
      "だれでもわたしについて来たいと思うなら、自分を捨て、自分の十字架を負い、そしてわたしについて来なさい"
    ]
  };

  console.log("🎵 성경 음성 파일 생성 가이드:");
  
  Object.entries(sampleTexts).forEach(([lang, texts]) => {
    texts.forEach((text, index) => {
      const filename = `${lang}-bible-${index + 1}.aiff`;
      generator.downloadAudioManually(text, lang as Language, filename);
    });
  });
};