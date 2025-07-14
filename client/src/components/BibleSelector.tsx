import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Language } from '@shared/schema';

interface BibleSelectorProps {
  onSelect: (book: string, chapter: number, verse: number) => void;
  selectedLanguage: Language;
}

const BIBLE_BOOKS = {
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
    { id: 'Revelation', name: '요한계시록', chapters: 22 }
  ],
  en: [
    { id: 'Genesis', name: 'Genesis', chapters: 50 },
    { id: 'Exodus', name: 'Exodus', chapters: 40 },
    { id: 'Leviticus', name: 'Leviticus', chapters: 27 },
    { id: 'Numbers', name: 'Numbers', chapters: 36 },
    { id: 'Deuteronomy', name: 'Deuteronomy', chapters: 34 },
    { id: 'Joshua', name: 'Joshua', chapters: 24 },
    { id: 'Judges', name: 'Judges', chapters: 21 },
    { id: 'Ruth', name: 'Ruth', chapters: 4 },
    { id: '1Samuel', name: '1 Samuel', chapters: 31 },
    { id: '2Samuel', name: '2 Samuel', chapters: 24 },
    { id: '1Kings', name: '1 Kings', chapters: 22 },
    { id: '2Kings', name: '2 Kings', chapters: 25 },
    { id: '1Chronicles', name: '1 Chronicles', chapters: 29 },
    { id: '2Chronicles', name: '2 Chronicles', chapters: 36 },
    { id: 'Ezra', name: 'Ezra', chapters: 10 },
    { id: 'Nehemiah', name: 'Nehemiah', chapters: 13 },
    { id: 'Esther', name: 'Esther', chapters: 10 },
    { id: 'Job', name: 'Job', chapters: 42 },
    { id: 'Psalms', name: 'Psalms', chapters: 150 },
    { id: 'Proverbs', name: 'Proverbs', chapters: 31 },
    { id: 'Ecclesiastes', name: 'Ecclesiastes', chapters: 12 },
    { id: 'SongofSongs', name: 'Song of Songs', chapters: 8 },
    { id: 'Isaiah', name: 'Isaiah', chapters: 66 },
    { id: 'Jeremiah', name: 'Jeremiah', chapters: 52 },
    { id: 'Lamentations', name: 'Lamentations', chapters: 5 },
    { id: 'Ezekiel', name: 'Ezekiel', chapters: 48 },
    { id: 'Daniel', name: 'Daniel', chapters: 12 },
    { id: 'Hosea', name: 'Hosea', chapters: 14 },
    { id: 'Joel', name: 'Joel', chapters: 3 },
    { id: 'Amos', name: 'Amos', chapters: 9 },
    { id: 'Obadiah', name: 'Obadiah', chapters: 1 },
    { id: 'Jonah', name: 'Jonah', chapters: 4 },
    { id: 'Micah', name: 'Micah', chapters: 7 },
    { id: 'Nahum', name: 'Nahum', chapters: 3 },
    { id: 'Habakkuk', name: 'Habakkuk', chapters: 3 },
    { id: 'Zephaniah', name: 'Zephaniah', chapters: 3 },
    { id: 'Haggai', name: 'Haggai', chapters: 2 },
    { id: 'Zechariah', name: 'Zechariah', chapters: 14 },
    { id: 'Malachi', name: 'Malachi', chapters: 4 },
    { id: 'Matthew', name: 'Matthew', chapters: 28 },
    { id: 'Mark', name: 'Mark', chapters: 16 },
    { id: 'Luke', name: 'Luke', chapters: 24 },
    { id: 'John', name: 'John', chapters: 21 },
    { id: 'Acts', name: 'Acts', chapters: 28 },
    { id: 'Romans', name: 'Romans', chapters: 16 },
    { id: '1Corinthians', name: '1 Corinthians', chapters: 16 },
    { id: '2Corinthians', name: '2 Corinthians', chapters: 13 },
    { id: 'Galatians', name: 'Galatians', chapters: 6 },
    { id: 'Ephesians', name: 'Ephesians', chapters: 6 },
    { id: 'Philippians', name: 'Philippians', chapters: 4 },
    { id: 'Colossians', name: 'Colossians', chapters: 4 },
    { id: '1Thessalonians', name: '1 Thessalonians', chapters: 5 },
    { id: '2Thessalonians', name: '2 Thessalonians', chapters: 3 },
    { id: '1Timothy', name: '1 Timothy', chapters: 6 },
    { id: '2Timothy', name: '2 Timothy', chapters: 4 },
    { id: 'Titus', name: 'Titus', chapters: 3 },
    { id: 'Philemon', name: 'Philemon', chapters: 1 },
    { id: 'Hebrews', name: 'Hebrews', chapters: 13 },
    { id: 'James', name: 'James', chapters: 5 },
    { id: '1Peter', name: '1 Peter', chapters: 5 },
    { id: '2Peter', name: '2 Peter', chapters: 3 },
    { id: '1John', name: '1 John', chapters: 5 },
    { id: '2John', name: '2 John', chapters: 1 },
    { id: '3John', name: '3 John', chapters: 1 },
    { id: 'Jude', name: 'Jude', chapters: 1 },
    { id: 'Revelation', name: 'Revelation', chapters: 22 }
  ],
  zh: [
    { id: 'Genesis', name: '创世记', chapters: 50 },
    { id: 'Exodus', name: '出埃及记', chapters: 40 },
    { id: 'Matthew', name: '马太福音', chapters: 28 },
    { id: 'Mark', name: '马可福音', chapters: 16 },
    { id: 'Luke', name: '路加福音', chapters: 24 },
    { id: 'John', name: '约翰福音', chapters: 21 }
  ],
  ja: [
    { id: 'Genesis', name: '創世記', chapters: 50 },
    { id: 'Exodus', name: '出エジプト記', chapters: 40 },
    { id: 'Matthew', name: 'マタイによる福音書', chapters: 28 },
    { id: 'Mark', name: 'マルコによる福音書', chapters: 16 },
    { id: 'Luke', name: 'ルカによる福音書', chapters: 24 },
    { id: 'John', name: 'ヨハネによる福音書', chapters: 21 }
  ]
};

export function BibleSelector({ onSelect, selectedLanguage }: BibleSelectorProps) {
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedVerse, setSelectedVerse] = useState<string>('');

  // Always use Korean book names for consistency
  const books = BIBLE_BOOKS.ko;
  const selectedBookData = books.find(book => book.id === selectedBook);
  const maxChapters = selectedBookData?.chapters || 0;

  const handleSubmit = () => {
    if (selectedBook && selectedChapter && selectedVerse) {
      onSelect(selectedBook, parseInt(selectedChapter), parseInt(selectedVerse));
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-slate-700">성경 선택</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">성경책</label>
            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBook && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">장</label>
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="장" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map((chapter) => (
                    <SelectItem key={chapter} value={chapter.toString()}>
                      {chapter}장
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedChapter && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">절</label>
              <Select value={selectedVerse} onValueChange={setSelectedVerse}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="절" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((verse) => (
                    <SelectItem key={verse} value={verse.toString()}>
                      {verse}절
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {selectedBook && selectedChapter && selectedVerse && (
          <Button 
            onClick={handleSubmit} 
            className="w-full h-9 text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md font-medium"
          >
            이 구절부터 재생하기
          </Button>
        )}
        </div>
      </CardContent>
    </Card>
  );
}