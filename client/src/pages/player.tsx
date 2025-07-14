import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { VerseCard } from '@/components/VerseCard';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shuffle, Repeat, SkipBack, SkipForward } from 'lucide-react';
import { useBible } from '@/hooks/useBible';
import { useSpeech } from '@/hooks/useSpeech';
import { Storage } from '@/lib/storage';
import { Settings } from '@shared/schema';

export default function Player() {
  const [location, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>(Storage.getSettings());
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  const {
    currentVerseData,
    navigateVerse,
    currentChapter,
    currentVerse,
  } = useBible();
  
  const { audioState } = useSpeech();

  useEffect(() => {
    // Auto-advance to next verse when current one finishes
    if (isAutoPlay && !audioState.isPlaying && audioState.currentPosition === 0) {
      const timer = setTimeout(() => {
        if (isRepeat) {
          // Stay on current verse
          return;
        }
        navigateVerse('next');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [audioState.isPlaying, audioState.currentPosition, isAutoPlay, isRepeat, navigateVerse]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        onBookmarksClick={() => setLocation('/bookmarks')}
        onSettingsClick={() => setLocation('/settings')}
      />
      
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Player Controls */}
        <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">플레이어 컨트롤</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`w-10 h-10 rounded-full transition-colors ${
                  isRepeat 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Repeat className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateVerse('prev')}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full"
              >
                <SkipBack className="h-6 w-6 text-slate-600" />
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">현재 재생 중</div>
                <div className="text-lg font-semibold text-slate-800">
                  {currentVerseData?.reference || '구절 없음'}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateVerse('next')}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full"
              >
                <SkipForward className="h-6 w-6 text-slate-600" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`w-10 h-10 rounded-full transition-colors ${
                  isAutoPlay 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Shuffle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-slate-600">
              <span className={isRepeat ? 'text-blue-600 font-medium' : ''}>
                {isRepeat ? '반복 재생' : '반복 끄기'}
              </span>
              <span>•</span>
              <span className={isAutoPlay ? 'text-green-600 font-medium' : ''}>
                {isAutoPlay ? '자동 재생' : '수동 재생'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Current Verse */}
        {currentVerseData && (
          <VerseCard
            verse={currentVerseData}
            language={settings.selectedLanguage}
            mode={settings.displayMode}
          />
        )}
        
        {/* Navigation */}
        <Navigation
          currentChapter={currentChapter}
          currentVerse={currentVerse}
          onPrevious={() => navigateVerse('prev')}
          onNext={() => navigateVerse('next')}
          onChapterSelect={() => {
            // TODO: Implement chapter selector modal
          }}
          onVerseSelect={() => {
            // TODO: Implement verse selector modal
          }}
        />
      </div>
      
      <BottomNavigation
        currentPath={location}
        onNavigate={setLocation}
      />
    </div>
  );
}
