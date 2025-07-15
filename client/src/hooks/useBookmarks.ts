import { useState, useEffect } from 'react';
import { Bookmark, Language } from '@shared/schema';
import { Storage } from '@/lib/storage';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(Storage.getBookmarks());
  }, []);

  const addBookmark = (bookmark: Bookmark) => {
    Storage.addBookmark(bookmark);
    const updatedBookmarks = Storage.getBookmarks();
    setBookmarks(updatedBookmarks);
    
    // Check for bookmark badges
    const badgeEvent = new CustomEvent('badge-check', {
      detail: { type: 'bookmark', value: updatedBookmarks.length }
    });
    window.dispatchEvent(badgeEvent);
  };

  const removeBookmark = (verseId: string, language: Language) => {
    Storage.removeBookmark(verseId, language);
    setBookmarks(Storage.getBookmarks());
  };

  const isBookmarked = (verseId: string, language: Language) => {
    return Storage.isBookmarked(verseId, language);
  };

  const toggleBookmark = (bookmark: Bookmark) => {
    if (isBookmarked(bookmark.verseId, bookmark.language)) {
      removeBookmark(bookmark.verseId, bookmark.language);
    } else {
      addBookmark(bookmark);
    }
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
}
