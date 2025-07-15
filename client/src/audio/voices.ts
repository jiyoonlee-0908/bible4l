// 내장 음성 파일 시스템
// 맥북의 고품질 음성 파일들을 앱에 직접 내장

export interface EmbeddedVoice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  audioUrl: string;
  sampleText: string;
  quality: 'premium' | 'standard';
}

// 맥북 품질의 내장 음성들
export const embeddedVoices: EmbeddedVoice[] = [
  // 한국어 - Yuna 스타일
  {
    id: 'ko-yuna',
    name: 'Yuna (Korean)',
    language: 'ko',
    gender: 'female',
    audioUrl: '/audio/voices/ko-yuna-sample.mp3',
    sampleText: '안녕하세요. 성경 말씀을 들려드리겠습니다.',
    quality: 'premium'
  },
  
  // 영어 - Samantha 스타일
  {
    id: 'en-samantha',
    name: 'Samantha (US English)',
    language: 'en',
    gender: 'female',
    audioUrl: '/audio/voices/en-samantha-sample.mp3',
    sampleText: 'Hello. I will read the Bible verse for you.',
    quality: 'premium'
  },
  
  // 영어 - Karen 스타일 (호주 억양)
  {
    id: 'en-karen',
    name: 'Karen (Australian English)',
    language: 'en',
    gender: 'female',
    audioUrl: '/audio/voices/en-karen-sample.mp3',
    sampleText: 'Hello. I will read the Bible verse for you.',
    quality: 'premium'
  },
  
  // 중국어 - Tingting 스타일
  {
    id: 'zh-tingting',
    name: 'Tingting (Mandarin)',
    language: 'zh',
    gender: 'female',
    audioUrl: '/audio/voices/zh-tingting-sample.mp3',
    sampleText: '你好。我将为你朗读圣经经文。',
    quality: 'premium'
  },
  
  // 일본어 - Kyoko 스타일
  {
    id: 'ja-kyoko',
    name: 'Kyoko (Japanese)',
    language: 'ja',
    gender: 'female',
    audioUrl: '/audio/voices/ja-kyoko-sample.mp3',
    sampleText: 'こんにちは。聖書の言葉をお読みします。',
    quality: 'premium'
  }
];

// 언어별 기본 음성 선택
export const defaultVoicesByLanguage = {
  ko: 'ko-yuna',
  en: 'en-samantha',
  zh: 'zh-tingting',
  ja: 'ja-kyoko'
};

// 음성 파일 생성을 위한 TTS 설정 (개발용)
export const macVoiceSettings = {
  'ko-yuna': {
    voice: 'Yuna',
    rate: 0.9,
    volume: 0.8,
    pitch: 1.0
  },
  'en-samantha': {
    voice: 'Samantha',
    rate: 0.9,
    volume: 0.8,
    pitch: 1.0
  },
  'en-karen': {
    voice: 'Karen',
    rate: 0.9,
    volume: 0.8,
    pitch: 1.0
  },
  'zh-tingting': {
    voice: 'Tingting',
    rate: 0.9,
    volume: 0.8,
    pitch: 1.0
  },
  'ja-kyoko': {
    voice: 'Kyoko',
    rate: 0.9,
    volume: 0.8,
    pitch: 1.0
  }
};