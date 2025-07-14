import { useState, useCallback, useEffect, useRef } from 'react';
import { AudioState, Settings } from '@shared/schema';
import { Storage } from '@/lib/storage';

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  lang?: string;
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

  const applyDSPSettings = useCallback(() => {
    if (!eqNodesRef.current || !gainNodeRef.current) return;
    
    const { dsp } = settings;
    const { eq } = dsp;
    
    // Apply EQ settings
    eqNodesRef.current.low.gain.value = eq.low;
    eqNodesRef.current.mid.gain.value = eq.mid;
    eqNodesRef.current.high.gain.value = eq.high;
    
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
      
      // Apply settings with safe defaults
      newUtterance.rate = options.rate || settings.playbackSpeed || 1.0;
      const pitchValue = options.pitch !== undefined ? options.pitch : settings.pitch || 0;
      newUtterance.pitch = calculatePitch(pitchValue);
      newUtterance.volume = options.volume || 1;
      
      // Apply voice selection based on current or specified language
      if (options.voice) {
        newUtterance.voice = options.voice;
      } else {
        // Auto-select voice based on specified or current language
        const targetLang = options.lang || getCurrentLanguageCode();
        const languageVoices = voices.filter(v => v.lang.startsWith(targetLang.split('-')[0]));
        if (languageVoices.length > 0) {
          newUtterance.voice = languageVoices[0];
        } else if (settings.voice && voices.length > 0) {
          const selectedVoice = voices.find(v => v.name === settings.voice);
          if (selectedVoice) {
            newUtterance.voice = selectedVoice;
          }
        }
      }
      
      // Set language for the utterance
      if (options.lang) {
        newUtterance.lang = options.lang;
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
        
        // Update listening time in storage
        const currentSettings = Storage.getSettings();
        // Note: We'd need to add totalListeningTime to settings schema
        
        setAudioState(prev => ({ ...prev, isPlaying: false, currentPosition: 0 }));
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
