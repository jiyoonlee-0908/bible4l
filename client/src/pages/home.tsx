import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ModeToggle } from '@/components/ModeToggle';
import { VerseCard } from '@/components/VerseCard';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ChapterVerseSelector } from '@/components/ChapterVerseSelector';
import { BibleSelector } from '@/components/BibleSelector';
import { useBible } from '@/hooks/useBible';
import { useBadges } from '@/hooks/useBadges';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Storage } from '@/lib/storage';
import { Language, Settings } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [location, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>(Storage.getSettings());
  const [showChapterVerseSelector, setShowChapterVerseSelector] = useState(false);
  const [showBibleSelector, setShowBibleSelector] = useState(false);
  
  const {
    currentLanguage,
    setCurrentLanguage,
    currentVerseData,
    koreanVerseData,
    navigateVerse,
    currentChapter,
    currentVerse,
    currentBook,
    setVerse
  } = useBible();
  
  const { checkAndUnlockBadge } = useBadges();
  const { bookmarks } = useBookmarks();
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = Storage.getSettings();
    setSettings(savedSettings);
    setCurrentLanguage(savedSettings.selectedLanguage);
  }, []); // Only run once on mount

  useEffect(() => {
    // Check for badges when bookmarks change
    if (bookmarks.length > 0) {
      checkAndUnlockBadge('first_listen');
    }
    if (bookmarks.length >= 10) {
      checkAndUnlockBadge('bookmark_10', bookmarks.length);
    }
  }, [bookmarks.length]); // Only when bookmark count changes

  const handleLanguageChange = (language: Language) => {
    const newSettings = { ...settings, selectedLanguage: language };
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
    setCurrentLanguage(language);
  };

  const handleModeChange = (mode: 'single' | 'double') => {
    const newSettings = { ...settings, displayMode: mode };
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        onBookmarksClick={() => setLocation('/bookmarks')}
        onSettingsClick={() => setLocation('/settings')}
      />
      
      <div className="max-w-md mx-auto px-4 py-3 space-y-3">
        {/* Bible Selector */}
        <BibleSelector
          onSelect={(book, chapter, verse) => {
            setVerse(book, chapter, verse);
            toast({
              title: '성경 구절 선택됨',
              description: `${book} ${chapter}:${verse}로 이동했습니다.`,
            });
          }}
          selectedLanguage={currentLanguage}
        />

        {/* Language Toggle with Mode Selection */}
        <LanguageToggle
          selectedLanguage={settings.selectedLanguage}
          onLanguageChange={handleLanguageChange}
          displayMode={settings.displayMode}
          onModeChange={handleModeChange}
        />

        {currentVerseData && (
          <VerseCard
            verse={currentVerseData}
            language={currentLanguage}
            mode={settings.displayMode}
            koreanVerse={currentLanguage !== 'ko' ? koreanVerseData : undefined}
          />
        )}
        
        <Navigation
          currentChapter={currentChapter}
          currentVerse={currentVerse}
          onPrevious={() => navigateVerse('prev')}
          onNext={() => navigateVerse('next')}
          onChapterSelect={() => setShowChapterVerseSelector(true)}
          onVerseSelect={() => setShowChapterVerseSelector(true)}
        />

        {/* Chapter/Verse Selector Modal */}
        <ChapterVerseSelector
          isOpen={showChapterVerseSelector}
          onClose={() => setShowChapterVerseSelector(false)}
          onSelect={(chapter, verse) => {
            setVerse(currentBook, chapter, verse);
            toast({
              title: '구절 이동됨',
              description: `${currentBook} ${chapter}:${verse}로 이동했습니다.`,
            });
          }}
          currentChapter={currentChapter}
          currentVerse={currentVerse}
          maxChapters={150}
        />
      </div>
      
      <BottomNavigation
        currentPath={location}
        onNavigate={setLocation}
      />
    </div>
  );
}
