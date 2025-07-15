// 성경책 정보 및 유틸리티 함수
export const BIBLE_BOOKS = {
  ko: [
    { id: 'Genesis', name: '창세기', chapters: 50 },
    { id: 'Exodus', name: '출애굽기', chapters: 40 },
    { id: 'Leviticus', name: '레위기', chapters: 27 },
    { id: 'Numbers', name: '민수기', chapters: 36 },
    { id: 'Deuteronomy', name: '신명기', chapters: 34 },
    { id: 'Joshua', name: '여호수아', chapters: 24 },
    { id: 'Judges', name: '사사기', chapters: 21 },
    { id: 'Ruth', name: '룻기', chapters: 4 },
    { id: '1Samuel', name: '사무엘상', chapters: 31 },
    { id: '2Samuel', name: '사무엘하', chapters: 24 },
    { id: '1Kings', name: '열왕기상', chapters: 22 },
    { id: '2Kings', name: '열왕기하', chapters: 25 },
    { id: '1Chronicles', name: '역대상', chapters: 29 },
    { id: '2Chronicles', name: '역대하', chapters: 36 },
    { id: 'Ezra', name: '에스라', chapters: 10 },
    { id: 'Nehemiah', name: '느헤미야', chapters: 13 },
    { id: 'Esther', name: '에스더', chapters: 10 },
    { id: 'Job', name: '욥기', chapters: 42 },
    { id: 'Psalms', name: '시편', chapters: 150 },
    { id: 'Proverbs', name: '잠언', chapters: 31 },
    { id: 'Ecclesiastes', name: '전도서', chapters: 12 },
    { id: 'SongofSongs', name: '아가', chapters: 8 },
    { id: 'Isaiah', name: '이사야', chapters: 66 },
    { id: 'Jeremiah', name: '예레미야', chapters: 52 },
    { id: 'Lamentations', name: '예레미야애가', chapters: 5 },
    { id: 'Ezekiel', name: '에스겔', chapters: 48 },
    { id: 'Daniel', name: '다니엘', chapters: 12 },
    { id: 'Hosea', name: '호세아', chapters: 14 },
    { id: 'Joel', name: '요엘', chapters: 3 },
    { id: 'Amos', name: '아모스', chapters: 9 },
    { id: 'Obadiah', name: '오바댜', chapters: 1 },
    { id: 'Jonah', name: '요나', chapters: 4 },
    { id: 'Micah', name: '미가', chapters: 7 },
    { id: 'Nahum', name: '나훔', chapters: 3 },
    { id: 'Habakkuk', name: '하박국', chapters: 3 },
    { id: 'Zephaniah', name: '스바냐', chapters: 3 },
    { id: 'Haggai', name: '학개', chapters: 2 },
    { id: 'Zechariah', name: '스가랴', chapters: 14 },
    { id: 'Malachi', name: '말라기', chapters: 4 },
    { id: 'Matthew', name: '마태복음', chapters: 28 },
    { id: 'Mark', name: '마가복음', chapters: 16 },
    { id: 'Luke', name: '누가복음', chapters: 24 },
    { id: 'John', name: '요한복음', chapters: 21 },
    { id: 'Acts', name: '사도행전', chapters: 28 },
    { id: 'Romans', name: '로마서', chapters: 16 },
    { id: '1Corinthians', name: '고린도전서', chapters: 16 },
    { id: '2Corinthians', name: '고린도후서', chapters: 13 },
    { id: 'Galatians', name: '갈라디아서', chapters: 6 },
    { id: 'Ephesians', name: '에베소서', chapters: 6 },
    { id: 'Philippians', name: '빌립보서', chapters: 4 },
    { id: 'Colossians', name: '골로새서', chapters: 4 },
    { id: '1Thessalonians', name: '데살로니가전서', chapters: 5 },
    { id: '2Thessalonians', name: '데살로니가후서', chapters: 3 },
    { id: '1Timothy', name: '디모데전서', chapters: 6 },
    { id: '2Timothy', name: '디모데후서', chapters: 4 },
    { id: 'Titus', name: '디도서', chapters: 3 },
    { id: 'Philemon', name: '빌레몬서', chapters: 1 },
    { id: 'Hebrews', name: '히브리서', chapters: 13 },
    { id: 'James', name: '야고보서', chapters: 5 },
    { id: '1Peter', name: '베드로전서', chapters: 5 },
    { id: '2Peter', name: '베드로후서', chapters: 3 },
    { id: '1John', name: '요한일서', chapters: 5 },
    { id: '2John', name: '요한이서', chapters: 1 },
    { id: '3John', name: '요한삼서', chapters: 1 },
    { id: 'Jude', name: '유다서', chapters: 1 },
    { id: 'Revelation', name: '요한계시록', chapters: 22 },
  ],
};

/**
 * 성경책 ID를 한국어 이름으로 변환
 */
export function getKoreanBookName(bookId: string): string {
  const book = BIBLE_BOOKS.ko.find(b => b.id === bookId);
  return book ? book.name : bookId;
}

/**
 * 성경책 ID의 총 장 수를 반환
 */
export function getBookChapters(bookId: string): number {
  const book = BIBLE_BOOKS.ko.find(b => b.id === bookId);
  return book ? book.chapters : 1;
}