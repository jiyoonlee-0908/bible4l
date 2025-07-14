import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BibleApi } from '@/lib/bible-api';
import { BibleBook, BibleVerse } from '@/types/bible';
import { Language, languageConfig } from '@shared/schema';
import { Storage } from '@/lib/storage';

export function useBible() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');
  const [currentBook, setCurrentBook] = useState<string>('JHN'); // John
  const [currentChapter, setCurrentChapter] = useState<number>(3);
  const [currentVerse, setCurrentVerse] = useState<number>(16);

  useEffect(() => {
    const settings = Storage.getSettings();
    setCurrentLanguage(settings.selectedLanguage);
    
    const saved = Storage.getCurrentVerse();
    if (saved) {
      setCurrentBook(saved.bookId);
      setCurrentChapter(saved.chapter);
      setCurrentVerse(saved.verse);
    }
  }, []);

  const bibleId = languageConfig[currentLanguage].bibleId;

  const { data: books } = useQuery({
    queryKey: ['bible-books', bibleId],
    queryFn: () => BibleApi.getBooks(bibleId),
    enabled: !!bibleId,
  });

  const { data: verses } = useQuery({
    queryKey: ['bible-verses', bibleId, currentBook, currentChapter],
    queryFn: () => BibleApi.getVerses(bibleId, `${currentBook}.${currentChapter}`),
    enabled: !!bibleId && !!currentBook && !!currentChapter,
  });

  const currentVerseData = verses?.find(v => v.verseId === currentVerse);

  const navigateVerse = (direction: 'prev' | 'next') => {
    if (!verses) return;

    const currentIndex = verses.findIndex(v => v.verseId === currentVerse);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < verses.length) {
      const newVerse = verses[newIndex].verseId;
      setCurrentVerse(newVerse);
      Storage.saveCurrentVerse(currentBook, currentChapter, newVerse);
    } else if (direction === 'next' && newIndex >= verses.length) {
      // Move to next chapter
      setCurrentChapter(prev => prev + 1);
      setCurrentVerse(1);
    } else if (direction === 'prev' && newIndex < 0 && currentChapter > 1) {
      // Move to previous chapter
      setCurrentChapter(prev => prev - 1);
      // We'll need to fetch the previous chapter to get the last verse
    }
  };

  const setVerse = (bookId: string, chapter: number, verse: number) => {
    setCurrentBook(bookId);
    setCurrentChapter(chapter);
    setCurrentVerse(verse);
    Storage.saveCurrentVerse(bookId, chapter, verse);
  };

  return {
    currentLanguage,
    setCurrentLanguage,
    currentBook,
    currentChapter,
    currentVerse,
    currentVerseData,
    books,
    verses,
    navigateVerse,
    setVerse,
    bibleId,
  };
}
