import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Volume2, Download, CheckCircle, XCircle, Smartphone, Info } from 'lucide-react';

interface VoiceSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceSetupGuide({ isOpen, onClose }: VoiceSetupGuideProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [testResults, setTestResults] = useState<{[key: string]: 'success' | 'error' | 'testing'}>({});

  useEffect(() => {
    if (isOpen) {
      loadVoices();
    }
  }, [isOpen]);

  const loadVoices = () => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    
    if (availableVoices.length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        setVoices(speechSynthesis.getVoices());
      };
    }
  };

  const testVoice = async (voice: SpeechSynthesisVoice, testText: string) => {
    setTestResults(prev => ({ ...prev, [voice.name]: 'testing' }));
    
    try {
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.voice = voice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.5;
      
      await new Promise<void>((resolve, reject) => {
        utterance.onend = () => {
          setTestResults(prev => ({ ...prev, [voice.name]: 'success' }));
          resolve();
        };
        utterance.onerror = (error) => {
          setTestResults(prev => ({ ...prev, [voice.name]: 'error' }));
          reject(error);
        };
        speechSynthesis.speak(utterance);
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, [voice.name]: 'error' }));
    }
  };

  const getVoicesByLanguage = () => {
    const languageGroups = {
      'ko-KR': voices.filter(v => v.lang.startsWith('ko')),
      'en-US': voices.filter(v => v.lang.startsWith('en')),
      'zh-CN': voices.filter(v => v.lang.startsWith('zh')),
      'ja-JP': voices.filter(v => v.lang.startsWith('ja'))
    };
    return languageGroups;
  };

  const getRecommendedVoices = (langVoices: SpeechSynthesisVoice[]) => {
    const googleVoices = langVoices.filter(v => 
      v.name.toLowerCase().includes('google') || 
      v.name.includes('Standard') ||
      v.name.includes('Neural')
    );
    
    const localVoices = langVoices.filter(v => v.localService);
    const remoteVoices = langVoices.filter(v => !v.localService);
    
    return { googleVoices, localVoices, remoteVoices };
  };

  const testTexts = {
    'ko-KR': '안녕하세요. 성경 말씀을 들려드립니다.',
    'en-US': 'Hello. I will read the Bible verses for you.',
    'zh-CN': '你好。我将为您朗读圣经经文。',
    'ja-JP': 'こんにちは。聖書の言葉をお読みします。'
  };

  if (!isOpen) return null;

  const voicesByLanguage = getVoicesByLanguage();
  const hasGoogleVoices = Object.values(voicesByLanguage).some(voices => 
    voices.some(v => v.name.toLowerCase().includes('google'))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amber-800">음성 설정 가이드</h2>
            <Button onClick={onClose} variant="ghost" size="sm">✕</Button>
          </div>

          {!hasGoogleVoices && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>모바일에서 최적의 음성 품질을 위해:</strong>
                <br />
                • Android: Chrome 브라우저 사용 권장
                <br />
                • iOS: Safari 브라우저 사용 권장
                <br />
                • 인터넷 연결이 있을 때 Google 음성이 자동으로 사용됩니다
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {Object.entries(voicesByLanguage).map(([lang, langVoices]) => {
              if (langVoices.length === 0) return null;
              
              const { googleVoices, localVoices, remoteVoices } = getRecommendedVoices(langVoices);
              const langName = {
                'ko-KR': '한국어',
                'en-US': 'English',
                'zh-CN': '中文',
                'ja-JP': '日本語'
              }[lang] || lang;

              return (
                <Card key={lang} className="border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-amber-800">{langName}</CardTitle>
                    <CardDescription>
                      사용 가능한 음성: {langVoices.length}개
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {googleVoices.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          추천 음성 (Google)
                        </h4>
                        <div className="grid gap-2">
                          {googleVoices.map((voice) => (
                            <div key={voice.name} className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  {voice.name}
                                </Badge>
                                <span className="text-sm text-gray-600">{voice.lang}</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => testVoice(voice, testTexts[lang as keyof typeof testTexts] || 'Test')}
                                disabled={testResults[voice.name] === 'testing'}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {testResults[voice.name] === 'testing' ? (
                                  '테스트 중...'
                                ) : testResults[voice.name] === 'success' ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : testResults[voice.name] === 'error' ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {localVoices.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                          <Smartphone className="w-4 h-4 mr-2" />
                          기기 내장 음성
                        </h4>
                        <div className="grid gap-2">
                          {localVoices.slice(0, 3).map((voice) => (
                            <div key={voice.name} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="border-blue-200 text-blue-800">
                                  {voice.name}
                                </Badge>
                                <span className="text-sm text-gray-600">{voice.lang}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => testVoice(voice, testTexts[lang as keyof typeof testTexts] || 'Test')}
                                disabled={testResults[voice.name] === 'testing'}
                              >
                                {testResults[voice.name] === 'testing' ? (
                                  '테스트 중...'
                                ) : testResults[voice.name] === 'success' ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : testResults[voice.name] === 'error' ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {remoteVoices.length > 0 && googleVoices.length === 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          <Download className="w-4 h-4 mr-2" />
                          온라인 음성
                        </h4>
                        <div className="grid gap-2">
                          {remoteVoices.slice(0, 2).map((voice) => (
                            <div key={voice.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {voice.name}
                                </Badge>
                                <span className="text-sm text-gray-600">{voice.lang}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => testVoice(voice, testTexts[lang as keyof typeof testTexts] || 'Test')}
                                disabled={testResults[voice.name] === 'testing'}
                              >
                                {testResults[voice.name] === 'testing' ? (
                                  '테스트 중...'
                                ) : testResults[voice.name] === 'success' ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : testResults[voice.name] === 'error' ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <h3 className="font-semibold text-amber-800 mb-2">모바일 음성 개선 팁</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• 인터넷 연결 시 Google 음성이 자동으로 사용됩니다</li>
              <li>• 앱을 다시 열면 새로운 음성이 감지될 수 있습니다</li>
              <li>• 음성이 이상하면 브라우저를 새로고침해보세요</li>
              <li>• Chrome(Android) 또는 Safari(iOS) 브라우저 사용 권장</li>
            </ul>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <Button variant="outline" onClick={loadVoices}>
              음성 새로고침
            </Button>
            <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700">
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}