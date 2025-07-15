import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first_listen',
    name: '첫 음성 듣기',
    description: '첫 번째 성경 구절을 들었습니다',
    condition: 'first_listen',
    iconType: 'special',
    metallic: false,
  },
  {
    id: 'streak_7',
    name: '일주일 연속',
    description: '7일 연속으로 성경을 들었습니다',
    condition: 'streak_7',
    iconType: 'streak',
    metallic: false,
  },
  {
    id: 'streak_30',
    name: '한 달 연속',
    description: '30일 연속으로 성경을 들었습니다',
    condition: 'streak_30',
    iconType: 'streak',
    metallic: true,
  },
  {
    id: 'listening_60',
    name: '1시간 청취',
    description: '총 1시간 이상 성경을 들었습니다',
    condition: 'listening_60',
    iconType: 'time',
    metallic: false,
  },
  {
    id: 'listening_300',
    name: '5시간 청취',
    description: '총 5시간 이상 성경을 들었습니다',
    condition: 'listening_300',
    iconType: 'time',
    metallic: true,
  },
  {
    id: 'plan_25',
    name: '계획 25% 달성',
    description: '통독 계획을 25% 완료했습니다',
    condition: 'plan_25',
    iconType: 'completion',
    metallic: false,
  },
  {
    id: 'plan_50',
    name: '계획 50% 달성',
    description: '통독 계획을 50% 완료했습니다',
    condition: 'plan_50',
    iconType: 'completion',
    metallic: true,
  },
  {
    id: 'plan_100',
    name: '통독 완주',
    description: '성경 통독 계획을 완료했습니다',
    condition: 'plan_100',
    iconType: 'completion',
    metallic: true,
  },
  {
    id: 'bookmark_10',
    name: '북마크 수집가',
    description: '10개 이상의 구절을 북마크했습니다',
    condition: 'bookmark_10',
    iconType: 'special',
    metallic: false,
  },
];

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const { toast } = useToast();

  const checkAndUnlockBadge = useCallback((condition: string, value?: number) => {
    setBadges(currentBadges => {
      const badge = currentBadges.find(b => b.condition === condition && !b.unlockedAt);
      if (!badge) return currentBadges;

      let shouldUnlock = false;

      switch (condition) {
        case 'first_listen':
          shouldUnlock = true;
          break;
        case 'streak_7':
          shouldUnlock = value !== undefined && value >= 7;
          break;
        case 'streak_30':
          shouldUnlock = value !== undefined && value >= 30;
          break;
        case 'listening_60':
          shouldUnlock = value !== undefined && value >= 60; // minutes
          break;
        case 'listening_300':
          shouldUnlock = value !== undefined && value >= 300; // minutes
          break;
        case 'plan_25':
          shouldUnlock = value !== undefined && value >= 25; // percentage
          break;
        case 'plan_50':
          shouldUnlock = value !== undefined && value >= 50; // percentage
          break;
        case 'plan_100':
          shouldUnlock = value !== undefined && value >= 100; // percentage
          break;
        case 'bookmark_10':
          shouldUnlock = value !== undefined && value >= 10;
          break;
      }

      if (shouldUnlock) {
        const updatedBadges = currentBadges.map(b => 
          b.id === badge.id 
            ? { ...b, unlockedAt: new Date().toISOString() }
            : b
        );
        
        localStorage.setItem('bible-badges', JSON.stringify(updatedBadges));
        
        // Show toast notification
        toast({
          title: '🏆 새로운 배지 획득!',
          description: `"${badge.name}" 배지를 획득했습니다.`,
          duration: 5000,
        });
        
        return updatedBadges;
      }
      
      return currentBadges;
    });
  }, [toast]);

  useEffect(() => {
    // Load badges from localStorage
    const savedBadges = localStorage.getItem('bible-badges');
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    } else {
      // Initialize with default badges
      setBadges(DEFAULT_BADGES);
      localStorage.setItem('bible-badges', JSON.stringify(DEFAULT_BADGES));
    }

    // Listen for badge check events
    const handleBadgeCheck = (event: CustomEvent) => {
      const { type, value } = event.detail;
      
      switch (type) {
        case 'first_listen':
          checkAndUnlockBadge('first_listen');
          break;
        case 'listening':
          checkAndUnlockBadge('listening_60', value);
          checkAndUnlockBadge('listening_300', value);
          break;
        case 'bookmark':
          checkAndUnlockBadge('bookmark_10', value);
          break;
        case 'streak':
          checkAndUnlockBadge('streak_7', value);
          checkAndUnlockBadge('streak_30', value);
          break;
        case 'completion':
          checkAndUnlockBadge('plan_25', value);
          checkAndUnlockBadge('plan_50', value);
          checkAndUnlockBadge('plan_100', value);
          break;
      }
    };

    window.addEventListener('badge-check', handleBadgeCheck as EventListener);
    
    return () => {
      window.removeEventListener('badge-check', handleBadgeCheck as EventListener);
    };
  }, [checkAndUnlockBadge]);

  const unlockBadge = (badgeId: string) => {
    setBadges(currentBadges => {
      const updatedBadges = currentBadges.map(badge => 
        badge.id === badgeId 
          ? { ...badge, unlockedAt: new Date().toISOString() }
          : badge
      );

      localStorage.setItem('bible-badges', JSON.stringify(updatedBadges));

      const unlockedBadge = updatedBadges.find(b => b.id === badgeId);
      if (unlockedBadge) {
        toast({
          title: '🏆 새로운 배지 획득!',
          description: `"${unlockedBadge.name}" 배지를 획득했습니다.`,
          duration: 5000,
        });
      }
      
      return updatedBadges;
    });
  };

  const getUnlockedBadges = () => {
    return badges.filter(badge => badge.unlockedAt);
  };

  const getLockedBadges = () => {
    return badges.filter(badge => !badge.unlockedAt);
  };

  const getBadgeIcon = (iconType: Badge['iconType'], metallic: boolean) => {
    const icons = {
      streak: '🔥',
      time: '⏰',
      completion: '🎯',
      special: '⭐',
    };

    return metallic ? `✨${icons[iconType]}✨` : icons[iconType];
  };

  return {
    badges,
    checkAndUnlockBadge,
    unlockBadge,
    getUnlockedBadges,
    getLockedBadges,
    getBadgeIcon,
  };
}