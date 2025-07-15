import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Language, languageConfig } from '@shared/schema';

interface VoiceInfo {
  name: string;
  lang: string;
  voiceURI: string;
  localService: boolean;
  default: boolean;
  quality: number;
}

export function VoiceDebugger() {
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const voiceInfos = availableVoices.map(voice => {
        // 맥북 음성 품질 점수 계산
        let quality = 0;
        
        // Google TTS
        if (voice.name.toLowerCase().includes('google')) {
          quality += 50;
        }
        
        // Apple/Mac 시스템 음성들
        if (voice.name.toLowerCase().includes('apple') || 
            voice.name.toLowerCase().includes('enhanced') ||
            voice.name.toLowerCase().includes('premium') ||
            voice.name.toLowerCase().includes('compact')) {
          quality += 45;
        }
        
        // 맥북 내장 한국어 음성들
        const macKoreanVoices = ['yuna', 'suhyeon', 'jisun'];
        const macEnglishVoices = ['alex', 'samantha', 'victoria', 'karen'];
        const macChineseVoices = ['tingting', 'sinji'];
        const macJapaneseVoices = ['kyoko', 'otoya'];
        
        const allMacVoices = [...macKoreanVoices, ...macEnglishVoices, ...macChineseVoices, ...macJapaneseVoices];
        if (allMacVoices.some(name => voice.name.toLowerCase().includes(name))) {
          quality += 40;
        }
        
        // 언어 매칭
        if (voice.lang.includes('ko') || voice.lang.includes('en') || 
            voice.lang.includes('zh') || voice.lang.includes('ja')) {
          quality += 30;
        }
        
        // 로컬 서비스
        if (voice.localService) {
          quality += 20;
        }
        
        return {
          name: voice.name,
          lang: voice.lang,
          voiceURI: voice.voiceURI,
          localService: voice.localService,
          default: voice.default,
          quality
        };
      });
      
      // 품질 점수 순으로 정렬
      voiceInfos.sort((a, b) => b.quality - a.quality);
      setVoices(voiceInfos);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const testVoice = (voiceInfo: VoiceInfo, language: Language) => {
    // 기존 재생 중단
    speechSynthesis.cancel();
    
    const voice = speechSynthesis.getVoices().find(v => v.name === voiceInfo.name);
    if (!voice) {
      setTestResults(prev => ({ ...prev, [voiceInfo.name]: '음성을 찾을 수 없음' }));
      return;
    }

    const testTexts = {
      ko: '안녕하세요. 성경 말씀을 들려드리겠습니다.',
      en: 'Hello. I will read the Bible verse for you.',
      zh: '你好。我将为你朗读圣经经文。',
      ja: 'こんにちは。聖書の言葉をお読みします。'
    };

    setTestResults(prev => ({ ...prev, [voiceInfo.name]: '준비 중...' }));

    // 작은 지연 후 재생 (브라우저 호환성)
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(testTexts[language]);
      utterance.voice = voice;
      utterance.rate = 0.9;
      utterance.volume = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        setTestResults(prev => ({ ...prev, [voiceInfo.name]: '🔊 재생 중...' }));
        setCurrentVoice(voice);
        console.log(`음성 재생 시작: ${voice.name} (${voice.lang})`);
      };
      
      utterance.onend = () => {
        setTestResults(prev => ({ ...prev, [voiceInfo.name]: '✅ 재생 완료' }));
        console.log(`음성 재생 완료: ${voice.name}`);
      };
      
      utterance.onerror = (event) => {
        setTestResults(prev => ({ ...prev, [voiceInfo.name]: `❌ 오류: ${event.error}` }));
        console.error(`음성 재생 오류: ${voice.name}`, event.error);
      };

      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        setTestResults(prev => ({ ...prev, [voiceInfo.name]: `❌ 재생 실패: ${error}` }));
        console.error('음성 재생 실패:', error);
      }
    }, 100);
  };

  const getLanguageFromCode = (langCode: string): Language | null => {
    if (langCode.includes('ko')) return 'ko';
    if (langCode.includes('en')) return 'en';
    if (langCode.includes('zh') || langCode.includes('cmn')) return 'zh';
    if (langCode.includes('ja')) return 'ja';
    return null;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🎤 현재 사용 중인 음성 분석</CardTitle>
        </CardHeader>
        <CardContent>
          {currentVoice ? (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800">✅ 현재 재생 중인 음성:</div>
              <div className="text-sm text-green-700 mt-2">
                <div><strong>이름:</strong> {currentVoice.name}</div>
                <div><strong>언어:</strong> {currentVoice.lang}</div>
                <div><strong>URI:</strong> {currentVoice.voiceURI}</div>
                <div><strong>로컬:</strong> {currentVoice.localService ? '예' : '아니오'}</div>
                <div><strong>기본값:</strong> {currentVoice.default ? '예' : '아니오'}</div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                아래에서 음성을 테스트하면 어떤 음성이 사용되는지 확인할 수 있습니다.
                <br />
                <strong>주의:</strong> 브라우저에서 음소거가 해제되어 있는지 확인하세요.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 맥북 최적화 음성 목록 (품질 순)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {voices.slice(0, 20).map((voice, index) => {
              const language = getLanguageFromCode(voice.lang);
              return (
                <div key={voice.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={voice.quality >= 70 ? 'default' : voice.quality >= 40 ? 'secondary' : 'outline'}>
                        품질: {voice.quality}
                      </Badge>
                      <span className="font-semibold">{voice.name}</span>
                      {voice.localService && <Badge variant="outline">로컬</Badge>}
                      {voice.default && <Badge variant="outline">기본</Badge>}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      언어: {voice.lang} | URI: {voice.voiceURI}
                    </div>
                    {testResults[voice.name] && (
                      <div className="text-xs text-blue-600 mt-1">
                        {testResults[voice.name]}
                      </div>
                    )}
                  </div>
                  {language && (
                    <Button
                      size="sm"
                      onClick={() => testVoice(voice, language)}
                      variant="outline"
                    >
                      테스트
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}