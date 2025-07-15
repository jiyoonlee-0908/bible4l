import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TTSEngineInfo {
  isGoogleTTS: boolean;
  engineName: string;
  hasChineseSupport: boolean;
  hasJapaneseSupport: boolean;
  needsSetup: boolean;
}

interface TTSEngineDetectorProps {
  onEngineCheck: (info: TTSEngineInfo) => void;
}

export function TTSEngineDetector({ onEngineCheck }: TTSEngineDetectorProps) {
  const [engineInfo, setEngineInfo] = useState<TTSEngineInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const detectTTSEngine = async () => {
    setIsChecking(true);
    
    try {
      // Wait for voices to load
      await new Promise<void>((resolve) => {
        const checkVoices = () => {
          const voices = speechSynthesis.getVoices();
          if (voices.length > 0) {
            resolve();
          } else {
            setTimeout(checkVoices, 100);
          }
        };
        checkVoices();
      });

      const voices = speechSynthesis.getVoices();
      
      // Detect TTS engine based on voice names and characteristics
      const googleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('google') ||
        voice.name.toLowerCase().includes('chrome') ||
        voice.voiceURI.toLowerCase().includes('google')
      );
      
      const samsungVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('samsung') ||
        voice.name.toLowerCase().includes('svox')
      );

      const chineseVoices = voices.filter(voice => 
        voice.lang.startsWith('zh') || voice.lang.startsWith('cmn')
      );
      
      const japaneseVoices = voices.filter(voice => 
        voice.lang.startsWith('ja')
      );

      let engineName = 'Unknown';
      let isGoogleTTS = false;
      let needsSetup = true;

      if (googleVoices.length > 0) {
        engineName = 'Google TTS';
        isGoogleTTS = true;
        needsSetup = false;
      } else if (samsungVoices.length > 0) {
        engineName = 'Samsung TTS';
        isGoogleTTS = false;
        needsSetup = true;
      } else if (voices.some(v => v.name.toLowerCase().includes('microsoft'))) {
        engineName = 'Microsoft TTS';
        isGoogleTTS = false;
        needsSetup = true;
      } else if (voices.length > 0) {
        engineName = '기본 TTS';
        isGoogleTTS = false;
        needsSetup = true;
      }

      const info: TTSEngineInfo = {
        isGoogleTTS,
        engineName,
        hasChineseSupport: chineseVoices.length > 0,
        hasJapaneseSupport: japaneseVoices.length > 0,
        needsSetup
      };

      console.log('TTS Engine Detection:', info);
      console.log('Available voices by language:', {
        total: voices.length,
        chinese: chineseVoices.length,
        japanese: japaneseVoices.length,
        google: googleVoices.length,
        samsung: samsungVoices.length
      });

      setEngineInfo(info);
      onEngineCheck(info);
      
    } catch (error) {
      console.error('TTS Engine detection failed:', error);
      const fallbackInfo: TTSEngineInfo = {
        isGoogleTTS: false,
        engineName: 'Detection Failed',
        hasChineseSupport: false,
        hasJapaneseSupport: false,
        needsSetup: true
      };
      setEngineInfo(fallbackInfo);
      onEngineCheck(fallbackInfo);
    } finally {
      setIsChecking(false);
    }
  };

  const requestTTSPermission = async () => {
    try {
      // Request permission for speech synthesis
      if ('speechSynthesis' in window) {
        // Test speech to trigger permission
        const testUtterance = new SpeechSynthesisUtterance('테스트');
        testUtterance.volume = 0; // Silent test
        speechSynthesis.speak(testUtterance);
        speechSynthesis.cancel(); // Cancel immediately
        
        setTimeout(() => {
          detectTTSEngine();
        }, 500);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      detectTTSEngine();
    }
  };

  useEffect(() => {
    // Auto-detect on mount
    requestTTSPermission();
  }, []);

  if (isChecking) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <div className="text-sm text-gray-600">TTS 엔진 감지 중...</div>
      </div>
    );
  }

  if (!engineInfo) {
    return (
      <div className="p-4 text-center">
        <Button onClick={requestTTSPermission} variant="outline" size="sm">
          🔍 TTS 엔진 감지
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 현재 엔진 정보 */}
      <Alert className={engineInfo.isGoogleTTS ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>현재 TTS 엔진:</strong> {engineInfo.engineName}
              <br />
              <span className="text-xs">
                중국어: {engineInfo.hasChineseSupport ? '✅' : '❌'} | 
                일본어: {engineInfo.hasJapaneseSupport ? '✅' : '❌'}
              </span>
            </div>
            <Button onClick={detectTTSEngine} variant="ghost" size="sm">
              🔄 재검사
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* 권장사항 */}
      {engineInfo.needsSetup && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertDescription>
            <div className="text-sm">
              <strong>⚠️ 권장사항:</strong>
              <br />
              최적의 다국어 지원을 위해 Google TTS로 변경하는 것을 권장합니다.
              <br />
              <span className="text-xs text-gray-600">
                Google TTS는 한국어, 영어, 중국어, 일본어를 모두 지원합니다.
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 자동 설정 요청 (향후 네이티브 앱용) */}
      {engineInfo.needsSetup && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-sm font-semibold text-blue-800 mb-2">
            🚀 자동 설정 (권한 요청)
          </div>
          <div className="text-xs text-blue-700 mb-2">
            이 앱이 최적의 음성 엔진을 자동으로 설정하도록 허용하시겠습니까?
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                alert('죄송합니다. 웹 앱에서는 시스템 설정을 직접 변경할 수 없습니다.\n수동으로 TTS 설정을 변경해 주세요.');
              }}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              ✅ 자동 설정 허용
            </Button>
            <Button
              onClick={() => {
                // 수동 설정 가이드 표시는 부모 컴포넌트에서 처리
              }}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              📖 수동 설정 가이드
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}