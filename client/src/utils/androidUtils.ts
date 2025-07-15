// 안드로이드 환경에서 TTS 설정 페이지로 직접 이동하는 유틸리티

export const isAndroidApp = (): boolean => {
  return (window as any).AndroidInterface !== undefined || 
         navigator.userAgent.includes('wv') || // WebView 환경
         window.location.protocol === 'file:' || // 안드로이드 앱 내부
         (window as any).Android !== undefined;
};

export const openTTSSettings = async (): Promise<boolean> => {
  try {
    // 안드로이드 앱 환경에서 TTS 설정 페이지 열기
    if (isAndroidApp()) {
      // Capacitor 환경에서 시스템 설정 열기
      if ((window as any).Capacitor) {
        try {
          const { App } = await import('@capacitor/app');
          await App.openUrl({
            url: 'android-app://com.android.settings/.TtsSettings'
          });
          return true;
        } catch (e) {
          // 대안 URL 시도
          try {
            const { App } = await import('@capacitor/app');
            await App.openUrl({
              url: 'android-app://com.android.settings/com.android.settings.TTS_SETTINGS'
            });
            return true;
          } catch (e2) {
            console.error('Capacitor TTS 설정 열기 실패:', e2);
            return false;
          }
        }
      }
      
      // 일반 안드로이드 웹뷰에서 인텐트 URL 사용
      if ((window as any).AndroidInterface) {
        (window as any).AndroidInterface.openTTSSettings();
        return true;
      }
      
      // 일반 웹뷰에서 인텐트 URL 직접 시도
      try {
        window.open('android-app://com.android.settings/.TtsSettings', '_system');
        return true;
      } catch (e) {
        console.error('웹뷰 TTS 설정 열기 실패:', e);
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('TTS 설정 열기 실패:', error);
    return false;
  }
};

export const checkTTSLanguages = async (): Promise<string[]> => {
  try {
    if ('speechSynthesis' in window) {
      const voices = speechSynthesis.getVoices();
      const supportedLanguages: string[] = [];
      
      // 필요한 언어 체크
      const requiredLanguages = ['ko-KR', 'en-US', 'ja-JP', 'zh-CN'];
      
      requiredLanguages.forEach(lang => {
        const hasVoice = voices.some(voice => 
          voice.lang.startsWith(lang.split('-')[0])
        );
        if (hasVoice) {
          supportedLanguages.push(lang);
        }
      });
      
      return supportedLanguages;
    }
    
    return [];
  } catch (error) {
    console.error('TTS 언어 체크 실패:', error);
    return [];
  }
};