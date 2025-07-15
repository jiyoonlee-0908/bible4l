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
      alert('이 브라우저는 음성 합성을 지원하지 않습니다.');
      return;
    }

    // 사용자 제스처 확인
    const hasUserGesture = document.hasStoredActivation || document.userActivation?.hasBeenActive;
    console.log('🤝 User gesture available:', hasUserGesture);

    // 이전 음성 완전 정지
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    // 음성 목록 확인
    const voices = speechSynthesis.getVoices();
    console.log('🔊 Available voices:', voices.length);
    
    if (voices.length === 0) {
      console.log('⏳ No voices available, waiting...');
      speechSynthesis.onvoiceschanged = () => {
        console.log('🔄 Voices loaded, retrying...');
        const newVoices = speechSynthesis.getVoices();
        console.log('🔊 New voices count:', newVoices.length);
        if (newVoices.length > 0) {
          startSpeech();
        }
      };
      return;
    }

    startSpeech();

    function startSpeech() {
      // 새 utterance 생성
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = audioState.speed;
      utterance.volume = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = lang;

      // 사용 가능한 음성 찾기
      const availableVoices = speechSynthesis.getVoices();
      const targetVoice = availableVoices.find(voice => 
        voice.lang.startsWith(lang.split('-')[0]) || 
        voice.lang === lang
      );
      
      if (targetVoice) {
        utterance.voice = targetVoice;
        console.log('🎯 Selected voice:', targetVoice.name, '(' + targetVoice.lang + ')');
      } else {
        console.log('⚠️ No specific voice found, using default');
      }

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
        
        if (event.error === 'not-allowed') {
          alert('음성 재생이 차단되었습니다. 브라우저 설정에서 음성 합성을 허용해주세요.\n\n설정 방법:\n1. 브라우저 주소창 옆의 자물쇠 아이콘 클릭\n2. 사운드 권한을 "허용"으로 변경\n3. 페이지 새로고침');
        } else if (event.error === 'network') {
          alert('네트워크 오류로 음성 재생에 실패했습니다.');
        } else {
          console.log('TTS 오류 상세:', event);
        }
        
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      };

      // 음성 재생 시작
      setCurrentUtterance(utterance);
      console.log('🎤 Calling speechSynthesis.speak()...');
      speechSynthesis.speak(utterance);
      
      // 재생 확인
      setTimeout(() => {
        console.log('🔍 Speech synthesis status:', {
          speaking: speechSynthesis.speaking,
          pending: speechSynthesis.pending,
          paused: speechSynthesis.paused
        });
      }, 500);
    }
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