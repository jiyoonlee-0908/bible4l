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
  
  // 내장된 TTS (기존 브라우저 방식)
  const { speakWithEmbeddedVoice, stopSpeaking, isPlaying: ttsIsPlaying, isLoading: ttsIsLoading } = useEmbeddedTTS();
  
  // 사전 녹음된 오디오 파일
  const { playPrerecordedAudio, stopAudio, isPlaying: audioPlaying, isLoading: audioLoading, isFileAvailable } = usePrerecordedTTS();

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

  // 재생 버튼 클릭 핸들러
  const handlePlayClick = async () => {
    const bookName = verse.bookId;
    const chapterNum = parseInt(verse.chapterId);
    const verseNum = verse.verseId;
    
    // 1. 먼저 사전 녹음된 파일이 있는지 확인
    const hasPrerecordedFile = isFileAvailable(bookName, chapterNum, verseNum, language);
    
    if (hasPrerecordedFile) {
      console.log(`🎵 사전 녹음된 파일 재생: ${bookName} ${chapterNum}:${verseNum}`);
      
      if (audioPlaying) {
        stopAudio();
      } else {
        await playPrerecordedAudio(bookName, chapterNum, verseNum, language, {
          rate: audioState.speed,
          volume: 0.8,
          onStart: () => {
            // 듣기 통계 저장
            const listeningStats = JSON.parse(localStorage.getItem('listeningStats') || '[]');
            const newStat = {
              book: verse.bookId,
              chapter: parseInt(verse.chapterId),
              verse: verse.verseId,
              language: language,
              timestamp: new Date().toISOString(),
              duration: 10,
              type: 'listen'
            };
            listeningStats.push(newStat);
            localStorage.setItem('listeningStats', JSON.stringify(listeningStats));
            
            toast({
              title: '🎵 고품질 음성으로 재생 중',
              description: '사전 녹음된 맥북 음성으로 재생됩니다.',
            });
          },
          onError: (error) => {
            console.error('사전 녹음 파일 재생 실패:', error);
            // 폴백: 브라우저 TTS 사용
            fallbackToTTS();
          }
        });
      }
    } else {
      // 2. 사전 녹음 파일이 없으면 브라우저 TTS 사용
      fallbackToTTS();
    }
  };

  const fallbackToTTS = async () => {
    console.log(`🎤 브라우저 TTS 사용: ${language}`);
    
    if (ttsIsPlaying) {
      stopSpeaking();
    } else {
      await speakWithEmbeddedVoice(verse.text, language, {
        rate: audioState.speed,
        volume: 0.8,
        onStart: () => {
          // 듣기 통계 저장
          const listeningStats = JSON.parse(localStorage.getItem('listeningStats') || '[]');
          const newStat = {
            book: verse.bookId,
            chapter: parseInt(verse.chapterId),
            verse: verse.verseId,
            language: language,
            timestamp: new Date().toISOString(),
            duration: 10,
            type: 'listen'
          };
          listeningStats.push(newStat);
          localStorage.setItem('listeningStats', JSON.stringify(listeningStats));
          
          toast({
            title: '🎤 브라우저 음성으로 재생',
            description: '시스템 TTS를 사용하여 재생됩니다.',
          });
        },
        onError: (error) => {
          toast({
            title: '재생 실패',
            description: '음성 재생 중 오류가 발생했습니다.',
            variant: 'destructive'
          });
        }
      });
    }
  };

  const isCurrentlyPlaying = audioPlaying || ttsIsPlaying;
  const isCurrentlyLoading = audioLoading || ttsIsLoading;

  const speakCrossMode = (primaryVerse: BibleVerse, koreanVerse: BibleVerse, primaryLang: Language) => {
    const primaryText = primaryVerse.text;
    const koreanText = koreanVerse.text;
    
    const combinedText = `${primaryText}. ${koreanText}`;
    
    if (audioState.isPlaying && audioState.currentText === combinedText) {
      stop();
    } else {
      speak(combinedText, primaryLang);
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
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-sm text-slate-500">
            {verse.bookId} {verse.chapterId}:{verse.verseId}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleBookmark(verse, language)}
              className={isBookmarked(verse, language) ? 'text-amber-600' : 'text-slate-400'}
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {mode === 'single' ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600">
                {getLanguageLabel(language)}
              </span>
            </div>
            
            <p 
              className="text-slate-800 leading-relaxed mb-4" 
              style={{ 
                fontSize: `var(--text-lg)`,
                fontFamily: language === 'ja' ? "'Noto Sans JP', sans-serif" : 
                           language === 'ko' ? "'Noto Sans KR', sans-serif" :
                           language === 'zh' ? "'Noto Sans SC', sans-serif" : 
                           "'Inter', sans-serif"
              }}
            >
              {verse.text}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayClick}
                  disabled={isCurrentlyLoading}
                  className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2"
                >
                  {isCurrentlyLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isCurrentlyLoading ? '로딩...' : isCurrentlyPlaying ? '일시정지' : '재생'}
                </Button>
                
                {isFileAvailable(verse.bookId, parseInt(verse.chapterId), verse.verseId, language) && (
                  <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    🎵 고품질 음성
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSpeed(Math.max(0.8, audioState.speed - 0.1))}
                  disabled={audioState.speed <= 0.8}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-sm text-slate-600 min-w-[3rem] text-center">
                  {audioState.speed.toFixed(1)}x
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSpeed(Math.min(1.5, audioState.speed + 0.1))}
                  disabled={audioState.speed >= 1.5}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">
                  {getLanguageLabel(language)}
                </span>
              </div>
              <p 
                className="text-slate-800 leading-relaxed mb-3" 
                style={{ 
                  fontSize: `var(--text-base)`,
                  fontFamily: language === 'ja' ? "'Noto Sans JP', sans-serif" : 
                             language === 'ko' ? "'Noto Sans KR', sans-serif" :
                             language === 'zh' ? "'Noto Sans SC', sans-serif" : 
                             "'Inter', sans-serif"
                }}
              >
                {verse.text}
              </p>
            </div>

            {koreanVerse && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">한국어</span>
                </div>
                <p 
                  className="text-slate-800 leading-relaxed mb-3" 
                  style={{ 
                    fontSize: `var(--text-base)`,
                    fontFamily: "'Noto Sans KR', sans-serif"
                  }}
                >
                  {koreanVerse.text}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayClick}
                  disabled={isCurrentlyLoading}
                  className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2"
                >
                  {isCurrentlyLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isCurrentlyLoading ? '로딩...' : isCurrentlyPlaying ? '일시정지' : '재생'}
                </Button>
                
                {isFileAvailable(verse.bookId, parseInt(verse.chapterId), verse.verseId, language) && (
                  <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    🎵 고품질 음성
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSpeed(Math.max(0.8, audioState.speed - 0.1))}
                  disabled={audioState.speed <= 0.8}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-sm text-slate-600 min-w-[3rem] text-center">
                  {audioState.speed.toFixed(1)}x
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSpeed(Math.min(1.5, audioState.speed + 0.1))}
                  disabled={audioState.speed >= 1.5}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}