import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TTSDebugger() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  useEffect(() => {
    // Web Speech API 지원 확인
    setIsSupported('speechSynthesis' in window);
    
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        console.log('사용 가능한 음성들:', availableVoices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const testVoice = (voice: SpeechSynthesisVoice, language: string) => {
    const testTexts = {
      ko: '안녕하세요. 한국어 음성 테스트입니다.',
      en: 'Hello. This is an English voice test.',
      zh: '你好。这是中文语音测试。',
      ja: 'こんにちは。これは日本語の音声テストです。'
    };

    const text = testTexts[language as keyof typeof testTexts] || testTexts.en;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
      setTestResults(prev => ({ ...prev, [voice.name]: '재생 중...' }));
    };
    
    utterance.onend = () => {
      setTestResults(prev => ({ ...prev, [voice.name]: '재생 완료' }));
    };
    
    utterance.onerror = (event) => {
      setTestResults(prev => ({ ...prev, [voice.name]: `오류: ${event.error}` }));
    };

    speechSynthesis.speak(utterance);
  };

  const getVoicesByLanguage = (lang: string) => {
    return voices.filter(voice => 
      voice.lang.toLowerCase().includes(lang.toLowerCase()) ||
      voice.name.toLowerCase().includes(lang.toLowerCase())
    );
  };

  if (!isSupported) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-red-600">TTS 지원 안됨</CardTitle>
        </CardHeader>
        <CardContent>
          <p>이 브라우저는 Web Speech API를 지원하지 않습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>TTS 음성 디버거</CardTitle>
        <p className="text-sm text-gray-600">총 {voices.length}개의 음성 사용 가능</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {['ko', 'en', 'zh', 'ja'].map(lang => {
            const languageVoices = getVoicesByLanguage(lang);
            const langNames = { ko: '한국어', en: '영어', zh: '중국어', ja: '일본어' };
            
            return (
              <div key={lang} className="border p-3 rounded">
                <h3 className="font-semibold mb-2">
                  {langNames[lang as keyof typeof langNames]} ({languageVoices.length}개)
                </h3>
                {languageVoices.length === 0 ? (
                  <p className="text-red-500 text-sm">사용 가능한 음성이 없습니다</p>
                ) : (
                  <div className="space-y-2">
                    {languageVoices.slice(0, 3).map(voice => (
                      <div key={voice.name} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div>
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-xs text-gray-500">
                            {voice.lang} | {voice.localService ? '로컬' : '온라인'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">
                            {testResults[voice.name] || '미테스트'}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => testVoice(voice, lang)}
                            variant="outline"
                          >
                            테스트
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">빠른 테스트</h4>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance('안녕하세요. 음성 테스트입니다.');
                  utterance.lang = 'ko-KR';
                  speechSynthesis.speak(utterance);
                }}
                size="sm"
              >
                한국어 테스트
              </Button>
              <Button
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance('Hello. This is a voice test.');
                  utterance.lang = 'en-US';
                  speechSynthesis.speak(utterance);
                }}
                size="sm"
              >
                영어 테스트
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}