import { Play, Pause, SkipBack, SkipForward, Minus, Plus, Volume2 } from 'lucide-react';
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
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg border-2 border-amber-200/50 overflow-hidden">
      <CardContent className="p-0">
        {/* 헤더 섹션 - 성경 정보 */}
        <div className="bg-gradient-to-r from-amber-800 to-orange-800 text-white p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
          <div className="relative text-center">
            <div className="text-xl font-bold tracking-wide">
              {currentBook} {currentChapter}:{currentVerse}
            </div>
            {isPlaying && (
              <div className="mt-2 flex items-center justify-center space-x-1">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
                <span className="text-xs text-white/80 ml-2">재생 중...</span>
              </div>
            )}
          </div>
        </div>

        {/* 성경 구절 표시 */}
        {primaryVerse && (
          <div className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-amber-800">
                  {primaryVerse.language === 'ko' ? '한국어' : 
                   primaryVerse.language === 'en' ? 'English' :
                   primaryVerse.language === 'zh' ? '中文' : '日本語'}
                </span>
              </div>
              <div className="text-lg leading-relaxed text-slate-800 font-medium">
                {primaryVerse.text}
              </div>
            </div>
            
            {secondaryVerse && (
              <div className="mt-6 p-4 bg-amber-50/70 rounded-2xl border border-amber-200/50">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium text-orange-800">
                    {secondaryVerse.language === 'ko' ? '한국어' : 
                     secondaryVerse.language === 'en' ? 'English' :
                     secondaryVerse.language === 'zh' ? '中文' : '日본語'}
                  </span>
                </div>
                <div className="text-base leading-relaxed text-slate-700">
                  {secondaryVerse.text}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 오디오 컨트롤 섹션 */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center justify-center space-x-6 mb-6">
            {/* 이전 버튼 */}
            <Button
              variant="ghost"
              onClick={onPrevious}
              className="p-4 bg-white hover:bg-slate-50 rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <SkipBack className="h-6 w-6 text-slate-600" />
            </Button>

            {/* 재생/일시정지 버튼 */}
            <Button
              variant="ghost"
              onClick={handlePlayPause}
              className={`p-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 ${
                isPlaying ? 'animate-pulse' : ''
              }`}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white ml-1" />
              )}
            </Button>

            {/* 다음 버튼 */}
            <Button
              variant="ghost"
              onClick={onNext}
              className="p-4 bg-white hover:bg-slate-50 rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <SkipForward className="h-6 w-6 text-slate-600" />
            </Button>
          </div>

          {/* 속도 조절 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-slate-700">속도</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSpeedChange(-0.25)}
                  className="p-2.5 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 rounded-full shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                  disabled={currentSpeed <= 0.5}
                >
                  <Minus className="h-4 w-4 text-slate-600" />
                </Button>
                <div className="bg-gradient-to-r from-amber-200 to-orange-200 px-5 py-2.5 rounded-full min-w-[80px] text-center shadow-inner">
                  <span className="text-sm font-bold text-amber-900">
                    {currentSpeed.toFixed(2)}x
                  </span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleSpeedChange(0.25)}
                  className="p-2.5 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 rounded-full shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                  disabled={currentSpeed >= 2.0}
                >
                  <Plus className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
