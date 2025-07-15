import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Settings, Volume2, Info, CheckCircle } from 'lucide-react';

interface VoicePackageGuideProps {
  onClose?: () => void;
}

export function VoicePackageGuide({ onClose }: VoicePackageGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "설정 앱 열기",
      description: "기기의 '설정' 앱을 열어주세요",
      detail: "홈 화면에서 톱니바퀴 모양의 설정 아이콘을 찾아 터치하세요"
    },
    {
      title: "일반 메뉴 찾기",
      description: "설정에서 '일반' 메뉴를 찾아주세요",
      detail: "설정 목록에서 '일반' 또는 'General'을 터치하세요"
    },
    {
      title: "언어팩 메뉴",
      description: "'언어팩' 또는 'Language Pack'을 선택하세요",
      detail: "일반 설정 안에서 언어팩 메뉴를 찾아 터치하세요"
    },
    {
      title: "언어 다운로드",
      description: "필요한 언어팩을 다운로드하세요",
      detail: "한국어, 영어(미국), 일본어, 중국어(중국 본토) 중 원하는 언어를 선택하여 다운로드하세요"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg border border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-2xl">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Volume2 className="h-5 w-5" />
          고품질 음성 다운로드 안내
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">
              단계 {currentStep + 1} / {steps.length}
            </span>
            <div className="text-xs text-amber-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% 완료
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {currentStep === 0 && <Settings className="h-8 w-8 text-amber-600" />}
            {currentStep === 1 && <Info className="h-8 w-8 text-amber-600" />}
            {currentStep === 2 && <Volume2 className="h-8 w-8 text-amber-600" />}
            {currentStep === 3 && <Download className="h-8 w-8 text-amber-600" />}
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            {steps[currentStep].title}
          </h3>
          <p className="text-slate-600 mb-3">
            {steps[currentStep].description}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
            💡 {steps[currentStep].detail}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex-1"
          >
            이전
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              다음
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              완료
            </Button>
          )}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-green-800 mb-1">왜 언어팩이 필요한가요?</div>
              <div className="text-green-700">
                기기에 언어팩을 다운로드하면 더욱 자연스럽고 선명한 음성으로 성경을 들을 수 있습니다. 
                온라인 연결 없이도 고품질 음성을 사용할 수 있어 배터리도 절약됩니다.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 설정 페이지에서 사용할 간단한 버튼 컴포넌트
export function VoicePackageButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:bg-amber-100"
        >
          <Download className="h-4 w-4 mr-2" />
          고품질 음성 다운로드 안내
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>음성 품질 향상 방법</DialogTitle>
        </DialogHeader>
        <VoicePackageGuide />
      </DialogContent>
    </Dialog>
  );
}