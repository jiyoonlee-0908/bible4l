import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BibleApi } from '@/lib/bible-api';
import { BibleVerse } from '@/types/bible';
import { Language } from '@shared/schema';
import { Storage } from '@/lib/storage';

export function useBible() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');
  const [currentBook, setCurrentBook] = useState<string>('Genesis');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [currentVerse, setCurrentVerse] = useState<number>(1);

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

  // Always fetch Korean verse for cross-display mode
  const { data: koreanVerseData } = useQuery({
    queryKey: ['bible-verse-korean', currentBook, currentChapter, currentVerse],
    queryFn: () => BibleApi.getVerse(currentBook, currentChapter, currentVerse, 'ko'),
    enabled: !!currentBook && !!currentChapter && !!currentVerse && currentLanguage !== 'ko',
  });

  const { data: verses } = useQuery({
    queryKey: ['bible-verses', currentBook, currentChapter, currentLanguage],
    queryFn: () => BibleApi.getVerses(currentBook, currentChapter, currentLanguage),
    enabled: !!currentBook && !!currentChapter,
  });

  const navigateVerse = (direction: 'prev' | 'next') => {
    const newVerse = direction === 'next' ? currentVerse + 1 : currentVerse - 1;
    const newChapter = direction === 'next' ? currentChapter + 1 : currentChapter - 1;
    
    if (direction === 'next') {
      if (verses && newVerse <= verses.length) {
        // Stay in current chapter
        setCurrentVerse(newVerse);
        Storage.saveCurrentVerse(currentBook, currentChapter, newVerse);
      } else {
        // Move to next chapter
        setCurrentChapter(newChapter);
        setCurrentVerse(1);
        Storage.saveCurrentVerse(currentBook, newChapter, 1);
      }
    } else {
      if (currentVerse > 1) {
        setCurrentVerse(newVerse);
        Storage.saveCurrentVerse(currentBook, currentChapter, newVerse);
      } else if (currentChapter > 1) {
        // Move to previous chapter - we'll need to find the last verse
        setCurrentChapter(newChapter);
        setCurrentVerse(1); // Will be updated when verses load
        Storage.saveCurrentVerse(currentBook, newChapter, 1);
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
    koreanVerseData,
    verses,
    navigateVerse,
    setVerse,
  };
}
