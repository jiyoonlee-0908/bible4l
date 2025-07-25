import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ModeToggle } from '@/components/ModeToggle';

import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';

import { BibleSelector } from '@/components/BibleSelector';
import { VoicePackageInitialPopup } from '@/components/VoicePackageGuide';
import { useBible } from '@/hooks/useBible';
import { useBadges } from '@/hooks/useBadges';
import { useBookmarks } from '@/hooks/useBookmarks';


import { Storage } from '@/lib/storage';
import { Language, Settings } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { getKoreanBookName } from '@/lib/bible-books';

export default function Home() {
  const [location, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>(Storage.getSettings());

  const [showBibleSelector, setShowBibleSelector] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [fontLevel, setFontLevel] = useState(0); // -2 to +3, 0 is base
  const [showVoicePackagePopup, setShowVoicePackagePopup] = useState(false);
  
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
    setFontLevel(savedSettings.fontLevel || 0);
    
    // Check if voice package popup should be shown
    const hasShownVoicePackagePopup = localStorage.getItem('voice-package-popup-shown');
    if (!hasShownVoicePackagePopup) {
      setShowVoicePackagePopup(true);
    }
  }, []);

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



  const handleFontLevelChange = (newLevel: number) => {
    setFontLevel(newLevel);
    const newSettings = { ...settings, fontLevel: newLevel };
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
    
    // 전역 폰트 크기 적용
    const fontScaleClasses = [
      'font-scale-xs',   // -2
      'font-scale-sm',   // -1  
      'font-scale-base', // 0
      'font-scale-lg',   // 1
      'font-scale-xl',   // 2
      'font-scale-2xl'   // 3
    ];
    
    document.body.classList.remove(...fontScaleClasses);
    const scaleIndex = Math.max(0, Math.min(5, newLevel + 2));
    document.body.classList.add(fontScaleClasses[scaleIndex]);
  };

  const getFontLevelName = (level: number) => {
    const names = ['매우 작게', '작게', '기본', '크게', '매우 크게', '최대 크게'];
    return names[level + 2] || '기본';
  };

  const handleVoicePackagePopupClose = () => {
    setShowVoicePackagePopup(false);
    localStorage.setItem('voice-package-popup-shown', 'true');
  };

  const handleVoicePackageNeverShow = () => {
    setShowVoicePackagePopup(false);
    localStorage.setItem('voice-package-popup-shown', 'never');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-32">
      <Header
        onFontSizeClick={() => setShowFontSizeModal(true)}
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
          <Navigation
            currentChapter={currentChapter}
            currentVerse={currentVerse}
            onPrevious={() => navigateVerse('prev')}
            onNext={() => navigateVerse('next')}
            currentBook={getKoreanBookName(currentBook)}
            verseText={currentVerseData?.text}
            language={currentLanguage}
            primaryVerse={{
              text: currentVerseData.text,
              language: currentLanguage
            }}
            secondaryVerse={
              settings.displayMode === 'double' && currentLanguage !== 'ko' && koreanVerseData
                ? {
                    text: koreanVerseData.text,
                    language: 'ko'
                  }
                : undefined
            }
          />
        )}

        {/* Font Size Modal */}
        {showFontSizeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowFontSizeModal(false)}>
            <div className="bg-white rounded-xl p-6 m-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4 text-center">글자 크기 조절</h3>
              <div className="space-y-4">
                <div className="text-center text-slate-600">
                  현재 설정: {getFontLevelName(fontLevel)}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[-2, -1, 0, 1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleFontLevelChange(level)}
                      className={`py-2 px-2 rounded-lg transition-colors text-sm ${
                        fontLevel === level
                          ? 'bg-amber-800 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      }`}
                    >
                      {getFontLevelName(level)}
                    </button>
                  ))}
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-base">
                    미리보기: 하나님이 세상을 이처럼 사랑하사
                  </div>
                </div>
                <button
                  onClick={() => setShowFontSizeModal(false)}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <BottomNavigation
        currentPath={location}
        onNavigate={setLocation}
      />
      
      {/* Voice Package Initial Popup */}
      {showVoicePackagePopup && (
        <VoicePackageInitialPopup
          onClose={handleVoicePackagePopupClose}
          onNeverShow={handleVoicePackageNeverShow}
        />
      )}
    </div>
  );
}
