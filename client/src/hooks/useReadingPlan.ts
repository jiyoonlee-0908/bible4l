import React, { useState, useEffect } from 'react';
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
      // ... more days would be added
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
      // ... more days would be added
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