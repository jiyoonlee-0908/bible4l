import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Star, Share2, Minus, Plus } from 'lucide-react';
import { BibleVerse } from '@/types/bible';
import { Language } from '@shared/schema';
import { useSpeech } from '@/hooks/useSpeech';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useSmartTTS } from '@/hooks/useSmartTTS';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface VerseCardProps {
  verse: BibleVerse;
  language: Language;
  mode: 'single' | 'double';
  koreanVerse?: BibleVerse;
}

export function VerseCard({ verse, language, mode, koreanVerse }: VerseCardProps) {
  const { audioState, speak, toggle, stop, setSpeed, setPitch } = useSpeech();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();
  const { speakSmart, isReady } = useSmartTTS();

  // Save reading statistics when viewing verse
  useEffect(() => {
    const saveReadingStats = () => {
      const listeningStats = JSON.parse(localStorage.getItem('listeningStats') || '[]');
      const verseKey = `${verse.bookId}-${verse.chapterId}-${verse.verseId}-${language}`;
      
      // Check if this exact verse in this language was already recorded recently (within 5 minutes)
      // Also prioritize home reading over player listening for the same verse
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

  const saveListeningStats = () => {
    const listeningStats = JSON.parse(localStorage.getItem('listeningStats') || '[]');
    const newStat = {
      book: verse.bookId,
      chapter: parseInt(verse.chapterId),
      verse: verse.verseId,
      language: language,
      timestamp: new Date().toISOString(),
      duration: 2, // 2 minutes for listening
      type: 'listen'
    };
    listeningStats.push(newStat);
    localStorage.setItem('listeningStats', JSON.stringify(listeningStats));
  };

  const handlePlay = () => {
    if (audioState.isPlaying) {
      toggle();
    } else {
      // Smart TTS를 우선 사용, 준비되지 않았으면 기본 TTS 사용
      if (isReady && mode === 'single') {
        speakSmart(verse.text, language, {
          rate: 0.9,
          volume: 0.8,
          onEnd: () => {
            // 듣기 통계 저장
            saveListeningStats();
          }
        });
      } else if (mode === 'double' && koreanVerse) {
        // For cross mode, speak first language then Korean with appropriate voices
        speakCrossMode(verse, koreanVerse, language);
      } else {
        // Single mode - speak only the current verse
        const voiceMapping = {
          ko: 'ko-KR',
          en: 'en-US',
          zh: 'zh-CN', 
          ja: 'ja-JP'
        };
        
        const langCode = voiceMapping[language] || 'en-US';
        speak(verse.text, { rate: audioState.speed, lang: langCode });
      }
    }
  };

  const speakCrossMode = (primaryVerse: BibleVerse, koreanVerse: BibleVerse, primaryLang: Language) => {
    const voiceMapping = {
      ko: 'ko-KR',
      en: 'en-US',
      zh: 'zh-CN', 
      ja: 'ja-JP'
    };

    // First speak in the primary language, then Korean when finished
    const primaryLangCode = voiceMapping[primaryLang] || 'en-US';
    speak(primaryVerse.text, { 
      rate: audioState.speed, 
      lang: primaryLangCode,
      onEnd: () => {
        // Speak Korean after the first language finishes
        speak(koreanVerse.text, { rate: audioState.speed, lang: 'ko-KR' });
      }
    });
  };

  const handleBookmark = () => {
    const bookmark = {
      id: `${verse.id}-${language}`,
      verseId: verse.id,
      reference: verse.reference,
      text: verse.text,
      language,
      createdAt: new Date().toISOString(),
    };
    
    toggleBookmark(bookmark);
    toast({
      title: isBookmarked(verse.id, language) ? '북마크 제거됨' : '북마크 추가됨',
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

  const adjustSpeed = (delta: number) => {
    const newSpeed = Math.max(0.5, Math.min(1.5, audioState.speed + delta));
    setSpeed(newSpeed);
  };

  const adjustPitch = (delta: number) => {
    const newPitch = Math.max(-4, Math.min(4, audioState.pitch + delta));
    setPitch(newPitch);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = audioState.duration > 0 
    ? (audioState.currentPosition / audioState.duration) * 100 
    : 0;

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
                <div className="text-slate-600 text-dynamic leading-relaxed border-l-4 border-amber-200 pl-4">
                  <div className="text-xs text-slate-500 mb-1">한국어</div>
                  {koreanVerse.text}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Audio Controls */}
      <div className="bg-slate-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePlay}
              className="w-12 h-12 bg-amber-800 hover:bg-amber-900 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {audioState.isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white ml-1" />
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => adjustSpeed(-0.1)}
                    className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full"
                  >
                    <Minus className="h-2 w-2 text-slate-600" />
                  </Button>
                  <span className="text-xs font-medium text-slate-700 min-w-8 text-center">
                    {audioState.speed.toFixed(1)}x
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => adjustSpeed(0.1)}
                    className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full"
                  >
                    <Plus className="h-2 w-2 text-slate-600" />
                  </Button>
                </div>
                <span className="text-xs text-slate-500">속도</span>
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => adjustPitch(-1)}
                    className="w-6 h-6 bg-amber-200 hover:bg-amber-300 rounded-full"
                  >
                    <Minus className="h-2 w-2 text-amber-700" />
                  </Button>
                  <span className="text-xs font-medium text-amber-700 min-w-8 text-center">
                    {audioState.pitch > 0 ? '+' : ''}{audioState.pitch}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => adjustPitch(1)}
                    className="w-6 h-6 bg-amber-200 hover:bg-amber-300 rounded-full"
                  >
                    <Plus className="h-2 w-2 text-amber-700" />
                  </Button>
                </div>
                <span className="text-xs text-amber-600">음조</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            <div className="text-xs text-slate-500">
              {audioState.isPlaying ? '재생 중' : '일시정지'}
            </div>
            {audioState.isPlaying && (
              <div className="w-16 bg-slate-200 rounded-full h-1">
                <div 
                  className="bg-amber-800 h-1 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}