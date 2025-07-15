import { useState, useCallback, useEffect, useRef } from 'react';
import { AudioState, Settings } from '@shared/schema';
import { Storage } from '@/lib/storage';

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  lang?: string;
  onEnd?: () => void;
}

export function useSpeech() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentPosition: 0,
    duration: 0,
    speed: 1.0,
    pitch: 0,
  });

  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<Settings>(Storage.getSettings());
  
  // Audio context for DSP effects
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const eqNodesRef = useRef<{ low: BiquadFilterNode; mid: BiquadFilterNode; high: BiquadFilterNode } | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // 모바일 디버깅을 위한 음성 정보 로그
      console.log('🔊 Available voices:', availableVoices.length);
      availableVoices.forEach((voice, index) => {
        console.log(`Voice ${index}: ${voice.name} (${voice.lang}) - Local: ${voice.localService}, Default: ${voice.default}`);
      });
    };

    // Replit 환경에서 TTS 초기화
    const initializeTTS = () => {
      console.log('🎯 Initializing TTS for Replit...');
      
      // 더미 utterance로 TTS 시스템 활성화 (소리 안 나게)
      const testUtterance = new SpeechSynthesisUtterance('');
      testUtterance.volume = 0;
      speechSynthesis.speak(testUtterance);
      
      console.log('✅ TTS system activated');
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    // 사용자 상호작용으로 TTS 활성화
    const enableTTS = () => {
      initializeTTS();
      document.removeEventListener('click', enableTTS);
      document.removeEventListener('touchstart', enableTTS);
    };

    document.addEventListener('click', enableTTS, { once: true });
    document.addEventListener('touchstart', enableTTS, { once: true });

    // Initialize audio context for DSP
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      setupAudioNodes();
    }

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      document.removeEventListener('click', enableTTS);
      document.removeEventListener('touchstart', enableTTS);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const setupAudioNodes = () => {
    if (!audioContextRef.current) return;

    const context = audioContextRef.current;
    
    // Create gain node for volume control
    gainNodeRef.current = context.createGain();
    
    // Create EQ nodes
    const lowFilter = context.createBiquadFilter();
    lowFilter.type = 'lowshelf';
    lowFilter.frequency.value = 200;
    
    const midFilter = context.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 1;
    
    const highFilter = context.createBiquadFilter();
    highFilter.type = 'highshelf';
    highFilter.frequency.value = 3000;
    
    eqNodesRef.current = { low: lowFilter, mid: midFilter, high: highFilter };
    
    // Connect nodes
    gainNodeRef.current.connect(lowFilter);
    lowFilter.connect(midFilter);
    midFilter.connect(highFilter);
    highFilter.connect(context.destination);
  };

  const getCurrentLanguageCode = useCallback(() => {
    const currentSettings = Storage.getSettings();
    const langMap = {
      ko: 'ko-KR',
      en: 'en-US', 
      zh: 'zh-CN',
      ja: 'ja-JP'
    };
    return langMap[currentSettings.selectedLanguage] || 'en-US';
  }, []);

  const getLanguageSpecificSettings = useCallback((lang: string) => {
    // 각 언어별 최적화된 TTS 설정
    const languageSettings = {
      'ko': { rate: 0.9, pitch: 1.0, volume: 1.0 },
      'en': { rate: 1.0, pitch: 1.0, volume: 1.0 },
      'zh': { rate: 0.8, pitch: 1.1, volume: 1.0 },
      'ja': { rate: 0.9, pitch: 1.0, volume: 1.0 }
    };
    
    const langCode = lang.split('-')[0];
    return languageSettings[langCode as keyof typeof languageSettings] || languageSettings.en;
  }, []);

  const selectBestVoice = useCallback((targetLang: string) => {
    if (!voices.length) return null;
    
    const langCode = targetLang.split('-')[0];
    const languageVoices = voices.filter(v => v.lang.startsWith(langCode));
    
    if (languageVoices.length === 0) return null;
    
    // 기기 기본 음성 사용 (가장 안정적)
    const defaultVoice = languageVoices.find(v => v.default);
    if (defaultVoice) {
      console.log(`Using default voice: ${defaultVoice.name} for ${langCode}`);
      return defaultVoice;
    }
    
    // 로컬 음성 우선 (기기에 내장된 음성이 더 안정적)
    const localVoices = languageVoices.filter(v => v.localService);
    if (localVoices.length > 0) {
      console.log(`Using local voice: ${localVoices[0].name} for ${langCode}`);
      return localVoices[0];
    }
    
    // 첫 번째 사용 가능한 음성 사용
    console.log(`Using first available voice: ${languageVoices[0].name} for ${langCode}`);
    return languageVoices[0];
  }, [voices]);

  const applyDSPSettings = useCallback(() => {
    if (!eqNodesRef.current || !gainNodeRef.current) return;
    
    // Safely access DSP settings with defaults
    const dsp = settings.dsp || {
      echo: false,
      reverb: false,
      eq: { low: 0, mid: 0, high: 0 }
    };
    const eq = dsp.eq || { low: 0, mid: 0, high: 0 };
    
    // Apply EQ settings
    eqNodesRef.current.low.gain.value = eq.low || 0;
    eqNodesRef.current.mid.gain.value = eq.mid || 0;
    eqNodesRef.current.high.gain.value = eq.high || 0;
    
    // Apply reverb/echo effects (simplified implementation)
    if (dsp.reverb || dsp.echo) {
      gainNodeRef.current.gain.value = 0.8; // Slight volume reduction for effects
    } else {
      gainNodeRef.current.gain.value = 1.0;
    }
  }, [settings]);

  const cleanText = useCallback((text: string): string => {
    return text
      .replace(/[:\.,;!?]/g, ' ') // Remove punctuation that affects speech
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }, []);

  const calculatePitch = useCallback((semitones: number): number => {
    // Convert semitones to pitch multiplier (0.5 to 2.0 range)
    const pitch = Math.pow(2, semitones / 12);
    // Ensure the value is finite and within browser limits
    return Math.max(0.1, Math.min(10, isFinite(pitch) ? pitch : 1));
  }, []);

  const speak = useCallback((text: string, options: UseSpeechOptions = {}) => {
    try {
      // 브라우저 TTS 지원 확인
      if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported');
        return;
      }

      console.log('TTS 시작:', text);

      const cleanedText = cleanText(text);
      if (!cleanedText.trim()) {
        console.warn('Empty text provided to TTS');
        return;
      }

      // 브라우저 자동재생 정책 해결을 위한 사용자 제스처 확인
      const hasUserGesture = document.hasStoredActivation || document.userActivation?.hasBeenActive;
      console.log('User gesture available:', hasUserGesture);

      // 이전 음성 정지
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      // 약간의 딜레이 후 음성 시작
      setTimeout(() => {
        startSpeech();
      }, 50);

      function startSpeech() {
        try {
          // 사용자 상호작용 없이 음성 재생 시도 시 에러 방지
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(console.error);
          }

          const newUtterance = new SpeechSynthesisUtterance(cleanedText);
            
          // 기본 TTS 설정 (간단하게)
          const targetLang = options.lang || getCurrentLanguageCode();
          const selectedVoice = selectBestVoice(targetLang);
          const langSettings = getLanguageSpecificSettings(targetLang);
          
          if (selectedVoice) {
            newUtterance.voice = selectedVoice;
            console.log(`Using voice: ${selectedVoice.name} for ${targetLang}`);
          } else {
            console.log(`Using system default voice for ${targetLang}`);
          }
          
          // Apply settings with language-specific defaults
          newUtterance.rate = Math.max(0.1, Math.min(10, options.rate || settings.playbackSpeed || langSettings.rate));
          const pitchValue = options.pitch !== undefined ? options.pitch : settings.pitch || 0;
          newUtterance.pitch = calculatePitch(pitchValue);
          newUtterance.volume = Math.max(0, Math.min(1, options.volume || langSettings.volume));
          
          // Set language for the utterance
          newUtterance.lang = options.lang || targetLang;

          // Apply DSP effects
          applyDSPSettings();

          // Track listening time for achievements
          const startTime = Date.now();

          newUtterance.onstart = () => {
            console.log('✅ TTS started successfully');
            setAudioState(prev => ({ 
              ...prev, 
              isPlaying: true, 
              currentPosition: 0,
              speed: newUtterance.rate,
              pitch: settings.pitch,
            }));
          };

          newUtterance.onend = () => {
            console.log('✅ TTS finished');
            const endTime = Date.now();
            const listeningTime = (endTime - startTime) / 1000 / 60; // in minutes
            
            // Update listening time in storage and trigger badge checks
            const currentSettings = Storage.getSettings();
            const totalListeningTime = (currentSettings.totalListeningTime || 0) + listeningTime;
            
            // Save updated listening time
            Storage.saveSettings({ ...currentSettings, totalListeningTime });
            
            // Check for listening time badges
            const badgeEvent = new CustomEvent('badge-check', {
              detail: { type: 'listening', value: totalListeningTime }
            });
            window.dispatchEvent(badgeEvent);
            
            // Check for first listen badge
            const firstListenEvent = new CustomEvent('badge-check', {
              detail: { type: 'first_listen' }
            });
            window.dispatchEvent(firstListenEvent);
            
            setAudioState(prev => ({ ...prev, isPlaying: false, currentPosition: 0 }));
            
            // Call onEnd callback if provided
            if (options.onEnd) {
              options.onEnd();
            }
          };

          newUtterance.onerror = (event) => {
            console.error('❌ Speech synthesis error:', event.error);
            
            // Replit 환경에서 자주 발생하는 오류 처리
            if (event.error === 'canceled') {
              console.log('🔄 TTS was canceled, this is normal');
              return;
            }
            
            if (event.error === 'not-allowed') {
              console.error('🚫 TTS blocked by browser policy - user interaction required');
              alert('음성 재생을 위해 먼저 화면을 터치하거나 클릭해주세요.');
            }
            
            setAudioState(prev => ({ ...prev, isPlaying: false }));
          };

          newUtterance.onpause = () => {
            console.log('⏸️ TTS paused');
            setAudioState(prev => ({ ...prev, isPlaying: false }));
          };

          newUtterance.onresume = () => {
            console.log('▶️ TTS resumed');
            setAudioState(prev => ({ ...prev, isPlaying: true }));
          };

          // Estimate duration based on text length and speech rate
          const estimatedDuration = (cleanedText.length / 10) / (options.rate || settings.playbackSpeed || 1.0);
          setAudioState(prev => ({ ...prev, duration: estimatedDuration }));

          // Save utterance reference
          setUtterance(newUtterance);
          
          // Start speech synthesis
          console.log('🎤 Starting speech synthesis...');
          
          // Replit 환경에서 음성 재생 강제 실행
          if (window.speechSynthesis.getVoices().length === 0) {
            console.log('⏳ Waiting for voices to load...');
            window.speechSynthesis.onvoiceschanged = () => {
              console.log('✅ Voices loaded, retrying...');
              speechSynthesis.speak(newUtterance);
            };
          } else {
            speechSynthesis.speak(newUtterance);
          }
          
        } catch (innerError) {
          console.error('❌ Inner speech error:', innerError);
          setAudioState(prev => ({ ...prev, isPlaying: false }));
        }
      }

    } catch (error) {
      console.error('❌ Speech synthesis error:', error);
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [cleanText, settings, voices, calculatePitch, applyDSPSettings, getCurrentLanguageCode, selectBestVoice, getLanguageSpecificSettings]);

  const pause = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    }
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setAudioState(prev => ({ ...prev, isPlaying: false, currentPosition: 0 }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    const newSettings = { ...settings, playbackSpeed: speed };
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
    
    setAudioState(prev => ({ ...prev, speed }));
    if (utterance && speechSynthesis.speaking) {
      // For rate changes, we need to restart the speech
      speechSynthesis.cancel();
      speak(utterance.text, { rate: speed });
    }
  }, [utterance, speak, settings]);

  const setPitch = useCallback((pitch: number) => {
    const newSettings = { ...settings, pitch };
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
    
    setAudioState(prev => ({ ...prev, pitch }));
    if (utterance && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      speak(utterance.text, { pitch });
    }
  }, [utterance, speak, settings]);

  const updateDSPSettings = useCallback((dspSettings: Partial<Settings['dsp']>) => {
    const newSettings = { 
      ...settings, 
      dsp: { ...settings.dsp, ...dspSettings }
    };
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
    applyDSPSettings();
  }, [settings, applyDSPSettings]);

  const toggle = useCallback(() => {
    if (audioState.isPlaying) {
      pause();
    } else if (speechSynthesis.paused) {
      resume();
    }
  }, [audioState.isPlaying, pause, resume]);

  return {
    audioState,
    voices,
    speak,
    pause,
    resume,
    stop,
    toggle,
    setSpeed,
    setPitch,
    updateDSPSettings,
    isSupported: 'speechSynthesis' in window,
  };
}
