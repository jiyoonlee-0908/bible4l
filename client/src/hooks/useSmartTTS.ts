import { useState, useEffect, useCallback } from 'react';
import { Language } from '@shared/schema';

interface SmartVoice {
  voice: SpeechSynthesisVoice;
  quality: number; // 0-100 점수
  isGoogle: boolean;
  tested: boolean;
}

interface SmartTTSState {
  isReady: boolean;
  currentLanguage: Language;
  smartVoices: Record<Language, SmartVoice | null>;
  needsImprovement: boolean;
  autoOptimizing: boolean;
}

export function useSmartTTS() {
  const [state, setState] = useState<SmartTTSState>({
    isReady: false,
    currentLanguage: 'ko' as Language,
    smartVoices: {
      ko: null,
      en: null,
      zh: null,
      ja: null
    },
    needsImprovement: false,
    autoOptimizing: false
  });

  // 음성 품질 점수 계산
  const calculateVoiceQuality = (voice: SpeechSynthesisVoice, language: Language): number => {
    let score = 0;
    
    // Google TTS 보너스
    if (voice.name.toLowerCase().includes('google') || 
        voice.voiceURI.toLowerCase().includes('google')) {
      score += 50;
    }
    
    // 언어 매칭 정확도
    const langMap = {
      ko: ['ko', 'korean'],
      en: ['en', 'english'],
      zh: ['zh', 'cmn', 'chinese'],
      ja: ['ja', 'japanese']
    };
    
    const targetLangs = langMap[language];
    if (targetLangs.some(lang => voice.lang.toLowerCase().includes(lang))) {
      score += 30;
    }
    
    // 로컬 음성 보너스 (빠른 재생)
    if (voice.localService) {
      score += 10;
    }
    
    // 품질 키워드 검사
    const qualityKeywords = ['neural', 'enhanced', 'premium', 'standard'];
    if (qualityKeywords.some(keyword => voice.name.toLowerCase().includes(keyword))) {
      score += 10;
    }
    
    return Math.min(score, 100);
  };

  // 자동으로 최적의 음성 선택
  const autoSelectBestVoices = useCallback(async () => {
    setState(prev => ({ ...prev, autoOptimizing: true }));
    
    try {
      // 음성 로딩 대기
      await new Promise<void>((resolve) => {
        let attempts = 0;
        const checkVoices = () => {
          const voices = speechSynthesis.getVoices();
          attempts++;
          if (voices.length > 0 || attempts > 30) {
            resolve();
          } else {
            setTimeout(checkVoices, 100);
          }
        };
        checkVoices();
      });

      const allVoices = speechSynthesis.getVoices();
      const newSmartVoices: Record<Language, SmartVoice | null> = {
        ko: null,
        en: null,
        zh: null,
        ja: null
      };

      // 각 언어별로 최적 음성 찾기
      for (const language of ['ko', 'en', 'zh', 'ja'] as Language[]) {
        const langPrefix = language === 'zh' ? ['zh', 'cmn'] : [language];
        
        const candidateVoices = allVoices.filter(voice => 
          langPrefix.some(prefix => voice.lang.toLowerCase().startsWith(prefix))
        );

        if (candidateVoices.length > 0) {
          // 품질 점수로 정렬하여 최고 품질 선택
          const scoredVoices = candidateVoices.map(voice => ({
            voice,
            quality: calculateVoiceQuality(voice, language),
            isGoogle: voice.name.toLowerCase().includes('google') || 
                     voice.voiceURI.toLowerCase().includes('google'),
            tested: false
          }));

          scoredVoices.sort((a, b) => b.quality - a.quality);
          newSmartVoices[language] = scoredVoices[0];
        }
      }

      // 선택된 음성을 localStorage에 저장
      const voiceSettings = Object.entries(newSmartVoices).reduce((acc, [lang, smartVoice]) => {
        if (smartVoice) {
          acc[lang] = {
            name: smartVoice.voice.name,
            lang: smartVoice.voice.lang,
            voiceURI: smartVoice.voice.voiceURI,
            quality: smartVoice.quality
          };
        }
        return acc;
      }, {} as Record<string, any>);

      localStorage.setItem('bible-smart-voices', JSON.stringify(voiceSettings));

      // 개선이 필요한지 확인
      const totalVoices = Object.values(newSmartVoices).filter(v => v !== null).length;
      const googleVoices = Object.values(newSmartVoices).filter(v => v?.isGoogle).length;
      const needsImprovement = totalVoices < 4 || googleVoices < 2;

      setState(prev => ({
        ...prev,
        smartVoices: newSmartVoices,
        isReady: true,
        needsImprovement,
        autoOptimizing: false
      }));

      console.log('Smart TTS 자동 최적화 완료:', {
        totalVoices,
        googleVoices,
        needsImprovement,
        voices: Object.entries(newSmartVoices).reduce((acc, [lang, voice]) => {
          acc[lang] = voice ? `${voice.voice.name} (${voice.quality}점)` : 'None';
          return acc;
        }, {} as Record<string, string>)
      });

    } catch (error) {
      console.error('Smart TTS 최적화 실패:', error);
      setState(prev => ({
        ...prev,
        autoOptimizing: false,
        isReady: true,
        needsImprovement: true
      }));
    }
  }, []);

  // 스마트 음성으로 텍스트 읽기
  const speakSmart = useCallback((text: string, language: Language, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onEnd?: () => void;
  }) => {
    const smartVoice = state.smartVoices[language];
    if (!smartVoice) {
      console.warn(`${language} 언어용 최적화된 음성을 찾을 수 없습니다`);
      return;
    }

    try {
      speechSynthesis.cancel(); // 기존 재생 중단
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = smartVoice.voice;
      utterance.rate = options?.rate || 0.9;
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 0.8;
      
      if (options?.onEnd) {
        utterance.onend = options.onEnd;
      }
      
      utterance.onerror = (event) => {
        console.error('Smart TTS 재생 오류:', event);
      };

      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Smart TTS 실행 오류:', error);
    }
  }, [state.smartVoices]);

  // 원클릭 음성 개선
  const oneClickImprovement = useCallback(() => {
    // 구글 TTS 설치 페이지로 이동
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.google.android.tts';
    window.open(playStoreUrl, '_blank');
    
    // 3초 후 자동 재최적화
    setTimeout(() => {
      autoSelectBestVoices();
    }, 3000);
  }, [autoSelectBestVoices]);

  // 컴포넌트 마운트 시 자동 최적화 실행
  useEffect(() => {
    autoSelectBestVoices();
    
    // 음성 변경 이벤트 리스너 추가
    const handleVoicesChanged = () => {
      setTimeout(autoSelectBestVoices, 1000);
    };
    
    speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, [autoSelectBestVoices]);

  return {
    ...state,
    speakSmart,
    autoSelectBestVoices,
    oneClickImprovement
  };
}