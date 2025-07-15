// TTS 권한 및 언어팩 관리 유틸리티

export const requestTTSPermissions = async (): Promise<boolean> => {
  try {
    // 안드로이드 앱에서 TTS 권한 요청
    if ((window as any).Capacitor) {
      const { Device } = await import('@capacitor/device');
      const info = await Device.getInfo();
      
      if (info.platform === 'android') {
        // 안드로이드에서 TTS 권한 요청
        const { CapacitorHttp } = await import('@capacitor/core');
        
        // TTS 엔진 상태 확인
        const ttsAvailable = 'speechSynthesis' in window;
        
        if (ttsAvailable) {
          // 사용 가능한 음성 목록 가져오기
          const voices = speechSynthesis.getVoices();
          console.log('사용 가능한 음성:', voices);
          
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('TTS 권한 요청 실패:', error);
    return false;
  }
};

export const checkInstalledTTSLanguages = (): string[] => {
  const voices = speechSynthesis.getVoices();
  const installedLanguages: string[] = [];
  
  // 필요한 언어들
  const requiredLanguages = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: '영어' },
    { code: 'ja', name: '일본어' },
    { code: 'zh', name: '중국어' }
  ];
  
  requiredLanguages.forEach(lang => {
    const hasVoice = voices.some(voice => 
      voice.lang.toLowerCase().startsWith(lang.code.toLowerCase())
    );
    if (hasVoice) {
      installedLanguages.push(lang.code);
    }
  });
  
  return installedLanguages;
};

export const getLanguagePackStatus = () => {
  const installed = checkInstalledTTSLanguages();
  const required = ['ko', 'en', 'ja', 'zh'];
  
  return {
    installed,
    missing: required.filter(lang => !installed.includes(lang)),
    isComplete: installed.length === required.length
  };
};