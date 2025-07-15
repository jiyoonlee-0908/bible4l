import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { BookmarksList } from '@/components/BookmarksList';
import { FontSizeModal } from '@/components/FontSizeModal';
import { BottomNavigation } from '@/components/BottomNavigation';

import { useBookmarks } from '@/hooks/useBookmarks';
import { useBible } from '@/hooks/useBible';
import { Storage } from '@/lib/storage';
import { Bookmark } from '@shared/schema';

export default function Bookmarks() {
  const [location, setLocation] = useLocation();
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [fontLevel, setFontLevel] = useState(0);
  const { bookmarks, removeBookmark } = useBookmarks();
  const { setVerse } = useBible();

  useEffect(() => {
    const savedSettings = Storage.getSettings();
    setFontLevel(savedSettings.fontLevel || 0);
  }, []);

  const handleSelectBookmark = (bookmark: Bookmark) => {
    // Parse the verse reference to navigate to it
    const parts = bookmark.verseId.split('.');
    if (parts.length >= 3) {
      const bookId = parts[0];
      const chapter = parseInt(parts[1]);
      const verse = parseInt(parts[2]);
      
      setVerse(bookId, chapter, verse);
      setLocation('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-32">
      <Header
        onFontSizeClick={() => setShowFontSizeModal(true)}
        onSettingsClick={() => setLocation('/settings')}
      />
      
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <BookmarksList
          bookmarks={bookmarks}
          onRemoveBookmark={removeBookmark}
          onSelectBookmark={handleSelectBookmark}
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
