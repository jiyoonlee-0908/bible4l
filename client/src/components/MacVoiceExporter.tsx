import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Copy } from 'lucide-react';

export function MacVoiceExporter() {
  const [exportedConfig, setExportedConfig] = useState<string>('');

  const exportMacVoiceConfig = () => {
    const voices = speechSynthesis.getVoices();
    
    // 맥북의 고품질 음성들 필터링
    const macVoices = voices.filter(voice => {
      const name = voice.name.toLowerCase();
      const premiumVoices = ['karen', 'samantha', 'alex', 'victoria', 'yuna', 'tingting', 'sinji', 'kyoko', 'otoya'];
      return premiumVoices.some(premium => name.includes(premium)) && voice.localService;
    });

    // 안드로이드에서 사용할 수 있는 설정 생성
    const voiceConfig = {
      preferredVoices: {
        ko: macVoices.filter(v => v.lang.includes('ko')).map(v => ({
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI,
          fallback: 'Google 한국의'
        })),
        en: macVoices.filter(v => v.lang.includes('en')).map(v => ({
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI,
          fallback: 'Google US English'
        })),
        zh: macVoices.filter(v => v.lang.includes('zh')).map(v => ({
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI,
          fallback: 'Google 普通话（中国大陆）'
        })),
        ja: macVoices.filter(v => v.lang.includes('ja')).map(v => ({
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI,
          fallback: 'Google 日本語'
        }))
      },
      voiceSettings: {
        rate: 0.9,
        volume: 0.8,
        pitch: 1.0
      },
      fallbackStrategy: [
        'Google TTS (권장)',
        'Samsung TTS',
        '시스템 기본 TTS'
      ]
    };

    const configText = JSON.stringify(voiceConfig, null, 2);
    setExportedConfig(configText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportedConfig);
    alert('설정이 클립보드에 복사되었습니다!');
  };

  const downloadConfig = () => {
    const blob = new Blob([exportedConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mac-voice-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💻 맥북 음성 설정 내보내기
          <Badge variant="secondary">실험적 기능</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <strong>기능 설명:</strong>
            <br />
            맥북에서 사용 중인 고품질 음성 설정을 추출하여 안드로이드에서도 비슷한 품질로 재생할 수 있도록 설정을 생성합니다.
          </div>
        </div>

        <Button 
          onClick={exportMacVoiceConfig}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Download className="w-4 h-4 mr-2" />
          맥북 음성 설정 추출하기
        </Button>

        {exportedConfig && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="text-sm font-medium text-gray-800 mb-2">
                추출된 음성 설정:
              </div>
              <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-auto max-h-40">
                {exportedConfig}
              </pre>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                복사
              </Button>
              <Button
                onClick={downloadConfig}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="text-sm text-amber-800">
                <strong>사용 방법:</strong>
                <br />
                1. 이 설정을 안드로이드 개발자에게 전달
                <br />
                2. Google TTS 앱을 설치하고 해당 언어팩 다운로드
                <br />
                3. 앱에서 이 설정을 기반으로 음성 우선순위 적용
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}