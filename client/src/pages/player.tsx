import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BibleSelector } from '@/components/BibleSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, Loader2, Repeat, Repeat1, Plus, Minus } from 'lucide-react';
import { useBible } from '@/hooks/useBible';
import { useSpeech } from '@/hooks/useSpeech';
import { useSubscription } from '@/hooks/useSubscription';
import { AdFitBanner } from '@/components/AdFitBanner';
import { FontSizeModal } from '@/components/FontSizeModal';
import { Storage } from '@/lib/storage';
import { Language, Settings, languageConfig } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Player() {
  const [location, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>(Storage.getSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [playMode, setPlayMode] = useState<'single' | 'continuous'>('continuous');
  const [isPlayingContinuous, setIsPlayingContinuous] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [fontLevel, setFontLevel] = useState(0);
  
  const {
    currentLanguage,
    setCurrentLanguage,
    currentVerseData,
    koreanVerseData,
    currentBook,
    currentChapter,
    currentVerse,
    setVerse,
    navigateVerse
  } = useBible();
  
  const { audioState, speak, toggle, stop, setSpeed } = useSpeech();
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = Storage.getSettings();
    setSettings(savedSettings);
    setCurrentLanguage(savedSettings.selectedLanguage);
    setFontLevel(savedSettings.fontLevel || 0);
  }, []);

  // Auto-play when verse changes in continuous mode
  useEffect(() => {
    if (isPlayingContinuous && currentVerseData && !audioState.isPlaying) {
      setTimeout(() => {
        playCurrentVerse();
      }, 500); // Small delay to ensure verse is loaded
    }
  }, [currentVerseData, isPlayingContinuous]);

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

  const playCurrentVerse = () => {
    if (!currentVerseData) return;
    
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
        
        // Save listening statistics
        const listeningStats = JSON.parse(localStorage.getItem('listeningStats') || '[]');
        const verseKey = `${currentBook}-${currentChapter}-${currentVerse}-${currentLanguage}`;
        
        // Check if this exact verse in this language was already recorded recently (within 5 minutes)
        const recentRecord = listeningStats.find((stat: any) => {
          const statKey = `${stat.book}-${stat.chapter}-${stat.verse}-${stat.language}`;
          const timeDiff = new Date().getTime() - new Date(stat.timestamp).getTime();
          return statKey === verseKey && timeDiff < 5 * 60 * 1000; // 5 minutes
        });
        
        if (!recentRecord) {
          const newStat = {
            book: currentBook,
            chapter: currentChapter,
            verse: currentVerse,
            language: currentLanguage,
            timestamp: new Date().toISOString(),
            duration: Math.round(currentVerseData.text.length / 15), // Estimate duration based on text length
            type: 'listen'
          };
          listeningStats.push(newStat);
          localStorage.setItem('listeningStats', JSON.stringify(listeningStats));
        }
        
        if (playMode === 'single') {
          // Repeat current verse in single mode
          setTimeout(() => {
            playCurrentVerse();
          }, 500);
        } else if (playMode === 'continuous' && isPlayingContinuous) {
          // Auto advance to next verse after 1 second
          setTimeout(() => {
            navigateVerse('next');
          }, 1000);
        } else {
          setIsPlayingContinuous(false);
        }
      }
    });
  };

  const handlePlay = () => {
    if (audioState.isPlaying) {
      toggle();
      setIsPlayingContinuous(false);
    } else if (currentVerseData) {
      setIsLoading(true);
      setIsPlayingContinuous(true);
      playCurrentVerse();
      setIsLoading(false);
    }
  };



  const handleNext = () => {
    navigateVerse('next');
  };

  const handlePrevious = () => {
    navigateVerse('prev');
  };

  const adjustSpeed = (delta: number) => {
    const newSpeed = Math.max(0.5, Math.min(1.5, audioState.speed + delta));
    setSpeed(newSpeed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        onFontSizeClick={() => setShowFontSizeModal(true)}
        onSettingsClick={() => setLocation('/settings')}
      />
      
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <BibleSelector
          onSelect={handleBibleSelect}
          selectedLanguage={currentLanguage}
        />
        
        <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-slate-700">언어 선택</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(languageConfig) as [Language, typeof languageConfig[Language]][]).map(([code, config]) => {
                const isSelected = currentLanguage === code;
                const flagEmoji = code === 'ko' ? '🇰🇷' : 
                                 code === 'en' ? '🇺🇸' : 
                                 code === 'zh' ? '🇨🇳' : '🇯🇵';
                return (
                  <Button
                    key={code}
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange(code)}
                    size="sm"
                    className={`h-10 text-sm transition-colors flex items-center gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-800 to-amber-900 text-amber-50 hover:from-amber-900 hover:to-amber-950 shadow-md'
                        : 'bg-white text-amber-800 hover:bg-amber-50 border-amber-200'
                    }`}
                  >
                    <span className="text-base">{flagEmoji}</span>
                    {config.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
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
              <>
                <div className="text-center text-slate-600 text-sm leading-relaxed">
                  {currentVerseData.text}
                </div>
                
                {/* Force single mode for player - show Korean if available for non-Korean languages */}
                {currentLanguage !== 'ko' && koreanVerseData && (
                  <div className="text-center text-slate-500 text-xs leading-relaxed mt-3 pt-3 border-t border-amber-100">
                    <div className="text-xs text-amber-600 mb-1">한국어</div>
                    {koreanVerseData.text}
                  </div>
                )}
              </>
            )}
            
            <div className="flex justify-center items-center space-x-4">
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="icon"
                className="w-12 h-12 bg-amber-100 hover:bg-amber-200 rounded-full"
                disabled={isLoading}
              >
                <SkipBack className="h-5 w-5 text-amber-800" />
              </Button>
              
              <Button
                onClick={handlePlay}
                className="w-16 h-16 bg-amber-800 hover:bg-amber-900 rounded-full shadow-lg"
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
                className="w-12 h-12 bg-amber-100 hover:bg-amber-200 rounded-full"
                disabled={isLoading}
              >
                <SkipForward className="h-5 w-5 text-amber-800" />
              </Button>
            </div>
            
            {/* Speed Controls */}
            <div className="flex justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => adjustSpeed(-0.1)}
                  className="w-8 h-8 bg-slate-200 hover:bg-slate-300 rounded-full"
                >
                  <Minus className="h-3 w-3 text-slate-600" />
                </Button>
                <span className="text-sm font-medium text-slate-700 min-w-12 text-center">
                  {audioState.speed.toFixed(1)}x
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => adjustSpeed(0.1)}
                  className="w-8 h-8 bg-slate-200 hover:bg-slate-300 rounded-full"
                >
                  <Plus className="h-3 w-3 text-slate-600" />
                </Button>
              </div>
            </div>

            {/* Play Mode Toggle */}
            <div className="flex justify-center">
              <div className="bg-muted rounded-full p-1 flex">
                <Button
                  onClick={() => setPlayMode('single')}
                  variant="ghost"
                  size="sm"
                  className={`text-xs px-4 py-1 rounded-full transition-colors ${
                    playMode === 'single'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Repeat1 className="h-3 w-3 mr-1" />
                  한 곡 반복
                </Button>
                
                <Button
                  onClick={() => setPlayMode('continuous')}
                  variant="ghost"
                  size="sm"
                  className={`text-xs px-4 py-1 rounded-full transition-colors ${
                    playMode === 'continuous'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Repeat className="h-3 w-3 mr-1" />
                  연속 재생
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* 플레이어 하단 광고 */}
        <AdFitBanner
          adUnit="DAN-your-player-bottom-unit"
          adWidth={320}
          adHeight={50}
          isSubscribed={isSubscribed}
          className="player-bottom-ad"
        />
      </div>
      
      <BottomNavigation
        currentPath={location}
        onNavigate={setLocation}
      />
      
      <FontSizeModal
        isOpen={showFontSizeModal}
        onClose={() => setShowFontSizeModal(false)}
        currentLevel={fontLevel}
        onLevelChange={setFontLevel}
      />
    </div>
  );
}