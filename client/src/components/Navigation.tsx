import { Play, Pause, SkipBack, SkipForward, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGlobalAudio } from '@/hooks/useGlobalAudio';
import { useSpeech } from '@/hooks/useSpeech';

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
  const { isPlaying, speak, stop, settings, updateSettings } = useSpeech();

  const handlePlayPause = () => {
    if (isPlaying) {
      stop();
    } else if (verseText) {
      speak(verseText, {
        lang: language === 'ko' ? 'ko-KR' : language === 'en' ? 'en-US' : language === 'zh' ? 'zh-CN' : 'ja-JP',
        rate: currentSpeed,
      });
    }
  };

  const handleSpeedChange = (increment: number) => {
    const newSpeed = Math.max(0.5, Math.min(2.0, currentSpeed + increment));
    updateSettings({ speed: newSpeed });
  };

  const currentSpeed = settings?.speed || 1.0;

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <CardContent className="p-4">
        {/* 성경 정보 표시 */}
        <div className="text-center mb-4">
          <div className="text-lg font-semibold text-amber-800">
            {currentBook} {currentChapter}:{currentVerse}
          </div>
        </div>

        {/* 성경 구절 표시 */}
        {primaryVerse && (
          <div className="mb-4">
            <div className="text-sm text-slate-600 mb-2">
              {primaryVerse.language === 'ko' ? '한국어' : 
               primaryVerse.language === 'en' ? 'English' :
               primaryVerse.language === 'zh' ? '中文' : '日本語'}
            </div>
            <div className="text-base text-slate-800 mb-3">
              {primaryVerse.text}
            </div>
            
            {secondaryVerse && (
              <>
                <div className="text-sm text-slate-600 mb-2">
                  {secondaryVerse.language === 'ko' ? '한국어' : 
                   secondaryVerse.language === 'en' ? 'English' :
                   secondaryVerse.language === 'zh' ? '中文' : '日本語'}
                </div>
                <div className="text-base text-slate-800 mb-3 pl-4 border-l-4 border-amber-300">
                  {secondaryVerse.text}
                </div>
              </>
            )}
          </div>
        )}

        {/* 오디오 컨트롤 */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          {/* 이전 버튼 */}
          <Button
            variant="ghost"
            onClick={onPrevious}
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <SkipBack className="h-5 w-5 text-slate-600" />
          </Button>

          {/* 재생/일시정지 버튼 */}
          <Button
            variant="ghost"
            onClick={handlePlayPause}
            className="p-4 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-amber-800" />
            ) : (
              <Play className="h-6 w-6 text-amber-800" />
            )}
          </Button>

          {/* 다음 버튼 */}
          <Button
            variant="ghost"
            onClick={onNext}
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <SkipForward className="h-5 w-5 text-slate-600" />
          </Button>
        </div>

        {/* 속도 조절 */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-slate-600 font-medium">속도</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => handleSpeedChange(-0.25)}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <Minus className="h-4 w-4 text-slate-600" />
            </Button>
            <span className="text-sm font-medium text-amber-800 min-w-[50px] text-center">
              {currentSpeed.toFixed(2)}x
            </span>
            <Button
              variant="ghost"
              onClick={() => handleSpeedChange(0.25)}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <Plus className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
