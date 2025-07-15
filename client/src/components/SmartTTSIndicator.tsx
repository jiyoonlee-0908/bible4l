import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Volume2, Zap, Download } from 'lucide-react';
import { useSmartTTS } from '@/hooks/useSmartTTS';

export function SmartTTSIndicator() {
  const { 
    isReady, 
    smartVoices, 
    needsImprovement, 
    autoOptimizing, 
    oneClickImprovement 
  } = useSmartTTS();
  
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // 앱 로딩 완료 후 표시
    const timer = setTimeout(() => {
      setShowIndicator(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!showIndicator || !isReady) return null;

  const totalVoices = Object.values(smartVoices).filter(v => v !== null).length;
  const googleVoices = Object.values(smartVoices).filter(v => v?.isGoogle).length;
  
  // 모든 언어가 최적화되었고 구글 음성이 충분할 때는 표시하지 않음
  if (totalVoices === 4 && googleVoices >= 3) return null;

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm">
      <Alert className="border-amber-200 bg-amber-50 shadow-lg">
        <Zap className="h-4 w-4 text-amber-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-amber-800">
                음성 품질 개선 가능
              </div>
              <div className="text-xs text-amber-700 mt-1">
                {totalVoices}/4개 언어 • 구글음성 {googleVoices}개
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <Button
                onClick={oneClickImprovement}
                disabled={autoOptimizing}
                size="sm"
                className="text-xs bg-amber-600 hover:bg-amber-700"
              >
                {autoOptimizing ? (
                  <div className="flex items-center gap-1">
                    <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"></div>
                    최적화중
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    개선하기
                  </div>
                )}
              </Button>
              
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer"
                onClick={() => setShowIndicator(false)}
              >
                닫기
              </Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}