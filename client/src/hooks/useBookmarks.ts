import React, { useState, useEffect } from 'react';
import { Bookmark, Language } from '@shared/schema';
import { Storage } from '@/lib/storage';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(Storage.getBookmarks());
  }, []);

  const addBookmark = (bookmark: Bookmark) => {
    Storage.addBookmark(bookmark);
    setBookmarks(Storage.getBookmarks());
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
