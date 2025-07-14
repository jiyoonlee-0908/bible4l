import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ModeToggle } from '@/components/ModeToggle';
import { VerseCard } from '@/components/VerseCard';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useBible } from '@/hooks/useBible';
import { useBadges } from '@/hooks/useBadges';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Storage } from '@/lib/storage';
import { Language, Settings } from '@shared/schema';

export default function Home() {
  const [location, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>(Storage.getSettings());
  
  const {
    currentLanguage,
    setCurrentLanguage,
    currentVerseData,
    navigateVerse,
    currentChapter,
    currentVerse,
  } = useBible();
  
  const { checkAndUnlockBadge } = useBadges();
  const { bookmarks } = useBookmarks();

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
      
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <LanguageToggle
          selectedLanguage={settings.selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        <ModeToggle
          mode={settings.displayMode}
          onModeChange={handleModeChange}
        />
        
        {currentVerseData && (
          <VerseCard
            verse={currentVerseData}
            language={currentLanguage}
            mode={settings.displayMode}
          />
        )}
        
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
