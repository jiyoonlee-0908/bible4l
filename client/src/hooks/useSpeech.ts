import { useState, useCallback, useEffect } from 'react';
import { AudioState } from '@shared/schema';

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

export function useSpeech() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentPosition: 0,
    duration: 0,
    speed: 1.0,
  });

  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const cleanText = useCallback((text: string): string => {
    return text
      .replace(/[:\.,;!?]/g, ' ') // Remove punctuation that affects speech
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }, []);

  const speak = useCallback((text: string, options: UseSpeechOptions = {}) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();

      const cleanedText = cleanText(text);
      const newUtterance = new SpeechSynthesisUtterance(cleanedText);
      
      newUtterance.rate = options.rate || audioState.speed;
      newUtterance.pitch = options.pitch || 1;
      newUtterance.volume = options.volume || 1;
      
      if (options.voice) {
        newUtterance.voice = options.voice;
      }

      newUtterance.onstart = () => {
        setAudioState(prev => ({ ...prev, isPlaying: true, currentPosition: 0 }));
      };

      newUtterance.onend = () => {
        setAudioState(prev => ({ ...prev, isPlaying: false, currentPosition: 0 }));
      };

      newUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      };

      // Estimate duration based on text length and speech rate
      const estimatedDuration = (cleanedText.length / 10) / (options.rate || audioState.speed);
      setAudioState(prev => ({ ...prev, duration: estimatedDuration }));

      setUtterance(newUtterance);
      speechSynthesis.speak(newUtterance);
    }
  }, [cleanText, audioState.speed]);

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
    setAudioState(prev => ({ ...prev, speed }));
    if (utterance && speechSynthesis.speaking) {
      // For rate changes, we need to restart the speech
      speechSynthesis.cancel();
      speak(utterance.text, { rate: speed });
    }
  }, [utterance, speak]);

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
    isSupported: 'speechSynthesis' in window,
  };
}
