import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function TTSDebugger() {
  const [ttsStatus, setTtsStatus] = useState<{
    isSupported: boolean;
    voiceCount: number;
    canSpeak: boolean;
    error: string | null;
  }>({
    isSupported: false,
    voiceCount: 0,
    canSpeak: false,
    error: null
  });

  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    checkTTSStatus();
  }, []);

  const checkTTSStatus = () => {
    try {
      // 브라우저 지원 여부 확인
      const isSupported = 'speechSynthesis' in window;
      
      if (!isSupported) {
        setTtsStatus({
          isSupported: false,
          voiceCount: 0,
          canSpeak: false,
          error: 'speechSynthesis API가 지원되지 않습니다.'
        });
        return;
      }

      // 음성 목록 확인
      const voices = speechSynthesis.getVoices();
      const voiceCount = voices.length;

      // 간단한 테스트 실행
      const canSpeak = speechSynthesis.speaking !== undefined;

      setTtsStatus({
        isSupported,
        voiceCount,
        canSpeak,
        error: null
      });

    } catch (error) {
      setTtsStatus({
        isSupported: false,
        voiceCount: 0,
        canSpeak: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  };

  const testBasicTTS = () => {
    setTestResult('테스트 중...');
    
    try {
      // 기존 음성 중단
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance('안녕하세요. TTS 테스트입니다.');
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        setTestResult('✅ TTS 시작됨');
      };
      
      utterance.onend = () => {
        setTestResult('✅ TTS 완료');
      };
      
      utterance.onerror = (event) => {
        setTestResult(`❌ TTS 오류: ${event.error}`);
      };
      
      speechSynthesis.speak(utterance);
      
      // 5초 후 타임아웃 체크
      setTimeout(() => {
        if (testResult === '테스트 중...') {
          setTestResult('⏱️ TTS 타임아웃 (5초)');
        }
      }, 5000);
      
    } catch (error) {
      setTestResult(`❌ 테스트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const getStatusIcon = () => {
    if (!ttsStatus.isSupported || ttsStatus.error) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (ttsStatus.canSpeak && ttsStatus.voiceCount > 0) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>TTS 시스템 진단</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm">
              <strong>브라우저 지원:</strong> {ttsStatus.isSupported ? '✅ 지원됨' : '❌ 지원되지 않음'}
            </div>
            <div className="text-sm">
              <strong>사용 가능한 음성:</strong> {ttsStatus.voiceCount}개
            </div>
            <div className="text-sm">
              <strong>TTS 엔진:</strong> {ttsStatus.canSpeak ? '✅ 정상' : '❌ 비정상'}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <strong>현재 재생 중:</strong> {speechSynthesis.speaking ? '예' : '아니오'}
            </div>
            <div className="text-sm">
              <strong>일시정지 상태:</strong> {speechSynthesis.paused ? '예' : '아니오'}
            </div>
            <div className="text-sm">
              <strong>대기 중:</strong> {speechSynthesis.pending ? '예' : '아니오'}
            </div>
          </div>
        </div>

        {ttsStatus.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-sm text-red-800">
              <strong>오류:</strong> {ttsStatus.error}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex space-x-2">
            <Button 
              onClick={checkTTSStatus}
              variant="outline"
              className="flex-1"
            >
              다시 확인
            </Button>
            <Button 
              onClick={testBasicTTS}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!ttsStatus.isSupported}
            >
              기본 TTS 테스트
            </Button>
          </div>
          
          {testResult && (
            <div className="bg-gray-50 border rounded-lg p-3">
              <div className="text-sm font-medium">테스트 결과:</div>
              <div className="text-sm text-gray-700">{testResult}</div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-800">
            <strong>📋 문제 해결 방법:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>브라우저 새로고침 (Cmd+R)</li>
              <li>다른 브라우저에서 테스트 (Chrome, Safari, Firefox)</li>
              <li>시스템 음성 설정 확인</li>
              <li>브라우저 권한 설정 확인</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}