import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { BookmarksList } from '@/components/BookmarksList';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useBible } from '@/hooks/useBible';
import { Bookmark } from '@shared/schema';

export default function Bookmarks() {
  const [location, setLocation] = useLocation();
  const { bookmarks, removeBookmark } = useBookmarks();
  const { setVerse } = useBible();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        onBookmarksClick={() => setLocation('/bookmarks')}
        onSettingsClick={() => setLocation('/settings')}
      />
      
      <div className="max-w-md mx-auto px-4 py-6">
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
    </div>
  );
}
