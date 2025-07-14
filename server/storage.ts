import { Bookmark, Progress, Badge, ReadingPlan } from "@shared/schema";

// Storage interface for Bible app data
export interface IStorage {
  // Bookmarks
  getBookmarks(): Promise<Bookmark[]>;
  addBookmark(bookmark: Bookmark): Promise<void>;
  removeBookmark(verseId: string, language: string): Promise<void>;
  
  // Progress tracking
  getProgress(planId: string): Promise<Progress | undefined>;
  updateProgress(progress: Progress): Promise<void>;
  
  // Badges
  getBadges(): Promise<Badge[]>;
  unlockBadge(badgeId: string): Promise<void>;
  
  // Reading plans
  getReadingPlans(): Promise<ReadingPlan[]>;
}

export class MemStorage implements IStorage {
  private bookmarks: Map<string, Bookmark>;
  private progress: Map<string, Progress>;
  private badges: Map<string, Badge>;
  private readingPlans: Map<string, ReadingPlan>;

  constructor() {
    this.bookmarks = new Map();
    this.progress = new Map();
    this.badges = new Map();
    this.readingPlans = new Map();
    
    // Initialize default badges
    this.initializeDefaultBadges();
    this.initializeDefaultPlans();
  }

  async getBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values());
  }

  async addBookmark(bookmark: Bookmark): Promise<void> {
    this.bookmarks.set(`${bookmark.verseId}-${bookmark.language}`, bookmark);
  }

  async removeBookmark(verseId: string, language: string): Promise<void> {
    this.bookmarks.delete(`${verseId}-${language}`);
  }

  async getProgress(planId: string): Promise<Progress | undefined> {
    return this.progress.get(planId);
  }

  async updateProgress(progress: Progress): Promise<void> {
    this.progress.set(progress.planId, progress);
  }

  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async unlockBadge(badgeId: string): Promise<void> {
    const badge = this.badges.get(badgeId);
    if (badge) {
      badge.unlockedAt = new Date().toISOString();
      this.badges.set(badgeId, badge);
    }
  }

  async getReadingPlans(): Promise<ReadingPlan[]> {
    return Array.from(this.readingPlans.values());
  }

  private initializeDefaultBadges() {
    const defaultBadges: Badge[] = [
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
        id: 'plan_50',
        name: '계획 50% 달성',
        description: '통독 계획을 50% 완료했습니다',
        condition: 'plan_50',
        iconType: 'completion',
        metallic: true,
      },
    ];

    defaultBadges.forEach(badge => {
      this.badges.set(badge.id, badge);
    });
  }

  private initializeDefaultPlans() {
    const plans: ReadingPlan[] = [
      {
        id: 'plan_90',
        name: '90일 성경 통독',
        type: '90days',
        totalDays: 90,
        dailyReadings: [], // Will be populated with actual reading schedule
        createdAt: new Date().toISOString(),
      },
      {
        id: 'plan_365',
        name: '1년 성경 통독',
        type: '365days',
        totalDays: 365,
        dailyReadings: [], // Will be populated with actual reading schedule
        createdAt: new Date().toISOString(),
      },
    ];

    plans.forEach(plan => {
      this.readingPlans.set(plan.id, plan);
    });
  }
}

export const storage = new MemStorage();
