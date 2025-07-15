import { useState, useEffect } from 'react';
import { ReadingPlan, Progress } from '@shared/schema';
import { Storage } from '@/lib/storage';

// Reading plan data for 90-day and 365-day plans
const READING_PLANS = {
  plan_90: {
    id: 'plan_90',
    name: '90일 성경 통독',
    type: '90days' as const,
    totalDays: 90,
    dailyReadings: [
      { day: 1, books: ['Genesis'], chapters: [1, 2, 3], description: '창조와 타락' },
      { day: 2, books: ['Genesis'], chapters: [4, 5, 6], description: '가인과 아벨, 홍수 이전' },
      { day: 3, books: ['Genesis'], chapters: [7, 8, 9], description: '노아의 홍수' },
      { day: 4, books: ['Genesis'], chapters: [10, 11, 12], description: '바벨탑과 아브라함의 부름' },
      { day: 5, books: ['Genesis'], chapters: [13, 14, 15], description: '아브라함의 언약' },
      { day: 6, books: ['Genesis'], chapters: [16, 17, 18], description: '이스마엘과 이삭의 약속' },
      { day: 7, books: ['Genesis'], chapters: [19, 20, 21], description: '소돔과 고모라, 이삭의 탄생' },
      { day: 8, books: ['Genesis'], chapters: [22, 23, 24], description: '아브라함의 시험과 믿음' },
      { day: 9, books: ['Genesis'], chapters: [25, 26, 27], description: '이삭과 야곱의 축복' },
      { day: 10, books: ['Genesis'], chapters: [28, 29, 30], description: '야곱의 꿈과 결혼' },
      // Continue for more days...
      ...Array.from({ length: 80 }, (_, i) => ({
        day: i + 11,
        books: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'][Math.floor(i / 16)],
        chapters: [Math.floor(i % 5) + 1, Math.floor(i % 5) + 2],
        description: `${i + 11}일차 성경 읽기`
      }))
    ],
    createdAt: new Date().toISOString(),
  },
  plan_365: {
    id: 'plan_365',
    name: '1년 성경 통독',
    type: '365days' as const,
    totalDays: 365,
    dailyReadings: [
      { day: 1, books: ['Genesis'], chapters: [1], description: '창조 첫째 날' },
      { day: 2, books: ['Genesis'], chapters: [2], description: '창조 둘째 날' },
      { day: 3, books: ['Genesis'], chapters: [3], description: '타락' },
      { day: 4, books: ['Genesis'], chapters: [4], description: '가인과 아벨' },
      { day: 5, books: ['Genesis'], chapters: [5], description: '아담의 족보' },
      { day: 6, books: ['Genesis'], chapters: [6], description: '노아 시대' },
      { day: 7, books: ['Genesis'], chapters: [7], description: '홍수 시작' },
      { day: 8, books: ['Genesis'], chapters: [8], description: '홍수 끝' },
      { day: 9, books: ['Genesis'], chapters: [9], description: '노아의 언약' },
      { day: 10, books: ['Genesis'], chapters: [10], description: '민족들의 분산' },
      // Continue for more days...
      ...Array.from({ length: 355 }, (_, i) => ({
        day: i + 11,
        books: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings'][Math.floor(i / 30)],
        chapters: [Math.floor(i % 10) + 1],
        description: `${i + 11}일차 성경 읽기`
      }))
    ],
    createdAt: new Date().toISOString(),
  },
};

export function useReadingPlan() {
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    // Load saved progress
    const savedPlanId = localStorage.getItem('bible-reading-plan-id');
    if (savedPlanId && READING_PLANS[savedPlanId as keyof typeof READING_PLANS]) {
      const plan = READING_PLANS[savedPlanId as keyof typeof READING_PLANS];
      setSelectedPlan(plan);
      
      const savedProgress = localStorage.getItem(`bible-progress-${savedPlanId}`);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        const newProgress: Progress = {
          id: `progress-${savedPlanId}`,
          planId: savedPlanId,
          currentDay: 1,
          completedDays: [],
          streak: 0,
          totalListeningTime: 0,
          lastActivityDate: new Date().toISOString(),
        };
        setProgress(newProgress);
        localStorage.setItem(`bible-progress-${savedPlanId}`, JSON.stringify(newProgress));
      }
    }
  }, []);

  const selectPlan = (planId: keyof typeof READING_PLANS) => {
    const plan = READING_PLANS[planId];
    setSelectedPlan(plan);
    localStorage.setItem('bible-reading-plan-id', planId);
    
    const newProgress: Progress = {
      id: `progress-${planId}`,
      planId,
      currentDay: 1,
      completedDays: [],
      streak: 0,
      totalListeningTime: 0,
      lastActivityDate: new Date().toISOString(),
    };
    setProgress(newProgress);
    localStorage.setItem(`bible-progress-${planId}`, JSON.stringify(newProgress));
  };

  const markDayComplete = (day: number) => {
    if (!progress || !selectedPlan) return;

    const today = new Date().toDateString();
    const lastActivity = progress.lastActivityDate ? new Date(progress.lastActivityDate).toDateString() : null;
    
    const updatedProgress: Progress = {
      ...progress,
      completedDays: [...progress.completedDays, day].filter((d, i, arr) => arr.indexOf(d) === i),
      currentDay: Math.min(day + 1, selectedPlan.totalDays),
      lastActivityDate: new Date().toISOString(),
    };

    // Calculate streak
    if (lastActivity === today) {
      // Same day activity, don't change streak
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActivity === yesterday.toDateString()) {
        updatedProgress.streak = progress.streak + 1;
      } else {
        updatedProgress.streak = 1; // Reset streak
      }
    }

    setProgress(updatedProgress);
    localStorage.setItem(`bible-progress-${selectedPlan.id}`, JSON.stringify(updatedProgress));
  };

  const addListeningTime = (minutes: number) => {
    if (!progress || !selectedPlan) return;

    const updatedProgress: Progress = {
      ...progress,
      totalListeningTime: progress.totalListeningTime + minutes,
    };

    setProgress(updatedProgress);
    localStorage.setItem(`bible-progress-${selectedPlan.id}`, JSON.stringify(updatedProgress));
  };

  const getProgressPercentage = () => {
    if (!progress || !selectedPlan) return 0;
    return (progress.completedDays.length / selectedPlan.totalDays) * 100;
  };

  const getTodaysReading = () => {
    if (!selectedPlan || !progress) return null;
    return selectedPlan.dailyReadings.find(reading => reading.day === progress.currentDay);
  };

  const isCompletedToday = () => {
    if (!progress) return false;
    const today = new Date().toDateString();
    const lastActivity = progress.lastActivityDate ? new Date(progress.lastActivityDate).toDateString() : null;
    return lastActivity === today && progress.completedDays.includes(progress.currentDay - 1);
  };

  return {
    selectedPlan,
    progress,
    availablePlans: Object.values(READING_PLANS),
    selectPlan,
    markDayComplete,
    addListeningTime,
    getProgressPercentage,
    getTodaysReading,
    isCompletedToday,
  };
}