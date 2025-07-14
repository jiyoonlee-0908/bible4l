import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, ChevronDown, ChevronUp } from 'lucide-react';

interface BibleGridProps {
  listeningStats: any[];
}

export function BibleGrid({ listeningStats }: BibleGridProps) {
  const [expanded, setExpanded] = useState(false);

  // Bible books in order
  const bibleBooks = [
    // Old Testament
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    // New Testament
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
    '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
    '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
    'Jude', 'Revelation'
  ];

  // Group listening stats by book and language
  const bookStats = listeningStats.reduce((acc, stat) => {
    const book = stat.book;
    if (!acc[book]) {
      acc[book] = { languages: new Set(), totalTime: 0 };
    }
    acc[book].languages.add(stat.language);
    acc[book].totalTime += stat.duration;
    return acc;
  }, {} as Record<string, { languages: Set<string>, totalTime: number }>);

  const getLanguageFlag = (lang: string) => {
    const flags: Record<string, string> = {
      ko: '🇰🇷',
      en: '🇺🇸', 
      zh: '🇨🇳',
      ja: '🇯🇵'
    };
    return flags[lang] || '📖';
  };

  const getBookProgress = (book: string) => {
    const stats = bookStats[book];
    if (!stats) return { listened: false, languages: [], totalTime: 0 };
    
    return {
      listened: true,
      languages: Array.from(stats.languages),
      totalTime: stats.totalTime
    };
  };

  const listenedBooks = Object.keys(bookStats).length;
  const totalBooks = bibleBooks.length;
  const completionRate = ((listenedBooks / totalBooks) * 100).toFixed(1);

  return (
    <Card className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <CardHeader 
        className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="text-lg font-semibold text-indigo-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            성경 전체 진도
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-indigo-800 text-indigo-50">
              {listenedBooks}/{totalBooks} ({completionRate}%)
            </Badge>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CardTitle>
      </CardHeader>
      
      {expanded && (
        <CardContent className="p-4">
          <div className="grid grid-cols-6 gap-1 text-xs">
            {bibleBooks.map((book, index) => {
              const progress = getBookProgress(book);
              const isOldTestament = index < 39;
              
              return (
                <div
                  key={book}
                  className={`
                    relative p-1 rounded border text-center transition-all hover:scale-110 cursor-pointer
                    ${progress.listened 
                      ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-300 shadow-sm' 
                      : isOldTestament 
                        ? 'bg-slate-100 border-slate-200 hover:bg-slate-150' 
                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    }
                  `}
                  title={`${book}${progress.listened ? ` - ${progress.totalTime}분` : ' - 미청취'}`}
                >
                  <div className="truncate text-[10px] font-medium mb-0.5">
                    {book.replace(/\d+\s/, '')}
                  </div>
                  
                  {progress.listened && (
                    <div className="flex justify-center gap-0.5 flex-wrap">
                      {progress.languages.slice(0, 2).map(lang => (
                        <span key={lang} className="text-[8px]">
                          {getLanguageFlag(lang)}
                        </span>
                      ))}
                      {progress.languages.length > 2 && (
                        <span className="text-[8px] text-slate-600">+{progress.languages.length - 2}</span>
                      )}
                    </div>
                  )}
                  
                  {!progress.listened && (
                    <div className="text-[8px] text-slate-400">
                      {isOldTestament ? '구약' : '신약'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-br from-green-100 to-green-200 border border-green-300 rounded"></div>
              <span className="text-slate-600">청취함</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded"></div>
              <span className="text-slate-600">구약 (미청취)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
              <span className="text-slate-600">신약 (미청취)</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}