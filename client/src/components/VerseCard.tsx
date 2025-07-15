import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Star, Share2, Minus, Plus } from 'lucide-react';
import { BibleVerse } from '@/types/bible';
import { Language } from '@shared/schema';
import { useSpeech } from '@/hooks/useSpeech';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useEmbeddedTTS } from '@/hooks/useEmbeddedTTS';
import { usePrerecordedTTS } from '@/hooks/usePrerecordedTTS';
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
  const embeddedTTS = useEmbeddedTTS();
  const prerecordedTTS = usePrerecordedTTS();

  // Save reading statistics when viewing verse
  useEffect(() => {
    const saveReadingStats = () => {
      const listeningStats = JSON.parse(localStorage.getItem('listeningStats') || '[]');
      const verseKey = `${verse.bookId}-${verse.chapterId}-${verse.verseId}-${language}`;
      
      const recentRecord = listeningStats.find((stat: any) => {
        const statKey = `${stat.book}-${stat.chapter}-${stat.verse}-${stat.language}`;
        const timeDiff = new Date().getTime() - new Date(stat.timestamp).getTime();
        return statKey === verseKey && timeDiff < 5 * 60 * 1000;
      });
      
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
          duration: 1,
          type: 'read'
        };
        listeningStats.push(newStat);
        localStorage.setItem('listeningStats', JSON.stringify(listeningStats));
      }
    };

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
      duration: 2,
      type: 'listen'
    };
    listeningStats.push(newStat);
    localStorage.setItem('listeningStats', JSON.stringify(listeningStats));
  };

  const handlePlay = () => {
    const isAnyPlaying = audioState.isPlaying || embeddedTTS.isPlaying || prerecordedTTS.isPlaying;
    
    if (isAnyPlaying) {
      if (prerecordedTTS.isPlaying) {
        prerecordedTTS.stop();
      } else if (embeddedTTS.isPlaying) {
        embeddedTTS.stop();
      } else {
        toggle();
      }
    } else {
      if (mode === 'double' && koreanVerse) {
        // 교차 모드: 외국어 -> 한국어 순서로 재생
        speakCrossMode(verse, koreanVerse, language);
      } else {
        // 단일 모드: 우선 미리 녹음된 파일 확인
        if (prerecordedTTS.hasPrerecordedAudio(verse.text, language)) {
          console.log(`🎵 고품질 녹음 파일 재생: ${language}`);
          prerecordedTTS.play(verse.text, language, {
            rate: audioState.speed,
            volume: 0.8,
            onStart: () => {
              console.log(`🎤 녹음 파일 재생 시작: ${language}`);
            },
            onEnd: () => {
              saveListeningStats();
              console.log(`✅ 녹음 파일 재생 완료: ${language}`);
            },
            onError: (error) => {
              console.error(`❌ 녹음 파일 오류: ${error}`);
              console.log(`🔄 실시간 TTS로 폴백`);
              handleFallbackTTS();
            }
          });
        } else {
          // 미리 녹음된 파일이 없으면 실시간 TTS 사용
          embeddedTTS.speak(verse.text, language, {
            rate: audioState.speed,
            volume: 0.8,
            onStart: () => {
              console.log(`🎤 실시간 TTS 재생 시작: ${language}`);
            },
            onEnd: () => {
              saveListeningStats();
              console.log(`✅ 실시간 TTS 재생 완료: ${language}`);
            },
            onError: (error) => {
              console.error(`❌ 실시간 TTS 오류: ${error}`);
              handleFallbackTTS();
            }
          });
        }
      }
    }
  };

  const handleFallbackTTS = () => {
    if (mode === 'double' && koreanVerse) {
      speakCrossMode(verse, koreanVerse, language);
    } else {
      const voiceMapping = {
        ko: 'ko-KR',
        en: 'en-US',
        zh: 'zh-CN', 
        ja: 'ja-JP'
      };
      
      const langCode = voiceMapping[language] || 'en-US';
      speak(verse.text, { rate: audioState.speed, lang: langCode });
    }
  };

  const speakCrossMode = (primaryVerse: BibleVerse, koreanVerse: BibleVerse, primaryLang: Language) => {
    const voiceMapping = {
      ko: 'ko-KR',
      en: 'en-US',
      zh: 'zh-CN', 
      ja: 'ja-JP'
    };

    const primaryLangCode = voiceMapping[primaryLang] || 'en-US';
    speak(primaryVerse.text, { 
      rate: audioState.speed, 
      lang: primaryLangCode,
      onEnd: () => {
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

  const getLanguageLabel = (lang: Language) => {
    const labels = {
      ko: '한국어',
      en: 'English',
      zh: '中文',
      ja: '日본語'
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
          {/* Main verse */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600">
                {getLanguageLabel(language)}
              </span>
            </div>
            <p className="text-lg leading-relaxed text-slate-800">
              {verse.text}
            </p>
          </div>

          {/* Korean verse for double mode */}
          {mode === 'double' && koreanVerse && language !== 'ko' && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-600">한국어</span>
              </div>
              <p className="text-lg leading-relaxed text-blue-800 mb-4">
                {koreanVerse.text}
              </p>
            </div>
          )}

          {/* Audio Controls for all modes */}
          <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePlay}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                disabled={embeddedTTS.isLoading || prerecordedTTS.isLoading}
              >
                {(audioState.isPlaying || embeddedTTS.isPlaying || prerecordedTTS.isPlaying) ? (
                  <Pause className="w-4 h-4" />
                ) : (embeddedTTS.isLoading || prerecordedTTS.isLoading) ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {(embeddedTTS.isLoading || prerecordedTTS.isLoading) ? '준비 중...' : 
                 (audioState.isPlaying || embeddedTTS.isPlaying || prerecordedTTS.isPlaying) ? '일시정지' : '재생'}
              </Button>
              {mode === 'double' && (
                <span className="text-xs text-slate-500">외국어 → 한국어</span>
              )}
            </div>
            
            {/* Speed Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => adjustSpeed(-0.1)}
                size="sm"
                variant="ghost"
                className="p-1 h-8 w-8"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm text-slate-600 min-w-[3rem] text-center">
                {audioState.speed.toFixed(1)}x
              </span>
              <Button
                onClick={() => adjustSpeed(0.1)}
                size="sm"
                variant="ghost"
                className="p-1 h-8 w-8"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}