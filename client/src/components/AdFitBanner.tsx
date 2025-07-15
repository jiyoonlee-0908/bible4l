import { useEffect, useRef } from 'react';

interface AdFitBannerProps {
  adUnit: string;
  adWidth: number;
  adHeight: number;
  className?: string;

}

export function AdFitBanner({ 
  adUnit, 
  adWidth, 
  adHeight, 
  className = ''
}: AdFitBannerProps) {
  const adRef = useRef<HTMLInsElement>(null);

  useEffect(() => {

    // 애드핏 스크립트 로드
    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
    
    // 스크립트가 이미 로드되어 있는지 확인
    const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]');
    if (!existingScript) {
      document.head.appendChild(script);
    }

    // 광고 초기화
    const initAd = () => {
      try {
        if (window.kakao_ad_area && adRef.current) {
          window.kakao_ad_area.push(adRef.current);
        }
      } catch (error) {
        console.error('AdFit 광고 로드 오류:', error);
      }
    };

    // 스크립트 로드 후 광고 초기화
    if (existingScript) {
      initAd();
    } else {
      script.onload = initAd;
    }

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (!existingScript && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [adUnit]);

  const handleAdFail = (element: HTMLElement) => {
    console.log('AdFit 광고 로드 실패');
    // 광고 실패 시 숨김 처리
    element.style.display = 'none';
  };

  return (
    <div className={`adfit-container ${className}`} style={{ 
      margin: '16px 0', 
      textAlign: 'center',
      minHeight: adHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <ins
        ref={adRef}
        className="kakao_ad_area"
        style={{ display: 'none', width: '100%' }}
        data-ad-unit={adUnit}
        data-ad-width={adWidth.toString()}
        data-ad-height={adHeight.toString()}
        data-ad-onfail="handleAdFail"
      />
    </div>
  );
}

// 전역 함수로 광고 실패 콜백 등록
if (typeof window !== 'undefined') {
  (window as any).handleAdFail = (element: HTMLElement) => {
    element.style.display = 'none';
  };
}