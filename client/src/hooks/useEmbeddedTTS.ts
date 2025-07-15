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

      const voiceId = defaultVoicesByLanguage[language];
      const voiceSettings = macVoiceSettings[voiceId];
      
      if (!voiceSettings) {
        throw new Error(`Voice settings not found for ${language}`);
      }

      setState(prev => ({ ...prev, currentVoiceId: voiceId }));

      // 맥북 시스템 음성으로 실시간 생성
      const voices = speechSynthesis.getVoices();
      const targetVoice = voices.find(v => 
        v.name.toLowerCase().includes(voiceSettings.voice.toLowerCase()) ||
        v.voiceURI.toLowerCase().includes(voiceSettings.voice.toLowerCase())
      );

      if (targetVoice) {
        // 고품질 맥북 음성 사용
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = targetVoice;
        utterance.rate = options.rate || voiceSettings.rate;
        utterance.volume = options.volume || voiceSettings.volume;
        utterance.pitch = voiceSettings.pitch;

        utterance.onstart = () => {
          setState(prev => ({ ...prev, isLoading: false, isPlaying: true }));
          options.onStart?.();
        };

        utterance.onend = () => {
          setState(prev => ({ ...prev, isPlaying: false, currentVoiceId: null }));
          options.onEnd?.();
        };

        utterance.onerror = (event) => {
          const errorMsg = `TTS Error: ${event.error}`;
          setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: errorMsg }));
          options.onError?.(errorMsg);
        };

        synthesisRef.current = utterance;
        speechSynthesis.speak(utterance);
      } else {
        // 폴백: 브라우저 기본 TTS
        const utterance = new SpeechSynthesisUtterance(text);
        const fallbackVoices = voices.filter(v => v.lang.startsWith(language === 'zh' ? 'zh' : language));
        
        if (fallbackVoices.length > 0) {
          utterance.voice = fallbackVoices[0];
        }
        
        utterance.rate = options.rate || 0.9;
        utterance.volume = options.volume || 0.8;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          setState(prev => ({ ...prev, isLoading: false, isPlaying: true }));
          options.onStart?.();
        };

        utterance.onend = () => {
          setState(prev => ({ ...prev, isPlaying: false, currentVoiceId: null }));
          options.onEnd?.();
        };

        utterance.onerror = (event) => {
          const errorMsg = `Fallback TTS Error: ${event.error}`;
          setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: errorMsg }));
          options.onError?.(errorMsg);
        };

        synthesisRef.current = utterance;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
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