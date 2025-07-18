import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Volume2, CheckCircle, X } from 'lucide-react';

interface VoicePackageGuideProps {
  onClose?: () => void;
  onNeverShow?: () => void;
}

export function VoicePackageGuide({ onClose, onNeverShow }: VoicePackageGuideProps) {
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
            <div className="text-sm font-bold text-blue-700">
              기기에 언어팩을 다운로드 하시면 고품질 음성을 사용할 수 있습니다. 아래 다운로드 방법을 따라해주세요.
            </div>
          </div>

          {/* 다운로드할 언어팩 - 더 강조 */}
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
            <div className="text-center mb-2">
              <div className="text-lg font-bold text-green-800 mb-1">
                4개 언어 다운로드
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-1.5 rounded-lg text-center border border-green-200">
                <div className="text-sm font-medium text-green-800">한국어</div>
              </div>
              <div className="bg-white p-1.5 rounded-lg text-center border border-green-200">
                <div className="text-sm font-medium text-green-800">영어(미국)</div>
              </div>
              <div className="bg-white p-1.5 rounded-lg text-center border border-green-200">
                <div className="text-sm font-medium text-green-800">일본어</div>
              </div>
              <div className="bg-white p-1.5 rounded-lg text-center border border-green-200">
                <div className="text-sm font-medium text-green-800">중국어(중국 본토)</div>
              </div>
            </div>
          </div>

          {/* 다운로드 방법 - 더 간결하게 */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-center mb-3">
              <h3 className="text-lg font-semibold text-slate-800">
                다운로드 방법
              </h3>
            </div>
            <div className="space-y-2">
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