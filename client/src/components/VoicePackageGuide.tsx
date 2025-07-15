import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Volume2, CheckCircle, X, ExternalLink } from 'lucide-react';
import { isAndroidApp, openTTSSettings, checkTTSLanguages } from '@/utils/androidUtils';
import { getLanguagePackStatus } from '@/utils/ttsPermissions';

interface VoicePackageGuideProps {
  onClose?: () => void;
  onNeverShow?: () => void;
}

export function VoicePackageGuide({ onClose, onNeverShow }: VoicePackageGuideProps) {
  const [isAndroid, setIsAndroid] = useState(false);
  const [languageStatus, setLanguageStatus] = useState({
    installed: [] as string[],
    missing: [] as string[],
    isComplete: false
  });

  useEffect(() => {
    setIsAndroid(isAndroidApp());
    
    // TTS 언어 체크
    const checkLanguages = () => {
      const status = getLanguagePackStatus();
      setLanguageStatus(status);
    };
    
    checkLanguages();
    
    // 음성 목록이 로드될 때까지 대기
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = checkLanguages;
    }
  }, []);

  const handleDirectSettings = async () => {
    const success = await openTTSSettings();
    if (success) {
      // 설정 페이지가 열렸으므로 팝업 닫기
      onClose?.();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-amber-200 max-h-[85vh] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-2xl flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Download className="h-5 w-5" />
          <span className="text-lg font-semibold">고품질 음성 다운로드 안내</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {/* 안내 메시지 */}
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-lg font-semibold text-blue-800 mb-1">
              🎙️ 더 자연스러운 음성으로 성경 듣기
            </div>
            <div className="text-sm text-blue-700">
              기기에 언어팩을 다운로드하면 고품질 음성을 사용할 수 있습니다
            </div>
            {languageStatus.isComplete && (
              <div className="mt-2 text-sm text-green-700 font-medium">
                ✅ 모든 언어팩이 설치되었습니다!
              </div>
            )}
          </div>

          {/* 다운로드할 언어팩 - 더 강조 */}
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
            <div className="text-center mb-2">
              <div className="text-lg font-bold text-green-800 mb-1">
                4개 언어 다운로드
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: 'ko', name: '한국어' },
                { code: 'en', name: '영어(미국)' },
                { code: 'ja', name: '일본어' },
                { code: 'zh', name: '중국어(중국 본토)' }
              ].map((lang) => (
                <div 
                  key={lang.code}
                  className={`p-1.5 rounded-lg text-center border ${
                    languageStatus.installed.includes(lang.code)
                      ? 'bg-green-100 border-green-300'
                      : 'bg-white border-green-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-sm font-medium text-green-800">{lang.name}</div>
                    {languageStatus.installed.includes(lang.code) && (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 다운로드 방법 */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-center mb-3">
              <h3 className="text-lg font-semibold text-slate-800">
                다운로드 방법
              </h3>
            </div>
            
            {isAndroid ? (
              <div className="space-y-3">
                <div className="text-center">
                  <Button 
                    onClick={handleDirectSettings}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    음성 설정 열기
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">
                    설정 페이지에서 4개 언어를 다운로드하세요
                  </p>
                </div>
                
                <div className="text-center text-sm text-slate-600">
                  <p>또는 수동으로:</p>
                </div>
              </div>
            ) : null}
            
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-800">설정 앱</span> 열기
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-800">일반</span> 메뉴 선택
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-800">언어팩</span> 메뉴 선택
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-800">한국어,영어,일본어,중국어(중국 본토)</span> 다운로드
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 버튼 영역 */}
      <div className="flex gap-3 p-4 bg-slate-50 rounded-b-2xl flex-shrink-0">
        <Button
          variant="outline"
          onClick={onNeverShow}
          className="flex-1 text-sm"
        >
          다시 보지 않기
        </Button>
        <Button
          onClick={onClose}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-sm"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          확인
        </Button>
      </div>
    </div>
  );
}

// 설정 페이지에서 사용할 간단한 버튼 컴포넌트
export function VoicePackageButton({ isHeaderButton = false }: { isHeaderButton?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  if (isHeaderButton) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-amber-200/50 hover:bg-amber-300/50 rounded-full"
            title="음성 다운로드 안내"
          >
            <Download className="h-5 w-5 text-amber-800" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[90vh] p-0">
          <VoicePackageGuide onClose={() => setIsOpen(false)} onNeverShow={() => {
            localStorage.setItem('voicePackageGuide_neverShow', 'true');
            setIsOpen(false);
          }} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:bg-amber-100"
        >
          <Download className="h-4 w-4 mr-2" />
          고품질 음성 다운로드 안내
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] p-0">
        <VoicePackageGuide onClose={() => setIsOpen(false)} onNeverShow={() => {
          localStorage.setItem('voicePackageGuide_neverShow', 'true');
          setIsOpen(false);
        }} />
      </DialogContent>
    </Dialog>
  );
}

// 초기 실행 팝업 컴포넌트
export function VoicePackageInitialPopup({ onClose, onNeverShow }: { 
  onClose: () => void; 
  onNeverShow: () => void; 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-hidden">
        <VoicePackageGuide onClose={onClose} onNeverShow={onNeverShow} />
      </div>
    </div>
  );
}