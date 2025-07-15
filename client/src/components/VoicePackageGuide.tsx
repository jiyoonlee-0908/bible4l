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
    <div className="max-h-screen overflow-y-auto bg-white rounded-2xl shadow-lg border border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-2xl sticky top-0 z-10">
        <CardTitle className="flex items-center justify-between text-amber-800">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            고품질 음성 다운로드 안내
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* 안내 메시지 */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="text-lg font-semibold text-blue-800 mb-2">
            🎙️ 더 자연스러운 음성으로 성경 듣기
          </div>
          <div className="text-sm text-blue-700">
            기기에 언어팩을 다운로드하면 고품질 음성으로 성경을 들을 수 있습니다
          </div>
        </div>

        {/* 다운로드 방법 */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              언어팩 다운로드 방법
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              아래 순서대로 진행하시면 4개 언어 모두 고품질 음성을 사용할 수 있습니다
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <div className="font-medium text-slate-800">설정 앱 열기</div>
                <div className="text-sm text-slate-600">홈 화면에서 '설정' 앱을 터치하세요</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <div className="font-medium text-slate-800">일반 메뉴 선택</div>
                <div className="text-sm text-slate-600">설정 목록에서 '일반' 메뉴를 터치하세요</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <div className="font-medium text-slate-800">언어팩 메뉴</div>
                <div className="text-sm text-slate-600">일반 설정에서 '언어팩' 메뉴를 터치하세요</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <div className="font-medium text-slate-800">4개 언어 모두 다운로드</div>
                <div className="text-sm text-slate-600">한국어, 영어(미국), 일본어, 중국어(중국 본토) 전부 다운로드</div>
              </div>
            </div>
          </div>
        </div>

        {/* 언어별 안내 */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-sm font-medium text-green-800 mb-2">
            다운로드할 언어팩 (4개 모두 필요)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
            <div>🇰🇷 한국어</div>
            <div>🇺🇸 영어(미국)</div>
            <div>🇯🇵 일본어</div>
            <div>🇨🇳 중국어(중국 본토)</div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
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

        {/* 추가 정보 */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t">
          언제든지 설정 → 오디오 탭에서 다시 확인할 수 있습니다
        </div>
      </CardContent>
    </div>
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
      <DialogContent className="max-w-md max-h-[90vh] p-0">
        <VoicePackageGuide />
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