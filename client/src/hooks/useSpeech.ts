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
      console.log('Available voices:', availableVoices.length);
      availableVoices.forEach((voice, index) => {
        console.log(`Voice ${index}: ${voice.name} (${voice.lang}) - Local: ${voice.localService}, Default: ${voice.default}`);
      });
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    // Initialize audio context for DSP
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      setupAudioNodes();
    }

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
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

  const selectBestVoice = useCallback((targetLang: string) => {
    if (!voices.length) return null;
    
    const langCode = targetLang.split('-')[0];
    const languageVoices = voices.filter(v => v.lang.startsWith(langCode));
    
    if (languageVoices.length === 0) return null;
    
    // 모바일에서 구글 음성 강제 사용을 위한 정확한 패턴 매칭
    const googleVoicePatterns = {
      ko: [
        'Google 한국의',
        'Google Korean',
        'google ko',
        'google korean',
        'ko-KR-Standard-A',
        'ko-KR-Standard-B',
        'ko-KR-Standard-C',
        'ko-KR-Standard-D'
      ],
      en: [
        'Google US English',
        'Google UK English Female',
        'Google UK English Male', 
        'Google English',
        'google en',
        'google english',
        'en-US-Standard-A',
        'en-US-Standard-B',
        'en-US-Standard-C',
        'en-US-Standard-D',
        'en-US-Standard-E',
        'en-US-Standard-F',
        'en-US-Standard-G',
        'en-US-Standard-H',
        'en-US-Standard-I',
        'en-US-Standard-J'
      ],
      zh: [
        'Google 普通话（中国大陆）',
        'Google Chinese (China)',
        'Google Chinese',
        'google zh',
        'google chinese',
        'zh-CN-Standard-A',
        'zh-CN-Standard-B',
        'zh-CN-Standard-C',
        'zh-CN-Standard-D'
      ],
      ja: [
        'Google 日本語',
        'Google Japanese',
        'google ja',
        'google japanese',
        'ja-JP-Standard-A',
        'ja-JP-Standard-B',
        'ja-JP-Standard-C',
        'ja-JP-Standard-D'
      ]
    };
    
    const googlePatterns = googleVoicePatterns[langCode as keyof typeof googleVoicePatterns] || [];
    
    // 구글 음성 우선 검색 (정확한 매칭)
    for (const pattern of googlePatterns) {
      const voice = languageVoices.find(v => 
        v.name === pattern || 
        v.name.toLowerCase() === pattern.toLowerCase() ||
        v.name.toLowerCase().includes(pattern.toLowerCase())
      );
      if (voice) {
        console.log(`Selected Google voice: ${voice.name} for ${langCode}`);
        return voice;
      }
    }
    
    // 구글 음성 완전 강제 검색 (모든 구글 관련 키워드)
    const googleVoices = languageVoices.filter(v => {
      const name = v.name.toLowerCase();
      return name.includes('google') || 
             name.includes('standard') || 
             name.includes('wavenet') ||
             name.includes('neural') ||
             (v.voiceURI && v.voiceURI.toLowerCase().includes('google'));
    });
    
    if (googleVoices.length > 0) {
      console.log(`Fallback Google voice: ${googleVoices[0].name} for ${langCode}`);
      return googleVoices[0];
    }
    
    // 최후의 수단으로 원격 음성 우선 (구글 서비스 가능성 높음)
    const remoteVoices = languageVoices.filter(v => !v.localService);
    if (remoteVoices.length > 0) {
      console.log(`Remote voice selected: ${remoteVoices[0].name} for ${langCode}`);
      return remoteVoices[0];
    }
    
    // 폴백
    console.log(`Fallback voice selected: ${languageVoices[0].name} for ${langCode}`);
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
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();

      const cleanedText = cleanText(text);
      const newUtterance = new SpeechSynthesisUtterance(cleanedText);
      
      // 구글 음성 강제 설정
      const targetLang = options.lang || getCurrentLanguageCode();
      const selectedVoice = selectBestVoice(targetLang);
      
      if (selectedVoice) {
        newUtterance.voice = selectedVoice;
        console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang}) for text: ${cleanedText.substring(0, 50)}...`);
      } else {
        console.warn(`No suitable voice found for language: ${targetLang}`);
      }
      
      // Apply settings with safe defaults
      newUtterance.rate = options.rate || settings.playbackSpeed || 1.0;
      const pitchValue = options.pitch !== undefined ? options.pitch : settings.pitch || 0;
      newUtterance.pitch = calculatePitch(pitchValue);
      newUtterance.volume = options.volume || 1;
      
      // Set language for the utterance
      if (options.lang) {
        newUtterance.lang = options.lang;
      } else {
        newUtterance.lang = targetLang;
      }

      // Apply DSP effects
      applyDSPSettings();

      // Track listening time for achievements
      const startTime = Date.now();

      newUtterance.onstart = () => {
        setAudioState(prev => ({ 
          ...prev, 
          isPlaying: true, 
          currentPosition: 0,
          speed: newUtterance.rate,
          pitch: settings.pitch,
        }));
      };

      newUtterance.onend = () => {
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
        console.error('Speech synthesis error:', event.error);
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      };

      // Estimate duration based on text length and speech rate
      const estimatedDuration = (cleanedText.length / 10) / (options.rate || settings.playbackSpeed);
      setAudioState(prev => ({ ...prev, duration: estimatedDuration }));

      setUtterance(newUtterance);
      speechSynthesis.speak(newUtterance);
    }
  }, [cleanText, settings, voices, calculatePitch, applyDSPSettings]);

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
