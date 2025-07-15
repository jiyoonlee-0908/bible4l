import React, { useState, useEffect } from 'react';
import { Storage } from '@/lib/storage';

interface SubscriptionState {
  isSubscribed: boolean;
  subscriptionType: 'free' | 'premium';
  expiryDate?: Date;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isSubscribed: false,
    subscriptionType: 'free'
  });

  useEffect(() => {
    // 로컬 스토리지에서 구독 상태 로드
    const savedSubscription = localStorage.getItem('subscription');
    if (savedSubscription) {
      try {
        const parsed = JSON.parse(savedSubscription);
        if (parsed.expiryDate) {
          parsed.expiryDate = new Date(parsed.expiryDate);
          // 만료일 확인
          if (parsed.expiryDate > new Date()) {
            setSubscription(parsed);
          } else {
            // 만료된 구독 정리
            localStorage.removeItem('subscription');
          }
        }
      } catch (error) {
        console.error('구독 정보 로드 오류:', error);
      }
    }
  }, []);

  const activateSubscription = (months: number = 1) => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);
    
    const newSubscription: SubscriptionState = {
      isSubscribed: true,
      subscriptionType: 'premium',
      expiryDate
    };

    setSubscription(newSubscription);
    localStorage.setItem('subscription', JSON.stringify(newSubscription));
  };

  const cancelSubscription = () => {
    const newSubscription: SubscriptionState = {
      isSubscribed: false,
      subscriptionType: 'free'
    };

    setSubscription(newSubscription);
    localStorage.removeItem('subscription');
  };

  const getRemainingDays = (): number => {
    if (!subscription.expiryDate) return 0;
    const today = new Date();
    const diffTime = subscription.expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return {
    subscription,
    activateSubscription,
    cancelSubscription,
    getRemainingDays,
    isSubscribed: subscription.isSubscribed
  };
}