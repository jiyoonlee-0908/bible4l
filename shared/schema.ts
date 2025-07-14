import { z } from "zod";

// Bible verse schema
export const verseSchema = z.object({
  id: z.string(),
  reference: z.string(),
  text: z.string(),
  book: z.string(),
  chapter: z.number(),
  verse: z.number(),
  language: z.enum(['ko', 'en', 'zh', 'ja']),
});

// Bookmark schema
export const bookmarkSchema = z.object({
  id: z.string(),
  verseId: z.string(),
  reference: z.string(),
  text: z.string(),
  language: z.enum(['ko', 'en', 'zh', 'ja']),
  createdAt: z.string(),
});

// User settings schema with DSP
export const settingsSchema = z.object({
  selectedLanguage: z.enum(['ko', 'en', 'zh', 'ja']).default('ko'),
  displayMode: z.enum(['single', 'double']).default('single'),
  playbackSpeed: z.number().min(0.8).max(1.5).default(1.0),
  pitch: z.number().min(-4).max(4).default(0), // semitones
  autoPlay: z.boolean().default(false),
  voice: z.string().optional(),
  dsp: z.object({
    echo: z.boolean().default(false),
    reverb: z.boolean().default(false),
    eq: z.object({
      low: z.number().min(-10).max(10).default(0),
      mid: z.number().min(-10).max(10).default(0),
      high: z.number().min(-10).max(10).default(0),
    }).default({}),
  }).default({}),
  fontLevel: z.number().min(-2).max(3).default(0),
});

// Audio state schema
export const audioStateSchema = z.object({
  isPlaying: z.boolean().default(false),
  currentPosition: z.number().default(0),
  duration: z.number().default(0),
  speed: z.number().min(0.8).max(1.5).default(1.0),
  pitch: z.number().min(-4).max(4).default(0),
});

export type Verse = z.infer<typeof verseSchema>;
export type Bookmark = z.infer<typeof bookmarkSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type AudioState = z.infer<typeof audioStateSchema>;

// Language configuration with public domain translations
export const languageConfig = {
  ko: {
    name: '한국어',
    short: '한',
    color: 'hsl(0, 84%, 60%)', // red
    translation: 'KJV', // Using KJV for Korean (will be localized)
    voiceLang: 'ko-KR',
  },
  en: {
    name: 'English',
    short: 'EN',
    color: 'hsl(217, 91%, 60%)', // blue
    translation: 'KJV', // King James Version (Public Domain)
    voiceLang: 'en-US',
  },
  zh: {
    name: '中文',
    short: '中',
    color: 'hsl(43, 96%, 56%)', // amber
    translation: 'CUV', // Chinese Union Version (Public Domain)
    voiceLang: 'zh-CN',
  },
  ja: {
    name: '日本語',
    short: '日',
    color: 'hsl(262, 83%, 58%)', // violet
    translation: 'JEB', // Japanese (Public Domain)
    voiceLang: 'ja-JP',
  },
} as const;

export type Language = keyof typeof languageConfig;

// Reading plan schemas
export const readingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['90days', '365days']),
  totalDays: z.number(),
  dailyReadings: z.array(z.object({
    day: z.number(),
    books: z.array(z.string()),
    chapters: z.array(z.number()),
    description: z.string().optional(),
  })),
  createdAt: z.string(),
});

// Progress tracking schema
export const progressSchema = z.object({
  id: z.string(),
  planId: z.string(),
  currentDay: z.number().default(1),
  completedDays: z.array(z.number()).default([]),
  streak: z.number().default(0),
  totalListeningTime: z.number().default(0), // in minutes
  lastActivityDate: z.string().optional(),
});

// Badge/Achievement schema
export const badgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  condition: z.string(), // e.g., "streak_7", "listening_60", "plan_50"
  iconType: z.enum(['streak', 'time', 'completion', 'special']),
  metallic: z.boolean().default(false), // for gold rim effect
  unlockedAt: z.string().optional(),
});

// Audio settings with DSP
export const dspSettingsSchema = z.object({
  echo: z.boolean().default(false),
  reverb: z.boolean().default(false),
  eq: z.object({
    low: z.number().min(-10).max(10).default(0),
    mid: z.number().min(-10).max(10).default(0),
    high: z.number().min(-10).max(10).default(0),
  }).default({}),
  pitch: z.number().min(-4).max(4).default(0), // semitones
});

export type ReadingPlan = z.infer<typeof readingPlanSchema>;
export type Progress = z.infer<typeof progressSchema>;
export type Badge = z.infer<typeof badgeSchema>;
export type DspSettings = z.infer<typeof dspSettingsSchema>;
