import * as React from 'react';
import { AudioState, Language } from '@shared/schema';

interface GlobalAudioState extends AudioState {
  currentVerse?: {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    reference: string;
    language: Language;
  };
  playbackMode: 'single' | 'continuous';
  isActive: boolean;
}

interface GlobalAudioContextType {
  globalAudioState: GlobalAudioState;
  setGlobalAudioState: (state: Partial<GlobalAudioState>) => void;
  startGlobalPlayback: (verse: any, language: Language, mode: 'single' | 'continuous') => void;
  stopGlobalPlayback: () => void;
  toggleGlobalPlayback: () => void;
}

const GlobalAudioContext = React.createContext<GlobalAudioContextType | undefined>(undefined);

export function GlobalAudioProvider({ children }: { children: React.ReactNode }) {
  const [globalAudioState, setGlobalAudioStateInternal] = React.useState<GlobalAudioState>({
    isPlaying: false,
    currentPosition: 0,
    duration: 0,
    speed: 1.0,
    pitch: 0,
    playbackMode: 'single',
    isActive: false,
  });

  const setGlobalAudioState = (newState: Partial<GlobalAudioState>) => {
    setGlobalAudioStateInternal(prev => ({ ...prev, ...newState }));
  };

  const startGlobalPlayback = (verse: any, language: Language, mode: 'single' | 'continuous') => {
    setGlobalAudioState({
      currentVerse: {
        book: verse.bookId,
        chapter: parseInt(verse.chapterId),
        verse: verse.verseId,
        text: verse.text,
        reference: verse.reference,
        language,
      },
      playbackMode: mode,
      isActive: true,
      isPlaying: true,
    });
  };

  const stopGlobalPlayback = () => {
    setGlobalAudioState({
      isPlaying: false,
      isActive: false,
      currentVerse: undefined,
    });
  };

  const toggleGlobalPlayback = () => {
    setGlobalAudioState({
      isPlaying: !globalAudioState.isPlaying,
    });
  };

  return (
    <GlobalAudioContext.Provider value={{
      globalAudioState,
      setGlobalAudioState,
      startGlobalPlayback,
      stopGlobalPlayback,
      toggleGlobalPlayback,
    }}>
      {children}
    </GlobalAudioContext.Provider>
  );
}

export function useGlobalAudio() {
  const context = React.useContext(GlobalAudioContext);
  if (!context) {
    throw new Error('useGlobalAudio must be used within GlobalAudioProvider');
  }
  return context;
}