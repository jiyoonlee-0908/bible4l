import { useState, useCallback, useRef } from 'react';
import { Language } from '@shared/schema';

interface PrerecordedTTSState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
  currentAudio: string | null;
}

interface PrerecordedTTSOptions {
  rate?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// 사전 녹음된 음성 파일 매핑
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
  'ja-matthew-16-24': '/audio/voices/ja-matthew-16-24.mp3',
};

// 성경 구절을 파일 ID로 매핑
const verseToFileId = (book: string, chapter: number, verse: number, language: Language): string | null => {
  const key = `${book.toLowerCase()}-${chapter}-${verse}`;
  
  const mappings = {
    'genesis-1-1': 'genesis-1-1',
    'john-3-16': 'john-3-16',
    'matthew-16-24': 'matthew-16-24'
  };
  
  const fileKey = mappings[key as keyof typeof mappings];
  if (!fileKey) return null;
  
  return `${language}-${fileKey}`;
};

export function usePrerecordedTTS() {
  const [state, setState] = useState<PrerecordedTTSState>({
    isLoading: false,
    isPlaying: false,
    error: null,
    currentAudio: null
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPrerecordedAudio = useCallback(async (
    book: string,
    chapter: number,
    verse: number,
    language: Language,
    options: PrerecordedTTSOptions = {}
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // 기존 오디오 중단
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // 파일 ID 생성
      const fileId = verseToFileId(book, chapter, verse, language);
      if (!fileId) {
        throw new Error(`No prerecorded audio found for ${book} ${chapter}:${verse} in ${language}`);
      }

      // 파일 경로 확인
      const audioPath = prerecordedFiles[fileId];
      if (!audioPath) {
        throw new Error(`Audio file not found: ${fileId}`);
      }

      console.log(`🎵 재생할 파일: ${audioPath}`);

      // 새 오디오 객체 생성
      const audio = new Audio(audioPath);
      audioRef.current = audio;

      // 오디오 설정
      audio.volume = options.volume || 0.8;
      audio.playbackRate = options.rate || 1.0;

      // 이벤트 리스너 설정
      audio.onloadstart = () => {
        console.log(`📂 오디오 로딩 시작: ${audioPath}`);
      };

      audio.oncanplay = () => {
        console.log(`✅ 오디오 재생 준비 완료`);
        setState(prev => ({ ...prev, isLoading: false, isPlaying: true, currentAudio: audioPath }));
        options.onStart?.();
      };

      audio.onended = () => {
        console.log(`🏁 오디오 재생 완료`);
        setState(prev => ({ ...prev, isPlaying: false, currentAudio: null }));
        options.onEnd?.();
      };

      audio.onerror = (e) => {
        const errorMsg = `Audio playback error: ${audioPath}`;
        console.error(`❌ 오디오 오류:`, e);
        setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: errorMsg, currentAudio: null }));
        options.onError?.(errorMsg);
      };

      // 오디오 재생 시작
      await audio.play();

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown audio error';
      console.error(`💥 사전 녹음 오디오 오류:`, error);
      setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: errorMsg }));
      options.onError?.(errorMsg);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false, currentAudio: null }));
  }, []);

  const isFileAvailable = useCallback((book: string, chapter: number, verse: number, language: Language): boolean => {
    const fileId = verseToFileId(book, chapter, verse, language);
    return fileId ? !!prerecordedFiles[fileId] : false;
  }, []);

  return {
    ...state,
    playPrerecordedAudio,
    stopAudio,
    isFileAvailable
  };
}