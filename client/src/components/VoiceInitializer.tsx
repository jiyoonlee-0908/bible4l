import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Download, Volume2, Smartphone, ExternalLink, AlertTriangle } from 'lucide-react';
import { TTSInstallGuide } from '@/components/TTSInstallGuide';

interface VoiceInitializerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function VoiceInitializer({ isOpen, onClose, onComplete }: VoiceInitializerProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [missingLanguages, setMissingLanguages] = useState<string[]>([]);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const languages = [
    { code: 'ko-KR', name: '한국어', testText: '안녕하세요. 성경 말씀을 들려드립니다.' },
    { code: 'en-US', name: 'English', testText: 'Hello. I will read the Bible verses for you.' },
    { code: 'zh-CN', name: '中文', testText: '你好。我将为您朗读圣经经文。' },
    { code: 'ja-JP', name: '日本語', testText: 'こんにちは。聖書の言葉をお読みします。' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadVoices();
    }
  }, [isOpen]);

  const loadVoices = () => {
    const loadVoicesImpl = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // 지원되는 언어와 누락된 언어 확인
      const supportedLangs = languages.filter(lang => {
        const hasBasic = availableVoices.some(voice => voice.lang.startsWith(lang.code.split('-')[0]));
        const hasGoogle = availableVoices.some(voice => 
          voice.lang.startsWith(lang.code.split('-')[0]) && 
          (voice.name.toLowerCase().includes('google') || 
           voice.name.includes('Standard') || 
           voice.name.includes('Neural') || 
           voice.name.includes('Wavenet'))
        );
        return hasBasic && hasGoogle;
      });
      
      const missingLangs = languages.filter(lang => 
        !supportedLangs.some(supported => supported.code === lang.code)
      );
      
      setAvailableLanguages(supportedLangs.map(lang => lang.code));
      setMissingLanguages(missingLangs.map(lang => lang.code));
      
      console.log('Voice initialization - Available voices:', availableVoices.length);
      console.log('Voice initialization - Supported languages:', supportedLangs.map(l => l.name));
      console.log('Voice initialization - Missing languages:', missingLangs.map(l => l.name));
    };

    loadVoicesImpl();
    
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        loadVoicesImpl();
        speechSynthesis.onvoiceschanged = null;
      };
    }
  };

  const initializeVoices = async () => {
    setIsInitializing(true);
    setStep(1);
    setProgress(0);

    try {
      // 단계 1: 음성 엔진 준비
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(25);

      // 단계 2: 각 언어별 음성 테스트 및 초기화
      for (let i = 0; i < languages.length; i++) {
        const lang = languages[i];
        setStep(2);
        setProgress(25 + (i * 15));

        if (availableLanguages.includes(lang.code)) {
          await testAndInitializeVoice(lang.code, lang.testText);
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 단계 3: 구글 음성 우선 설정
      setStep(3);
      setProgress(85);
      await optimizeGoogleVoices();
      
      // 단계 4: 완료
      setStep(4);
      setProgress(100);
      
      // 초기화 완료 표시를 localStorage에 저장
      localStorage.setItem('bible-voice-initialized', 'true');
      localStorage.setItem('bible-voice-init-date', new Date().toISOString());
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
      
    } catch (error) {
      console.error('Voice initialization failed:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const testAndInitializeVoice = async (langCode: string, testText: string) => {
    const langPrefix = langCode.split('-')[0];
    const languageVoices = voices.filter(v => v.lang.startsWith(langPrefix));
    
    if (languageVoices.length === 0) return;

    // 구글 음성 우선 검색
    const googleVoice = languageVoices.find(v => 
      v.name.toLowerCase().includes('google') || 
      v.name.includes('Standard') ||
      v.name.includes('Neural') ||
      v.name.includes('Wavenet')
    );

    const voiceToUse = googleVoice || languageVoices[0];
    
    // 음성 테스트 (무음으로)
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.voice = voiceToUse;
      utterance.volume = 0; // 무음으로 테스트
      utterance.rate = 1.5; // 빠르게 테스트
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve(); // 에러가 나도 계속 진행
      
      speechSynthesis.speak(utterance);
    });
  };

  const optimizeGoogleVoices = async () => {
    // 구글 음성 우선 순위 설정을 localStorage에 저장
    const googleVoicePreferences = {
      'ko-KR': voices.filter(v => v.lang.startsWith('ko') && v.name.toLowerCase().includes('google')),
      'en-US': voices.filter(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')),
      'zh-CN': voices.filter(v => v.lang.startsWith('zh') && v.name.toLowerCase().includes('google')),
      'ja-JP': voices.filter(v => v.lang.startsWith('ja') && v.name.toLowerCase().includes('google'))
    };

    localStorage.setItem('bible-preferred-voices', JSON.stringify(googleVoicePreferences));
    console.log('Google voice preferences saved:', googleVoicePreferences);
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return '음성 엔진 준비 중...';
      case 2: return '언어별 음성 테스트 중...';
      case 3: return '구글 음성 최적화 중...';
      case 4: return '초기화 완료!';
      default: return '준비 중...';
    }
  };

  const skipInitialization = () => {
    localStorage.setItem('bible-voice-initialized', 'skipped');
    onComplete();
  };

  const openGoogleTTSInstall = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
    
    if (isAndroid) {
      // Android Google TTS 다운로드
      window.open('https://play.google.com/store/apps/details?id=com.google.android.tts', '_blank');
    } else if (isIOS) {
      // iOS는 시스템 설정으로 안내
      alert('iOS에서는 설정 > 손쉬운 사용 > 음성 콘텐츠 > 음성에서 언어를 추가할 수 있습니다.');
    } else {
      // 데스크톱 브라우저 - Chrome Web Store
      window.open('https://chrome.google.com/webstore/detail/google-text-to-speech/hdmbmaphjmjfnikkjhlfbnajabeicapj', '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">음성 초기화</h2>
            <p className="text-gray-600">
              최적의 음성 경험을 위해 4개국어 TTS를 설정합니다
            </p>
          </div>

          {!isInitializing && (
            <>
              {missingLanguages.length > 0 && (
                <Alert className="mb-6 border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>누락된 언어 음성 감지:</strong>
                    <br />
                    {missingLanguages.map(code => languages.find(l => l.code === code)?.name).join(', ')} 
                    음성이 없거나 품질이 낮습니다.
                    <br />
                    <Button 
                      onClick={() => setShowInstallGuide(true)}
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      구글 TTS 설치하기
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  <strong>음성 초기화 기능:</strong>
                  <br />
                  • 한국어, 영어, 중국어, 일본어 음성 테스트
                  <br />
                  • 구글 음성 우선 선택 설정
                  <br />
                  • 모바일 환경 최적화
                  <br />
                  • 약 10초 소요 (무음 테스트)
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <strong>지원되는 언어:</strong>
                  <div className="mt-2 space-y-1">
                    {languages.map(lang => (
                      <div key={lang.code} className="flex items-center">
                        {availableLanguages.includes(lang.code) ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                        )}
                        <span className={availableLanguages.includes(lang.code) ? 'text-green-700' : 'text-gray-500'}>
                          {lang.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={initializeVoices}
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                    disabled={availableLanguages.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {missingLanguages.length > 0 ? '가능한 언어만 초기화' : '음성 초기화 시작'}
                  </Button>
                  <Button
                    onClick={skipInitialization}
                    variant="outline"
                    className="flex-1"
                  >
                    건너뛰기
                  </Button>
                </div>
              </div>
            </>
          )}

          {isInitializing && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-amber-800 mb-2">
                  {getStepDescription()}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  단계 {step}/4
                </div>
              </div>

              <Progress value={progress} className="w-full" />
              
              <div className="text-xs text-gray-500 text-center">
                백그라운드에서 음성을 테스트하고 있습니다...
              </div>

              {step === 4 && (
                <div className="text-center text-green-600 font-semibold">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  초기화 완료! 이제 최적의 음성으로 성경을 들을 수 있습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <TTSInstallGuide
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        missingLanguages={missingLanguages}
        onRetry={() => {
          setShowInstallGuide(false);
          loadVoices();
        }}
      />
    </div>
  );
}