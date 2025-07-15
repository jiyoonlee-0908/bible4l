import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface VoiceStatus {
  language: string;
  code: string;
  flag: string;
  available: boolean;
  voiceCount: number;
  bestVoice?: SpeechSynthesisVoice;
  hasGoogleVoice: boolean;
}

interface VoiceLanguageCheckerProps {
  onVoiceCheck: (status: VoiceStatus[]) => void;
}

export function VoiceLanguageChecker({ onVoiceCheck }: VoiceLanguageCheckerProps) {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [testingVoice, setTestingVoice] = useState<string | null>(null);

  const languages = [
    { code: 'ko-KR', language: '한국어', flag: '🇰🇷', testText: '안녕하세요. 성경 말씀을 들려드립니다.' },
    { code: 'en-US', language: 'English', flag: '🇺🇸', testText: 'Hello. I will read the Bible verses for you.' },
    { code: 'zh-CN', language: '中文', flag: '🇨🇳', testText: '你好。我将为您朗读圣经经文。' },
    { code: 'ja-JP', language: '日本語', flag: '🇯🇵', testText: 'こんにちは。聖書の言葉をお読みします。' }
  ];

  const checkVoiceAvailability = async () => {
    setIsChecking(true);
    
    try {
      // Wait for voices to fully load
      await new Promise<void>((resolve) => {
        let attempts = 0;
        const checkVoices = () => {
          const voices = speechSynthesis.getVoices();
          attempts++;
          if (voices.length > 0 || attempts > 20) {
            resolve();
          } else {
            setTimeout(checkVoices, 200);
          }
        };
        checkVoices();
      });

      const allVoices = speechSynthesis.getVoices();
      console.log('Total available voices:', allVoices.length);
      
      const status: VoiceStatus[] = languages.map(lang => {
        // Find voices for this language
        const languageVoices = allVoices.filter(voice => 
          voice.lang.toLowerCase().startsWith(lang.code.toLowerCase().substring(0, 2)) ||
          voice.lang.toLowerCase() === lang.code.toLowerCase()
        );

        // Find Google voices specifically
        const googleVoices = languageVoices.filter(voice =>
          voice.name.toLowerCase().includes('google') ||
          voice.voiceURI.toLowerCase().includes('google') ||
          voice.name.toLowerCase().includes('chrome')
        );

        // Select best voice (prefer Google, then local, then any)
        let bestVoice = googleVoices[0];
        if (!bestVoice && languageVoices.length > 0) {
          bestVoice = languageVoices.find(v => v.localService) || languageVoices[0];
        }

        console.log(`${lang.language} voices:`, {
          total: languageVoices.length,
          google: googleVoices.length,
          selected: bestVoice?.name || 'None'
        });

        return {
          language: lang.language,
          code: lang.code,
          flag: lang.flag,
          available: languageVoices.length > 0,
          voiceCount: languageVoices.length,
          bestVoice,
          hasGoogleVoice: googleVoices.length > 0
        };
      });

      setVoiceStatus(status);
      onVoiceCheck(status);

    } catch (error) {
      console.error('Voice check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const testVoice = async (status: VoiceStatus, testText: string) => {
    if (!status.bestVoice) return;
    
    setTestingVoice(status.code);
    
    try {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.voice = status.bestVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setTestingVoice(null);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setTestingVoice(null);
      };
      
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Test voice failed:', error);
      setTestingVoice(null);
    }
  };

  const openLanguageInstaller = (langCode: string) => {
    const language = langCode.substring(0, 2);
    
    // Try Android TTS language install intent
    const attempts = [
      () => {
        // Android specific language install
        window.open(`intent://com.google.android.tts/voice/download?lang=${language}#Intent;scheme=https;package=com.google.android.tts;end`, '_self');
      },
      () => {
        // General TTS settings
        window.open('intent://com.android.settings/.tts.TextToSpeechSettings#Intent;scheme=android-app;end', '_self');
      },
      () => {
        // Fallback to Google TTS app
        window.open('https://play.google.com/store/apps/details?id=com.google.android.tts', '_blank');
      }
    ];

    let success = false;
    for (const attempt of attempts) {
      try {
        attempt();
        success = true;
        break;
      } catch (e) {
        continue;
      }
    }

    if (!success) {
      alert(`${language === 'ko' ? '한국어' : language === 'en' ? 'English' : language === 'zh' ? '中文' : '日本語'} 음성을 설치하려면:\n1. 설정 > 손쉬운 사용 > 텍스트 음성 변환\n2. Google TTS > 언어 > ${language} 추가`);
    }
  };

  useEffect(() => {
    checkVoiceAvailability();
  }, []);

  if (isChecking) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <div className="text-sm text-gray-600">언어별 음성 상태 확인 중...</div>
      </div>
    );
  }

  const missingLanguages = voiceStatus.filter(s => !s.available);
  const noGoogleVoices = voiceStatus.filter(s => s.available && !s.hasGoogleVoice);

  return (
    <div className="space-y-4">
      {/* 언어별 상태 */}
      <div className="grid grid-cols-2 gap-2">
        {voiceStatus.map((status) => (
          <div key={status.code} className={`p-3 rounded-lg border ${
            status.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{status.flag}</span>
                <span className="text-sm font-medium">{status.language}</span>
              </div>
              <Badge variant={status.available ? "default" : "destructive"} className="text-xs">
                {status.available ? '✅' : '❌'}
              </Badge>
            </div>
            
            <div className="text-xs text-gray-600 mb-2">
              음성: {status.voiceCount}개 | Google: {status.hasGoogleVoice ? 'O' : 'X'}
            </div>

            <div className="flex gap-1">
              {status.available && (
                <Button
                  onClick={() => {
                    const lang = languages.find(l => l.code === status.code);
                    if (lang) testVoice(status, lang.testText);
                  }}
                  disabled={testingVoice === status.code}
                  variant="outline"
                  size="sm"
                  className="text-xs flex-1"
                >
                  {testingVoice === status.code ? '테스트 중...' : '🎵 테스트'}
                </Button>
              )}
              
              {!status.available && (
                <Button
                  onClick={() => openLanguageInstaller(status.code)}
                  variant="outline"
                  size="sm"
                  className="text-xs flex-1"
                >
                  📥 설치
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 문제점 안내 */}
      {missingLanguages.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription>
            <strong>⚠️ 누락된 언어:</strong> {missingLanguages.map(l => l.language).join(', ')}
            <br />
            <span className="text-xs">Google TTS에서 해당 언어 음성을 다운로드해 주세요.</span>
          </AlertDescription>
        </Alert>
      )}

      {noGoogleVoices.length > 0 && missingLanguages.length === 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertDescription>
            <strong>💡 품질 개선 가능:</strong> {noGoogleVoices.map(l => l.language).join(', ')}
            <br />
            <span className="text-xs">Google TTS 음성으로 변경하면 더 자연스러운 발음을 들을 수 있습니다.</span>
          </AlertDescription>
        </Alert>
      )}

      {/* 재검사 */}
      <div className="text-center">
        <Button onClick={checkVoiceAvailability} variant="ghost" size="sm">
          🔄 음성 상태 재검사
        </Button>
      </div>
    </div>
  );
}