import { Play, Pause, SkipBack, SkipForward, Minus, Plus, Bookmark as BookmarkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGlobalAudio } from '@/hooks/useGlobalAudio';
import { useSpeech } from '@/hooks/useSpeech';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark, Language } from '@shared/schema';

interface NavigationProps {
  currentChapter: number;
  currentVerse: number;
  onPrevious: () => void;
  onNext: () => void;
  currentBook?: string;
  verseText?: string;
  language?: string;
  primaryVerse?: { text: string; language: string };
  secondaryVerse?: { text: string; language: string };
}

export function Navigation({
  currentChapter,
  currentVerse,
  onPrevious,
  onNext,
  currentBook,
  verseText,
  language = 'ko',
  primaryVerse,
  secondaryVerse,
}: NavigationProps) {
  const { globalAudioState, toggleGlobalPlayback } = useGlobalAudio();
  const { isPlaying, speak, stop, pause, resume, settings, updateSettings } = useSpeech();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const handlePlay = () => {
    if (speechSynthesis.paused) {
      resume();
    } else if (verseText) {
      speak(verseText, {
        lang: language === 'ko' ? 'ko-KR' : language === 'en' ? 'en-US' : language === 'zh' ? 'zh-CN' : 'ja-JP',
        rate: currentSpeed,
      });
    }
  };

  const handlePause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      pause();
    }
  };

  const handleSpeedChange = (increment: number) => {
    const newSpeed = Math.max(0.5, Math.min(2.0, currentSpeed + increment));
    updateSettings({ speed: newSpeed });
  };

  const currentSpeed = settings?.speed || 1.0;

  const handleBookmarkToggle = () => {
    if (primaryVerse && currentBook) {
      const verseId = `${currentBook}.${currentChapter}.${currentVerse}`;
      const bookmark: Bookmark = {
        verseId,
        reference: `${getBookName(currentBook, language)} ${currentChapter}:${currentVerse}`,
        text: primaryVerse.text,
        language: primaryVerse.language,
        createdAt: new Date().toISOString(),
      };
      toggleBookmark(bookmark);
    }
  };

  const isCurrentVerseBookmarked = () => {
    if (!primaryVerse || !currentBook) return false;
    const verseId = `${currentBook}.${currentChapter}.${currentVerse}`;
    return isBookmarked(verseId, primaryVerse.language);
  };

  // 언어별 성경 이름 표시
  const getBookName = (bookName: string, lang: string) => {
    const bookTranslations: { [key: string]: { [key: string]: string } } = {
      '사사기': {
        'ko': '사사기',
        'en': 'Judges',
        'zh': '士師記',
        'ja': '士師記'
      },
      '창세기': {
        'ko': '창세기',
        'en': 'Genesis',
        'zh': '創世記',
        'ja': '創世記'
      },
      '출애굽기': {
        'ko': '출애굽기',
        'en': 'Exodus',
        'zh': '出埃及記',
        'ja': '出エジプト記'
      },
      '레위기': {
        'ko': '레위기',
        'en': 'Leviticus',
        'zh': '利未記',
        'ja': 'レビ記'
      },
      '민수기': {
        'ko': '민수기',
        'en': 'Numbers',
        'zh': '民數記',
        'ja': '民数記'
      },
      '신명기': {
        'ko': '신명기',
        'en': 'Deuteronomy',
        'zh': '申命記',
        'ja': '申命記'
      },
      '여호수아': {
        'ko': '여호수아',
        'en': 'Joshua',
        'zh': '約書亞記',
        'ja': 'ヨシュア記'
      },
      '룻기': {
        'ko': '룻기',
        'en': 'Ruth',
        'zh': '路得記',
        'ja': 'ルツ記'
      },
      '사무엘상': {
        'ko': '사무엘상',
        'en': '1 Samuel',
        'zh': '撒母耳記上',
        'ja': 'サムエル記上'
      },
      '사무엘하': {
        'ko': '사무엘하',
        'en': '2 Samuel',
        'zh': '撒母耳記下',
        'ja': 'サムエル記下'
      },
      '열왕기상': {
        'ko': '열왕기상',
        'en': '1 Kings',
        'zh': '列王紀上',
        'ja': '列王記上'
      },
      '열왕기하': {
        'ko': '열왕기하',
        'en': '2 Kings',
        'zh': '列王紀下',
        'ja': '列王記下'
      },
      '역대상': {
        'ko': '역대상',
        'en': '1 Chronicles',
        'zh': '歷代志上',
        'ja': '歴代志上'
      },
      '역대하': {
        'ko': '역대하',
        'en': '2 Chronicles',
        'zh': '歷代志下',
        'ja': '歴代志下'
      },
      '에스라': {
        'ko': '에스라',
        'en': 'Ezra',
        'zh': '以斯拉記',
        'ja': 'エズラ記'
      },
      '느헤미야': {
        'ko': '느헤미야',
        'en': 'Nehemiah',
        'zh': '尼希米記',
        'ja': 'ネヘミヤ記'
      },
      '에스더': {
        'ko': '에스더',
        'en': 'Esther',
        'zh': '以斯帖記',
        'ja': 'エステル記'
      },
      '욥기': {
        'ko': '욥기',
        'en': 'Job',
        'zh': '約伯記',
        'ja': 'ヨブ記'
      },
      '시편': {
        'ko': '시편',
        'en': 'Psalms',
        'zh': '詩篇',
        'ja': '詩篇'
      },
      '잠언': {
        'ko': '잠언',
        'en': 'Proverbs',
        'zh': '箴言',
        'ja': '箴言'
      },
      '전도서': {
        'ko': '전도서',
        'en': 'Ecclesiastes',
        'zh': '傳道書',
        'ja': '伝道者の書'
      },
      '아가': {
        'ko': '아가',
        'en': 'Song of Songs',
        'zh': '雅歌',
        'ja': '雅歌'
      },
      '이사야': {
        'ko': '이사야',
        'en': 'Isaiah',
        'zh': '以賽亞書',
        'ja': 'イザヤ書'
      },
      '예레미야': {
        'ko': '예레미야',
        'en': 'Jeremiah',
        'zh': '耶利米書',
        'ja': 'エレミヤ書'
      },
      '마태복음': {
        'ko': '마태복음',
        'en': 'Matthew',
        'zh': '馬太福音',
        'ja': 'マタイの福音書'
      },
      '마가복음': {
        'ko': '마가복음',
        'en': 'Mark',
        'zh': '馬可福音',
        'ja': 'マルコの福音書'
      },
      '누가복음': {
        'ko': '누가복음',
        'en': 'Luke',
        'zh': '路加福音',
        'ja': 'ルカの福音書'
      },
      '요한복음': {
        'ko': '요한복음',
        'en': 'John',
        'zh': '約翰福音',
        'ja': 'ヨハネの福音書'
      },
      '사도행전': {
        'ko': '사도행전',
        'en': 'Acts',
        'zh': '使徒行傳',
        'ja': '使徒の働き'
      },
      '로마서': {
        'ko': '로마서',
        'en': 'Romans',
        'zh': '羅馬書',
        'ja': 'ローマ人への手紙'
      },
      '고린도전서': {
        'ko': '고린도전서',
        'en': '1 Corinthians',
        'zh': '哥林多前書',
        'ja': 'コリント人への手紙第一'
      },
      '고린도후서': {
        'ko': '고린도후서',
        'en': '2 Corinthians',
        'zh': '哥林多後書',
        'ja': 'コリント人への手紙第二'
      },
      '갈라디아서': {
        'ko': '갈라디아서',
        'en': 'Galatians',
        'zh': '加拉太書',
        'ja': 'ガラテヤ人への手紙'
      },
      '에베소서': {
        'ko': '에베소서',
        'en': 'Ephesians',
        'zh': '以弗所書',
        'ja': 'エペソ人への手紙'
      },
      '빌립보서': {
        'ko': '빌립보서',
        'en': 'Philippians',
        'zh': '腓立比書',
        'ja': 'ピリピ人への手紙'
      },
      '골로새서': {
        'ko': '골로새서',
        'en': 'Colossians',
        'zh': '歌羅西書',
        'ja': 'コロサイ人への手紙'
      },
      '데살로니가전서': {
        'ko': '데살로니가전서',
        'en': '1 Thessalonians',
        'zh': '帖撒羅尼迦前書',
        'ja': 'テサロニケ人への手紙第一'
      },
      '데살로니가후서': {
        'ko': '데살로니가후서',
        'en': '2 Thessalonians',
        'zh': '帖撒羅尼迦後書',
        'ja': 'テサロニケ人への手紙第二'
      },
      '디모데전서': {
        'ko': '디모데전서',
        'en': '1 Timothy',
        'zh': '提摩太前書',
        'ja': 'テモテへの手紙第一'
      },
      '디모데후서': {
        'ko': '디모데후서',
        'en': '2 Timothy',
        'zh': '提摩太後書',
        'ja': 'テモテへの手紙第二'
      },
      '디도서': {
        'ko': '디도서',
        'en': 'Titus',
        'zh': '提多書',
        'ja': 'テトスへの手紙'
      },
      '빌레몬서': {
        'ko': '빌레몬서',
        'en': 'Philemon',
        'zh': '腓利門書',
        'ja': 'ピレモンへの手紙'
      },
      '히브리서': {
        'ko': '히브리서',
        'en': 'Hebrews',
        'zh': '希伯來書',
        'ja': 'ヘブル人への手紙'
      },
      '야고보서': {
        'ko': '야고보서',
        'en': 'James',
        'zh': '雅各書',
        'ja': 'ヤコブの手紙'
      },
      '베드로전서': {
        'ko': '베드로전서',
        'en': '1 Peter',
        'zh': '彼得前書',
        'ja': 'ペテロの手紙第一'
      },
      '베드로후서': {
        'ko': '베드로후서',
        'en': '2 Peter',
        'zh': '彼得後書',
        'ja': 'ペテロの手紙第二'
      },
      '요한일서': {
        'ko': '요한일서',
        'en': '1 John',
        'zh': '約翰一書',
        'ja': 'ヨハネの手紙第一'
      },
      '요한이서': {
        'ko': '요한이서',
        'en': '2 John',
        'zh': '約翰二書',
        'ja': 'ヨハネの手紙第二'
      },
      '요한삼서': {
        'ko': '요한삼서',
        'en': '3 John',
        'zh': '約翰三書',
        'ja': 'ヨハネの手紙第三'
      },
      '유다서': {
        'ko': '유다서',
        'en': 'Jude',
        'zh': '猶大書',
        'ja': 'ユダの手紙'
      },
      '요한계시록': {
        'ko': '요한계시록',
        'en': 'Revelation',
        'zh': '啟示錄',
        'ja': 'ヨハネの黙示録'
      }
    };

    return bookTranslations[bookName]?.[lang] || bookName;
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <CardContent className="p-0">
        {/* 성경 정보 헤더 - 갈색 배경 */}
        <div className="bg-amber-800 text-white p-4 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">
              {getBookName(currentBook || '', language)} {currentChapter}:{currentVerse}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={handleBookmarkToggle}
              className="p-2 bg-amber-700 hover:bg-amber-600 rounded-full transition-colors"
            >
              <BookmarkIcon 
                className={`h-5 w-5 ${isCurrentVerseBookmarked() ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} 
              />
            </Button>
          </div>
        </div>

        {/* 성경 구절 표시 */}
        {primaryVerse && (
          <div className="p-6 space-y-4">
            <div className="text-sm text-slate-600 mb-2">
              {primaryVerse.language === 'ko' ? '한국어' : 
               primaryVerse.language === 'en' ? 'English' :
               primaryVerse.language === 'zh' ? '中文' : '日本語'}
            </div>
            <div className="text-lg leading-relaxed text-slate-800 font-medium">
              {primaryVerse.text}
            </div>
            
            {secondaryVerse && (
              <div className="mt-4 pl-4 border-l-4 border-amber-400">
                <div className="text-sm text-slate-600 mb-2">
                  {secondaryVerse.language === 'ko' ? '한국어' : 
                   secondaryVerse.language === 'en' ? 'English' :
                   secondaryVerse.language === 'zh' ? '中文' : '日本語'}
                </div>
                <div className="text-base leading-relaxed text-slate-700">
                  {secondaryVerse.text}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 오디오 컨트롤 - 한 줄로 배치 */}
        <div className="p-6 pt-0">
          <div className="flex items-center justify-between">
            {/* 이전 버튼 */}
            <Button
              variant="ghost"
              onClick={onPrevious}
              className="p-3 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors"
            >
              <SkipBack className="h-5 w-5 text-slate-600" />
            </Button>

            {/* 재생 버튼 */}
            <Button
              variant="ghost"
              onClick={handlePlay}
              className="p-4 bg-amber-800 hover:bg-amber-700 rounded-full transition-colors"
            >
              <Play className="h-6 w-6 text-white" />
            </Button>

            {/* 일시정지 버튼 */}
            <Button
              variant="ghost"
              onClick={handlePause}
              className="p-3 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors"
            >
              <Pause className="h-5 w-5 text-slate-600" />
            </Button>

            {/* 다음 버튼 */}
            <Button
              variant="ghost"
              onClick={onNext}
              className="p-3 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors"
            >
              <SkipForward className="h-5 w-5 text-slate-600" />
            </Button>

            {/* 속도 조절 */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => handleSpeedChange(-0.25)}
                className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors"
                disabled={currentSpeed <= 0.5}
              >
                <Minus className="h-4 w-4 text-slate-600" />
              </Button>
              <div className="text-center min-w-[50px]">
                <div className="text-sm font-medium text-slate-800">
                  {currentSpeed.toFixed(2)}x
                </div>
                <div className="text-xs text-slate-500">속도</div>
              </div>
              <Button
                variant="ghost"
                onClick={() => handleSpeedChange(0.25)}
                className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors"
                disabled={currentSpeed >= 2.0}
              >
                <Plus className="h-4 w-4 text-slate-600" />
              </Button>
            </div>


          </div>
        </div>
      </CardContent>
    </Card>
  );
}