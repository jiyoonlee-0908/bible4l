import { useState, useRef, useCallback } from 'react';
import { Language } from '@shared/schema';
import { embeddedVoices, defaultVoicesByLanguage, macVoiceSettings } from '@/audio/voices';

interface EmbeddedTTSState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
  currentVoiceId: string | null;
}

interface EmbeddedTTSOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  rate?: number;
  volume?: number;
}

export function useEmbeddedTTS() {
  const [state, setState] = useState<EmbeddedTTSState>({
    isLoading: false,
    isPlaying: false,
    error: null,
    currentVoiceId: null
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 내장 음성으로 텍스트 음성 변환
  const speakWithEmbeddedVoice = useCallback(async (
    text: string, 
    language: Language, 
    options: EmbeddedTTSOptions = {}
  ) => {
    try {
      console.log(`🔧 TTS 시작: ${language} - "${text.substring(0, 50)}..."`);
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // 기존 재생 중단
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel();
        synthesisRef.current = null;
      }

      // Web Speech API 지원 확인
      if (!('speechSynthesis' in window)) {
        throw new Error('Web Speech API not supported in this browser');
      }

      // 음성 목록 확인
      let voices = speechSynthesis.getVoices();
      console.log(`🎤 사용 가능한 음성 개수: ${voices.length}`);
      
      // 음성 목록이 비어있으면 잠시 대기 후 재시도
      if (voices.length === 0) {
        await new Promise(resolve => {
          speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
            console.log(`🔄 음성 목록 재로드: ${voices.length}개`);
            resolve(void 0);
          };
        });
      }

      const voiceId = defaultVoicesByLanguage[language];
      const voiceSettings = macVoiceSettings[voiceId];
      
      if (!voiceSettings) {
        throw new Error(`Voice settings not found for ${language}`);
      }

      setState(prev => ({ ...prev, currentVoiceId: voiceId }));

      // 언어별 음성 찾기
      const languageMapping = {
        ko: ['ko-KR', 'ko', 'yuna'],
        en: ['en-US', 'en-GB', 'en', 'samantha', 'karen'],
        zh: ['zh-CN', 'zh-TW', 'zh', 'tingting'],
        ja: ['ja-JP', 'ja', 'kyoko']
      };

      const searchTerms = languageMapping[language] || ['en-US'];
      
      let selectedVoice = null;
      for (const term of searchTerms) {
        selectedVoice = voices.find(v => 
          v.lang.toLowerCase().includes(term.toLowerCase()) ||
          v.name.toLowerCase().includes(term.toLowerCase()) ||
          v.voiceURI.toLowerCase().includes(term.toLowerCase())
        );
        if (selectedVoice) break;
      }

      console.log(`🎯 선택된 음성: ${selectedVoice ? selectedVoice.name : '기본 음성'}`);

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = options.rate || 0.9;
      utterance.volume = options.volume || 0.8;
      utterance.pitch = 1.0;
      utterance.lang = language === 'zh' ? 'zh-CN' : `${language}-${language.toUpperCase()}`;

      utterance.onstart = () => {
        console.log(`▶️ TTS 재생 시작`);
        setState(prev => ({ ...prev, isLoading: false, isPlaying: true }));
        options.onStart?.();
      };

      utterance.onend = () => {
        console.log(`✅ TTS 재생 완료`);
        setState(prev => ({ ...prev, isPlaying: false, currentVoiceId: null }));
        options.onEnd?.();
      };

      utterance.onerror = (event) => {
        const errorMsg = `TTS Error: ${event.error}`;
        console.error(`❌ TTS 오류:`, event);
        setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: errorMsg }));
        options.onError?.(errorMsg);
      };

      synthesisRef.current = utterance;
      
      // TTS 실행
      console.log(`🚀 TTS 실행 중...`);
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`💥 TTS 예외:`, error);
      setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: errorMsg }));
      options.onError?.(errorMsg);
    }
  }, []);

  // 재생 중단
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (synthesisRef.current) {
      speechSynthesis.cancel();
      synthesisRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false, currentVoiceId: null }));
  }, []);

  // 재생/일시정지 토글
  const toggle = useCallback(() => {
    if (state.isPlaying) {
      stop();
    }
    // 재시작은 speakWithEmbeddedVoice를 다시 호출해야 함
  }, [state.isPlaying, stop]);

  return {
    ...state,
    speak: speakWithEmbeddedVoice,
    stop,
    toggle,
    availableVoices: embeddedVoices,
    getVoiceForLanguage: (language: Language) => {
      const voiceId = defaultVoicesByLanguage[language];
      return embeddedVoices.find(v => v.id === voiceId);
    }
  };
}