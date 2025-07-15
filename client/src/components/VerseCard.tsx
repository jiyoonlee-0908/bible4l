import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Star, Share2 } from 'lucide-react';
import { BibleVerse } from '@/types/bible';
import { Language } from '@shared/schema';
import { useSpeech } from '@/hooks/useSpeech';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface VerseCardProps {
  verse: BibleVerse;
  language: Language;
  mode: 'single' | 'double';
  koreanVerse?: BibleVerse;
}

export function VerseCard({ verse, language, mode, koreanVerse }: VerseCardProps) {
  const { isPlaying, speak, stop } = useSpeech();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();

  // Save reading statistics when viewing verse
  useEffect(() => {
    const saveReadingStats = () => {
      const listeningStats = JSON.parse(localStorage.getItem('listeningStats') || '[]');
      const verseKey = `${verse.bookId}-${verse.chapterId}-${verse.verseId}-${language}`;
      
      // Check if this exact verse in this language was already recorded recently (within 5 minutes)
      const recentRecord = listeningStats.find((stat: any) => {
        const statKey = `${stat.book}-${stat.chapter}-${stat.verse}-${stat.language}`;
        const timeDiff = new Date().getTime() - new Date(stat.timestamp).getTime();
        return statKey === verseKey && timeDiff < 5 * 60 * 1000; // 5 minutes
      });
      
      // If there's a listen record for the same verse, don't add read record
      const hasListenRecord = listeningStats.some((stat: any) => 
        stat.book === verse.bookId && 
        stat.chapter === parseInt(verse.chapterId) && 
        stat.verse === verse.verseId && 
        stat.language === language && 
        stat.type === 'listen'
      );
      
      if (!recentRecord && !hasListenRecord) {
        const newStat = {
          book: verse.bookId,
          chapter: parseInt(verse.chapterId),
          verse: verse.verseId,
          language: language,
          timestamp: new Date().toISOString(),
          duration: 1, // 1 minute for reading
          type: 'read'
        };
        listeningStats.push(newStat);
        localStorage.setItem('listeningStats', JSON.stringify(listeningStats));
      }
    };

    // Save after 3 seconds of viewing
    const timer = setTimeout(saveReadingStats, 3000);
    return () => clearTimeout(timer);
  }, [verse.bookId, verse.chapterId, verse.verseId, language]);

  const handlePlay = () => {
    if (isPlaying) {
      stop();
    } else {
      const voiceMapping = {
        ko: 'ko-KR',
        en: 'en-US',
        zh: 'zh-CN', 
        ja: 'ja-JP'
      };
      
      const langCode = voiceMapping[language] || 'en-US';
      speak(verse.text, { rate: 1.0, lang: langCode });
    }
  };

  const handleBookmark = () => {
    const bookmark = {
      id: `${verse.id}-${language}`,
      verseId: verse.id,
      reference: verse.reference,
      text: verse.text,
      language: language,
      timestamp: new Date().toISOString(),
    };
    
    toggleBookmark(bookmark);
    
    toast({
      title: isBookmarked(verse.id, language) ? '북마크에서 제거됨' : '북마크에 추가됨',
      description: verse.reference,
    });
  };

  const handleShare = async () => {
    const shareText = `${verse.reference}\n\n${verse.text}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: verse.reference,
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: '클립보드에 복사됨',
          description: verse.reference,
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const getLanguageLabel = (lang: Language) => {
    const labels = {
      ko: '한국어',
      en: 'English',
      zh: '中文',
      ja: '日本語'
    };
    return labels[lang];
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Verse Header */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-dynamic-heading font-semibold">{verse.reference}</h3>
            <p className="text-amber-100 text-sm">성경</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full"
            >
              <Star 
                className={`h-5 w-5 ${
                  isBookmarked(verse.id, language) 
                    ? 'text-amber-300 fill-amber-300' 
                    : 'text-white'
                }`} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full"
            >
              <Share2 className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Verse Content */}
      <CardContent className="p-6">
        <div className="space-y-4">
          {mode === 'single' ? (
            <div className="text-slate-800 text-dynamic leading-relaxed">
              {verse.text}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-slate-800 text-dynamic leading-relaxed">
                <div className="text-xs text-slate-500 mb-1">{getLanguageLabel(language)}</div>
                {verse.text}
              </div>
              
              {koreanVerse && (
                <div className="text-slate-600 text-sm leading-relaxed pt-3 border-t border-amber-100">
                  <div className="text-xs text-amber-600 mb-1">한국어</div>
                  {koreanVerse.text}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Audio Controls */}
        <div className="mt-6 flex items-center justify-center space-x-4">
          <Button
            onClick={handlePlay}
            className="bg-amber-700 hover:bg-amber-800 text-white rounded-full px-6 py-3 shadow-lg transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center space-x-2">
              {isPlaying ? (
                <Pause className="h-4 w-4 text-amber-600" />
              ) : (
                <Play className="h-4 w-4 text-amber-600" />
              )}
              <span className="text-sm font-medium">
                {isPlaying ? '일시정지' : '듣기'}
              </span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}