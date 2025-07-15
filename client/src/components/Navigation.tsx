import { ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
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
}

export function Navigation({
  currentChapter,
  currentVerse,
  onPrevious,
  onNext,
  currentBook,
  verseText,
  language = 'ko',
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

  const handleSpeedChange = (newSpeed: number) => {
    updateSettings({ speed: newSpeed });
  };

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5];
  const currentSpeed = settings?.speed || 1.0;

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <CardContent className="p-4">
        {/* 성경 정보 표시 */}
        <div className="text-center mb-4">
          <div className="text-sm text-slate-600">{currentBook}</div>
          <div className="text-lg font-semibold text-amber-800">
            {currentChapter}장 {currentVerse}절
          </div>
        </div>

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
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-slate-600 font-medium">속도</span>
          <div className="flex items-center space-x-1">
            {speedOptions.map((speed) => (
              <Button
                key={speed}
                variant="ghost"
                onClick={() => handleSpeedChange(speed)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  currentSpeed === speed
                    ? 'bg-amber-100 text-amber-800 font-medium'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
