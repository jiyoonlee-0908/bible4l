import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BibleSelector } from '@/components/BibleSelector';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, Loader2 } from 'lucide-react';
import { useBible } from '@/hooks/useBible';
import { useSpeech } from '@/hooks/useSpeech';
import { Storage } from '@/lib/storage';
import { Language, Settings } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Player() {
  const [location, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>(Storage.getSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [continuousMode, setContinuousMode] = useState(true);
  
  const {
    currentLanguage,
    setCurrentLanguage,
    currentVerseData,
    koreanVerseData,
    currentBook,
    currentChapter,
    currentVerse,
    setVerse
  } = useBible();
  
  const { audioState, speak, toggle, stop } = useSpeech();
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = Storage.getSettings();
    setSettings(savedSettings);
    setCurrentLanguage(savedSettings.selectedLanguage);
  }, []);

  const handleLanguageChange = (language: Language) => {
    const newSettings = { ...settings, selectedLanguage: language };
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
    setCurrentLanguage(language);
  };

  const handleBibleSelect = (book: string, chapter: number, verse: number) => {
    setVerse(book, chapter, verse);
    toast({
      title: '재생 위치 설정됨',
      description: `${book} ${chapter}:${verse}부터 재생됩니다.`,
    });
  };

  const handlePlay = () => {
    if (audioState.isPlaying) {
      toggle();
    } else if (currentVerseData) {
      setIsLoading(true);
      
      if (settings.displayMode === 'double' && koreanVerseData) {
        // Cross mode: speak both languages
        speakCrossMode();
      } else {
        // Single mode
        const voiceMapping = {
          ko: 'ko-KR',
          en: 'en-US',
          zh: 'zh-CN', 
          ja: 'ja-JP'
        };
        
        const langCode = voiceMapping[currentLanguage] || 'en-US';
        speak(currentVerseData.text, { 
          rate: audioState.speed, 
          lang: langCode,
          onEnd: () => {
            setIsLoading(false);
            if (continuousMode) {
              // Auto advance to next verse after 1 second
              setTimeout(() => {
                handleNext();
              }, 1000);
            }
          }
        });
      }
      setIsLoading(false);
    }
  };

  const speakCrossMode = () => {
    if (!currentVerseData || !koreanVerseData) return;
    
    const voiceMapping = {
      ko: 'ko-KR',
      en: 'en-US',
      zh: 'zh-CN', 
      ja: 'ja-JP'
    };

    const primaryLangCode = voiceMapping[currentLanguage] || 'en-US';
    speak(currentVerseData.text, { 
      rate: audioState.speed, 
      lang: primaryLangCode,
      onEnd: () => {
        // Speak Korean after the first language finishes
        speak(koreanVerseData.text, { 
          rate: audioState.speed, 
          lang: 'ko-KR',
          onEnd: () => {
            if (continuousMode) {
              // Auto advance to next verse after 1 second
              setTimeout(() => {
                handleNext();
              }, 1000);
            }
          }
        });
      }
    });
  };

  const handleNext = () => {
    if (currentVerse < 31) {
      setVerse(currentBook, currentChapter, currentVerse + 1);
    } else {
      setVerse(currentBook, currentChapter + 1, 1);
    }
  };

  const handlePrevious = () => {
    if (currentVerse > 1) {
      setVerse(currentBook, currentChapter, currentVerse - 1);
    } else if (currentChapter > 1) {
      setVerse(currentBook, currentChapter - 1, 31);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        onBookmarksClick={() => setLocation('/bookmarks')}
        onSettingsClick={() => setLocation('/settings')}
      />
      
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <LanguageToggle
          selectedLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        <BibleSelector
          onSelect={handleBibleSelect}
          selectedLanguage={currentLanguage}
          displayMode={settings.displayMode}
          onModeChange={(mode) => {
            const newSettings = { ...settings, displayMode: mode };
            setSettings(newSettings);
            Storage.saveSettings(newSettings);
          }}
        />
        
        <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center text-slate-800">
              성경 오디오 플레이어
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700">
                {currentVerseData?.reference || '구절을 선택해주세요'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {currentLanguage === 'ko' ? '한국어' : 
                 currentLanguage === 'en' ? 'English' : 
                 currentLanguage === 'zh' ? '中文' : '日本語'}
              </p>
            </div>
            
            {currentVerseData && (
              <div className="text-center text-slate-600 text-sm leading-relaxed">
                {currentVerseData.text}
              </div>
            )}
            
            <div className="flex justify-center items-center space-x-4">
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="icon"
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full"
                disabled={isLoading}
              >
                <SkipBack className="h-5 w-5 text-slate-600" />
              </Button>
              
              <Button
                onClick={handlePlay}
                className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
                disabled={isLoading || !currentVerseData}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : audioState.isPlaying ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white ml-1" />
                )}
              </Button>
              
              <Button
                onClick={handleNext}
                variant="ghost"
                size="icon"
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full"
                disabled={isLoading}
              >
                <SkipForward className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => setContinuousMode(!continuousMode)}
                variant="ghost"
                className="text-sm"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                {continuousMode ? '연속 재생 중' : '단일 재생 모드'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation
        currentPath={location}
        onNavigate={setLocation}
      />
    </div>
  );
}