import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Smartphone, Monitor, Download, Settings, CheckCircle, RefreshCw } from 'lucide-react';

interface TTSInstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
  missingLanguages: string[];
  onRetry: () => void;
}

export function TTSInstallGuide({ isOpen, onClose, missingLanguages, onRetry }: TTSInstallGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const languages = [
    { code: 'ko-KR', name: '한국어' },
    { code: 'en-US', name: 'English' },
    { code: 'zh-CN', name: '中文' },
    { code: 'ja-JP', name: '日本語' }
  ];

  const missingLanguageNames = missingLanguages.map(code => 
    languages.find(l => l.code === code)?.name || code
  );

  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes('android');
  const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
  const isDesktop = !isAndroid && !isIOS;

  const installSteps = {
    android: [
      {
        title: '1. 구글 TTS 앱 설치',
        description: '플레이스토어에서 구글 TTS를 다운로드하세요',
        action: () => window.open('https://play.google.com/store/apps/details?id=com.google.android.tts', '_blank'),
        buttonText: '플레이스토어 열기'
      },
      {
        title: '2. 추가 언어 다운로드',
        description: '구글 TTS 앱에서 중국어, 일본어 음성 다운로드',
        action: () => window.open('https://play.google.com/store/apps/details?id=com.google.android.tts', '_blank'),
        buttonText: '앱에서 언어 추가'
      },
      {
        title: '3. 시스템 설정 확인',
        description: '설정 > 손쉬운 사용 > 텍스트 음성 변환에서 구글 TTS 선택',
        action: () => {
          try {
            // Android 설정 앱 열기 시도
            window.open('intent://com.android.settings/.tts.TextToSpeechSettings#Intent;scheme=android-app;end', '_self');
          } catch (e) {
            alert('설정 > 손쉬운 사용 > 텍스트 음성 변환에서 구글 TTS를 선택하세요');
          }
        },
        buttonText: '설정으로 이동'
      }
    ],
    ios: [
      {
        title: '1. iOS 설정 열기',
        description: '설정 앱을 열고 손쉬운 사용으로 이동하세요',
        action: () => {
          try {
            window.open('prefs:root=ACCESSIBILITY', '_self');
          } catch (e) {
            alert('설정 앱을 열어 손쉬운 사용으로 이동하세요');
          }
        },
        buttonText: '설정 열기'
      },
      {
        title: '2. 음성 콘텐츠 설정',
        description: '손쉬운 사용 > 음성 콘텐츠 > 음성으로 이동',
        action: () => alert('설정 > 손쉬운 사용 > 음성 콘텐츠 > 음성으로 이동하세요'),
        buttonText: '경로 안내'
      },
      {
        title: '3. 언어 추가',
        description: '음성 설정에서 중국어, 일본어 음성을 추가하세요',
        action: () => alert('음성 설정에서 필요한 언어를 다운로드하세요'),
        buttonText: '언어 추가 방법'
      }
    ],
    desktop: [
      {
        title: '1. Chrome 브라우저 확인',
        description: 'Google Chrome 브라우저에서 가장 좋은 음성 품질을 제공합니다',
        action: () => window.open('https://www.google.com/chrome/', '_blank'),
        buttonText: 'Chrome 다운로드'
      },
      {
        title: '2. 언어 설정 확인',
        description: 'Chrome 설정에서 언어를 추가하세요',
        action: () => window.open('chrome://settings/languages', '_blank'),
        buttonText: '언어 설정 열기'
      },
      {
        title: '3. 음성 합성 사용',
        description: '웹 음성 API가 자동으로 시스템 음성을 사용합니다',
        action: () => alert('브라우저가 자동으로 최적의 음성을 선택합니다'),
        buttonText: '확인'
      }
    ]
  };

  const currentPlatform = isAndroid ? 'android' : isIOS ? 'ios' : 'desktop';
  const steps = installSteps[currentPlatform];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">TTS 음성 설치</h2>
            <p className="text-gray-600">
              더 나은 음성 품질을 위해 구글 TTS를 설치하세요
            </p>
          </div>

          <Alert className="mb-6 border-red-200 bg-red-50">
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              <strong>누락된 언어:</strong> {missingLanguageNames.join(', ')}
              <br />
              구글 TTS 설치 후 훨씬 자연스러운 음성을 들을 수 있습니다.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center mb-4">
              {isAndroid && <Smartphone className="w-5 h-5 text-green-600 mr-2" />}
              {isIOS && <Smartphone className="w-5 h-5 text-blue-600 mr-2" />}
              {isDesktop && <Monitor className="w-5 h-5 text-purple-600 mr-2" />}
              <span className="font-semibold">
                {isAndroid ? 'Android' : isIOS ? 'iOS' : 'Desktop'} 설치 가이드
              </span>
            </div>

            {steps.map((step, index) => (
              <Card key={index} className={`${index === currentStep ? 'ring-2 ring-amber-500' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-amber-700">{index + 1}</span>
                      </div>
                    )}
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <Button
                    onClick={() => {
                      step.action();
                      if (index < steps.length - 1) {
                        setTimeout(() => setCurrentStep(index + 1), 1000);
                      }
                    }}
                    className="w-full"
                    variant={index === currentStep ? "default" : "outline"}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {step.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex space-x-3 mt-6">
            <Button
              onClick={onRetry}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 확인
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              나중에 하기
            </Button>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            TTS 설치 후 브라우저를 새로고침하면 새로운 음성을 사용할 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}