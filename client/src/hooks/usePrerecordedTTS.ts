import { useState, useRef, useCallback } from 'react';
import { Language } from '@shared/schema';

interface PrerecordedTTSState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
  currentFile: string | null;
}

interface PrerecordedTTSOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  rate?: number;
  volume?: number;
}

// 미리 녹음된 음성 파일 매핑
const prerecordedFiles: Record<string, string> = {
  // 한국어
  'ko-genesis-1-1': '/audio/voices/ko-genesis-1-1.mp3',
  'ko-john-3-16': '/audio/voices/ko-john-3-16.mp3',
  'ko-matthew-16-24': '/audio/voices/ko-matthew-16-24.mp3',
  
  // 영어
  'en-genesis-1-1': '/audio/voices/en-genesis-1-1.mp3',
  'en-john-3-16': '/audio/voices/en-john-3-16.mp3',
  'en-matthew-16-24': '/audio/voices/en-matthew-16-24.mp3',
  
  // 중국어
  'zh-genesis-1-1': '/audio/voices/zh-genesis-1-1.mp3',
  'zh-john-3-16': '/audio/voices/zh-john-3-16.mp3',
  'zh-matthew-16-24': '/audio/voices/zh-matthew-16-24.mp3',
  
  // 일본어
  'ja-genesis-1-1': '/audio/voices/ja-genesis-1-1.mp3',
  'ja-john-3-16': '/audio/voices/ja-john-3-16.mp3',
  'ja-matthew-16-24': '/audio/voices/ja-matthew-16-24.mp3'
};

// 텍스트에서 음성 파일 키 찾기
const findAudioFileKey = (text: string, language: Language): string | null => {
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // 주요 성경 구절 패턴 매칭
  const patterns: Record<Language, Record<string, string>> = {
    ko: {
      '태초에 하나님이 천지를 창조하시니라': 'ko-genesis-1-1',
      '하나님이 세상을 이처럼 사랑하사': 'ko-john-3-16',
      '나를 따라오려거든 자기를 부인하고': 'ko-matthew-16-24'
    },
    en: {
      'in the beginning god created': 'en-genesis-1-1',
      'for god so loved the world': 'en-john-3-16',
      'whoever wants to be my disciple': 'en-matthew-16-24'
    },
    zh: {
      '起初神创造天地': 'zh-genesis-1-1',
      '神爱世人甚至将他的独生子': 'zh-john-3-16',
      '若有人要跟从我就当舍己': 'zh-matthew-16-24'
    },
    ja: {
      '初めに神が天と地を創造した': 'ja-genesis-1-1',
      '神は実にそのひとり子をお与えになった': 'ja-john-3-16',
      'だれでもわたしについて来たい': 'ja-matthew-16-24'
    }
  };

  const languagePatterns = patterns[language] || {};
  
  for (const [pattern, key] of Object.entries(languagePatterns)) {
    if (normalizedText.includes(pattern.toLowerCase().replace(/[^\w\s]/g, ''))) {
      return key;
    }
  }
  
  return null;
};

export function usePrerecordedTTS() {
  const [state, setState] = useState<PrerecordedTTSState>({
    isLoading: false,
    isPlaying: false,
    error: null,
    currentFile: null
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPrerecorded = useCallback(async (
    text: string,
    language: Language,
    options: PrerecordedTTSOptions = {}
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // 기존 재생 중단
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // 해당 텍스트의 미리 녹음된 파일 찾기
      const fileKey = findAudioFileKey(text, language);
      const audioUrl = fileKey ? prerecordedFiles[fileKey] : null;

      if (!audioUrl) {
        throw new Error(`Prerecorded audio not found for: ${text.substring(0, 50)}...`);
      }

      setState(prev => ({ ...prev, currentFile: audioUrl }));

      // 미리 녹음된 음성 파일 재생
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.volume = options.volume || 0.8;
      audio.playbackRate = options.rate || 1.0;

      audio.onloadstart = () => {
        setState(prev => ({ ...prev, isLoading: true }));
      };

      audio.oncanplay = () => {
        setState(prev => ({ ...prev, isLoading: false, isPlaying: true }));
        options.onStart?.();
      };

      audio.onended = () => {
        setState(prev => ({ ...prev, isPlaying: false, currentFile: null }));
        audioRef.current = null;
        options.onEnd?.();
      };

      audio.onerror = (event) => {
        const errorMsg = `Audio playback error: ${audioUrl}`;
        setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: errorMsg }));
        options.onError?.(errorMsg);
      };

      await audio.play();
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: errorMsg }));
      options.onError?.(errorMsg);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false, currentFile: null }));
  }, []);

  const hasPrerecordedAudio = useCallback((text: string, language: Language): boolean => {
    const fileKey = findAudioFileKey(text, language);
    return fileKey !== null && prerecordedFiles[fileKey] !== undefined;
  }, []);

  return {
    ...state,
    play: playPrerecorded,
    stop,
    hasPrerecordedAudio
  };
}