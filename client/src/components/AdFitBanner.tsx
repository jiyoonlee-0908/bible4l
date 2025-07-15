import React, { useEffect, useRef } from 'react';

interface AdFitBannerProps {
  adUnit: string;
  adWidth: number;
  adHeight: number;
  className?: string;
  isSubscribed?: boolean; // 구독 사용자는 광고 숨김
}

export function AdFitBanner({ 
  adUnit, 
  adWidth, 
  adHeight, 
  className = "",
  isSubscribed = false 
}: AdFitBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSubscribed) return; // 구독자는 광고 안 보임

    try {
      // AdFit 스크립트가 로드되었는지 확인
      if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
        script.charset = 'utf-8';
        document.head.appendChild(script);
      }
    } catch (error) {
      console.error('AdFit 광고 로드 실패:', error);
    }
  }, [isSubscribed, adUnit]);

  const handleAdFail = (element: HTMLElement) => {
    console.log('AdFit 광고 로드 실패, 대체 콘텐츠 표시');
    element.style.display = 'none';
  };

  // 전역 함수로 등록 (AdFit에서 콜백으로 사용)
  (window as any).handleAdFail = (element: HTMLElement) => {
    handleAdFail(element);
  };

  if (isSubscribed) {
    return null; // 구독자는 광고 안 보임
  }

  return (
    <div 
      ref={adRef}
      className={`adfit-container ${className}`}
      style={{ 
        margin: '16px 0', 
        textAlign: 'center',
        minHeight: adHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <ins
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