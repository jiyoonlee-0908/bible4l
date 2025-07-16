import { useEffect, useState } from 'react';

interface TTSSetupState {
  isInitialized: boolean;
  hasVoiceData: boolean;
  availableLanguages: string[];
  isInstalling: boolean;
}

export function useTTSSetup() {
  const [ttsState, setTtsState] = useState<TTSSetupState>({
    isInitialized: false,
    hasVoiceData: false,
    availableLanguages: [],
    isInstalling: false
  });

  useEffect(() => {
    initializeTTS();
  }, []);

  const initializeTTS = async () => {
    try {
      // 안드로이드 앱인지 확인
      const isAndroidApp = window.navigator.userAgent.includes('wv') || 
                          (window as any).Android || 
                          (window as any).capacitor;

      if (!isAndroidApp) {
        // 웹 브라우저에서는 기본 TTS만 사용
        setTtsState(prev => ({ ...prev, isInitialized: true, hasVoiceData: true }));
        return;
      }

      // Android에서 TTS 음성 데이터 확인
      await checkTTSVoiceData();
    } catch (error) {
      console.error('TTS 초기화 오류:', error);
      setTtsState(prev => ({ ...prev, isInitialized: true }));
    }
  };

  const checkTTSVoiceData = async () => {
    return new Promise<void>((resolve) => {
      // Android WebView에서 TTS 확인
      if ((window as any).Android && (window as any).Android.checkTTSData) {
        (window as any).Android.checkTTSData();
        resolve();
        return;
      }

      // Capacitor 플러그인 사용
      if ((window as any).capacitor) {
        checkCapacitorTTS();
        resolve();
        return;
      }

      // 기본 웹 TTS 확인
      checkWebTTS();
      resolve();
    });
  };

  const checkCapacitorTTS = async () => {
    try {
      // Capacitor에서 네이티브 TTS 상태 확인
      const voices = speechSynthesis.getVoices();
      const targetLanguages = ['ko-KR', 'en-US', 'zh-CN', 'ja-JP'];
      
      const availableLanguages = voices
        .filter(voice => targetLanguages.some(lang => voice.lang.startsWith(lang.split('-')[0])))
        .map(voice => voice.lang);

      if (availableLanguages.length < 2) {
        // 음성 데이터 부족시 설치 안내
        await promptVoiceInstallation();
      } else {
        setTtsState(prev => ({ 
          ...prev, 
          isInitialized: true, 
          hasVoiceData: true,
          availableLanguages 
        }));
      }
    } catch (error) {
      console.error('Capacitor TTS 확인 오류:', error);
      await promptVoiceInstallation();
    }
  };

  const checkWebTTS = () => {
    const voices = speechSynthesis.getVoices();
    const targetLanguages = ['ko', 'en', 'zh', 'ja'];
    
    const availableLanguages = voices
      .filter(voice => targetLanguages.some(lang => voice.lang.startsWith(lang)))
      .map(voice => voice.lang);

    setTtsState(prev => ({ 
      ...prev, 
      isInitialized: true, 
      hasVoiceData: availableLanguages.length > 0,
      availableLanguages 
    }));
  };

  const promptVoiceInstallation = async () => {
    setTtsState(prev => ({ ...prev, isInstalling: true }));

    // Android 설정으로 이동하는 함수
    const openAndroidTTSSettings = () => {
      try {
        // Capacitor를 통한 설정 앱 열기
        if ((window as any).capacitor) {
          (window as any).capacitor.Plugins.App.openUrl({
            url: 'android-app://com.android.settings/.Settings$TextToSpeechSettingsActivity'
          });
        }
        
        // 또는 직접 Intent 호출 (Android WebView)
        if ((window as any).Android && (window as any).Android.openTTSSettings) {
          (window as any).Android.openTTSSettings();
        }
      } catch (error) {
        console.error('TTS 설정 열기 오류:', error);
        // 사용자에게 수동 안내
        showManualInstallationGuide();
      }
    };

    // 사용자에게 음성팩 설치 안내
    const userConfirmed = confirm(
      '더 나은 음성 품질을 위해 음성팩을 설치하시겠습니까?\n\n' +
      '확인을 누르면 설정 > 일반 > 언어팩으로 이동합니다.\n' +
      '한국어, 영어(미국), 일본어, 중국어(중국 본토) 음성팩을 다운로드해주세요.'
    );

    if (userConfirmed) {
      openAndroidTTSSettings();
    }

    setTtsState(prev => ({ ...prev, isInstalling: false }));
  };

  const showManualInstallationGuide = () => {
    alert(
      '음성팩 수동 설치 방법:\n\n' +
      '1. 안드로이드 설정 앱 열기\n' +
      '2. 일반 > 언어 및 입력 > 텍스트 음성 변환\n' +
      '3. Google 텍스트 음성 변환 > 음성 데이터 설치\n' +
      '4. 한국어, 영어(미국), 일본어, 중국어(중국 본토) 다운로드\n' +
      '5. 앱으로 돌아와서 새로고침'
    );
  };

  const refreshTTSCheck = () => {
    setTtsState({
      isInitialized: false,
      hasVoiceData: false,
      availableLanguages: [],
      isInstalling: false
    });
    initializeTTS();
  };

  return {
    ...ttsState,
    refreshTTSCheck,
    promptVoiceInstallation
  };
}