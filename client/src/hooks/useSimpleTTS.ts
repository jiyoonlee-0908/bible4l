import { useState, useCallback } from 'react';

interface SimpleAudioState {
  isPlaying: boolean;
  speed: number;
}

export function useSimpleTTS() {
  const [audioState, setAudioState] = useState<SimpleAudioState>({
    isPlaying: false,
    speed: 1.0,
  });

  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang: string = 'ko-KR') => {
    console.log('🎤 Simple TTS - Starting speech:', text.substring(0, 50) + '...');
    
    // 브라우저 TTS 지원 확인
    if (!('speechSynthesis' in window)) {
      console.error('❌ Speech synthesis not supported');
      return;
    }

    // 이전 음성 완전 정지
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    // 새 utterance 생성
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = audioState.speed;
    utterance.volume = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = lang;

    // 이벤트 핸들러
    utterance.onstart = () => {
      console.log('✅ Simple TTS - Started');
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    };

    utterance.onend = () => {
      console.log('✅ Simple TTS - Ended');
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    utterance.onerror = (event) => {
      console.error('❌ Simple TTS - Error:', event.error);
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    // 음성 재생 시작
    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  }, [audioState.speed]);

  const stop = useCallback(() => {
    console.log('🛑 Simple TTS - Stopping');
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setAudioState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const toggle = useCallback(() => {
    if (audioState.isPlaying) {
      stop();
    }
  }, [audioState.isPlaying, stop]);

  const setSpeed = useCallback((speed: number) => {
    setAudioState(prev => ({ ...prev, speed }));
  }, []);

  return {
    audioState,
    speak,
    stop,
    toggle,
    setSpeed
  };
}