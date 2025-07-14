import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BibleApi } from '@/lib/bible-api';
import { BibleVerse } from '@/types/bible';
import { Language } from '@shared/schema';
import { Storage } from '@/lib/storage';

export function useBible() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');
  const [currentBook, setCurrentBook] = useState<string>('John');
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

  const { data: currentVerseData } = useQuery({
    queryKey: ['bible-verse', currentBook, currentChapter, currentVerse, currentLanguage],
    queryFn: () => BibleApi.getVerse(currentBook, currentChapter, currentVerse, currentLanguage),
    enabled: !!currentBook && !!currentChapter && !!currentVerse,
  });

  const { data: verses } = useQuery({
    queryKey: ['bible-verses', currentBook, currentChapter, currentLanguage],
    queryFn: () => BibleApi.getVerses(currentBook, currentChapter, currentLanguage),
    enabled: !!currentBook && !!currentChapter,
  });

  const navigateVerse = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (currentVerse < 31) { // Assume max 31 verses per chapter
        setCurrentVerse(prev => prev + 1);
        Storage.saveCurrentVerse(currentBook, currentChapter, currentVerse + 1);
      } else {
        // Move to next chapter
        setCurrentChapter(prev => prev + 1);
        setCurrentVerse(1);
        Storage.saveCurrentVerse(currentBook, currentChapter + 1, 1);
      }
    } else {
      if (currentVerse > 1) {
        setCurrentVerse(prev => prev - 1);
        Storage.saveCurrentVerse(currentBook, currentChapter, currentVerse - 1);
      } else if (currentChapter > 1) {
        // Move to previous chapter
        setCurrentChapter(prev => prev - 1);
        setCurrentVerse(31); // Start from end of previous chapter
        Storage.saveCurrentVerse(currentBook, currentChapter - 1, 31);
      }
    }
  };

  const setVerse = useCallback((bookId: string, chapter: number, verse: number) => {
    setCurrentBook(bookId);
    setCurrentChapter(chapter);
    setCurrentVerse(verse);
    Storage.saveCurrentVerse(bookId, chapter, verse);
  }, []);

  const memoizedSetCurrentLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
  }, []);

  return {
    currentLanguage,
    setCurrentLanguage: memoizedSetCurrentLanguage,
    currentBook,
    currentChapter,
    currentVerse,
    currentVerseData,
    verses,
    navigateVerse,
    setVerse,
  };
}
