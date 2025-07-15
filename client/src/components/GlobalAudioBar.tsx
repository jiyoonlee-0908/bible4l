import { Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobalAudio } from '@/hooks/useGlobalAudio';
import { useSpeech } from '@/hooks/useSpeech';

export function GlobalAudioBar() {
  const { globalAudioState, toggleGlobalPlayback, stopGlobalPlayback } = useGlobalAudio();
  const { audioState, speak, pause, resume, stop } = useSpeech();

  if (!globalAudioState.isActive || !globalAudioState.currentVerse) {
    return null;
  }

  const handleToggle = () => {
    if (audioState.isPlaying) {
      // 재생 중이면 일시정지
      pause();
    } else if (speechSynthesis.paused) {
      // 일시정지 상태이면 재개
      resume();
    } else {
      // 새로 재생 시작
      const verse = globalAudioState.currentVerse;
      if (verse) {
        speak(verse.text, {
          lang: verse.language === 'ko' ? 'ko-KR' : 
                verse.language === 'en' ? 'en-US' : 
                verse.language === 'zh' ? 'zh-CN' : 'ja-JP',
        });
      }
    }
    toggleGlobalPlayback();
  };

  const handleStop = () => {
    stop();
    stopGlobalPlayback();
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-card-foreground truncate">
                {globalAudioState.currentVerse.reference}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {globalAudioState.playbackMode === 'single' ? '한 곡 반복' : '연속 재생'}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                className="w-8 h-8"
              >
                {audioState.isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStop}
                className="w-8 h-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}