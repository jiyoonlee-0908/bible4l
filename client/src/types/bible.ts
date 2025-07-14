export interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
  nameLong: string;
}

export interface BibleChapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
}

export interface BibleVerse {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
  verseId: number;
  text: string;
}

export interface BibleApiResponse<T> {
  data: T;
  meta?: {
    fums?: string;
    fumsId?: string;
    fumsJsInclude?: string;
    fumsJs?: string;
    fumsNoScript?: string;
  };
}
