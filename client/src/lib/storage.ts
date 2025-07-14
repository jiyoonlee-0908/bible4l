import { Bookmark, Settings, Language } from '@shared/schema';

const STORAGE_KEYS = {
  bookmarks: 'bible-audio-bookmarks',
  settings: 'bible-audio-settings',
  currentVerse: 'bible-audio-current-verse',
} as const;

export class Storage {
  static getBookmarks(): Bookmark[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.bookmarks);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveBookmarks(bookmarks: Bookmark[]): void {
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
  }

  static addBookmark(bookmark: Bookmark): void {
    const bookmarks = this.getBookmarks();
    const exists = bookmarks.find(b => b.verseId === bookmark.verseId && b.language === bookmark.language);
    
    if (!exists) {
      bookmarks.push(bookmark);
      this.saveBookmarks(bookmarks);
    }
  }

  static removeBookmark(verseId: string, language: Language): void {
    const bookmarks = this.getBookmarks();
    const filtered = bookmarks.filter(b => !(b.verseId === verseId && b.language === language));
    this.saveBookmarks(filtered);
  }

  static isBookmarked(verseId: string, language: Language): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(b => b.verseId === verseId && b.language === language);
  }

  static getSettings(): Settings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.settings);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fall through to default
    }

    const defaultSettings: Settings = {
      selectedLanguage: 'ko',
      displayMode: 'single',
      playbackSpeed: 1.0,
      autoPlay: false,
    };

    this.saveSettings(defaultSettings);
    return defaultSettings;
  }

  static saveSettings(settings: Settings): void {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }

  static getCurrentVerse(): { bookId: string; chapter: number; verse: number } | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.currentVerse);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static saveCurrentVerse(bookId: string, chapter: number, verse: number): void {
    localStorage.setItem(STORAGE_KEYS.currentVerse, JSON.stringify({ bookId, chapter, verse }));
  }
}
