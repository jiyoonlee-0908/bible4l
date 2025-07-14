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

// User settings schema
export const settingsSchema = z.object({
  selectedLanguage: z.enum(['ko', 'en', 'zh', 'ja']).default('ko'),
  displayMode: z.enum(['single', 'double']).default('single'),
  playbackSpeed: z.number().min(0.5).max(2.0).default(1.0),
  autoPlay: z.boolean().default(false),
  voice: z.string().optional(),
});

// Audio state schema
export const audioStateSchema = z.object({
  isPlaying: z.boolean().default(false),
  currentPosition: z.number().default(0),
  duration: z.number().default(0),
  speed: z.number().min(0.5).max(2.0).default(1.0),
});

export type Verse = z.infer<typeof verseSchema>;
export type Bookmark = z.infer<typeof bookmarkSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type AudioState = z.infer<typeof audioStateSchema>;

// Language configuration
export const languageConfig = {
  ko: {
    name: '한국어',
    short: '한',
    color: 'hsl(0, 84%, 60%)', // red
    bibleId: 'de4e12af7f28f599-02', // Korean Bible ID
  },
  en: {
    name: 'English',
    short: 'EN',
    color: 'hsl(217, 91%, 60%)', // blue
    bibleId: 'de4e12af7f28f599-01', // English Bible ID
  },
  zh: {
    name: '中文',
    short: '中',
    color: 'hsl(43, 96%, 56%)', // amber
    bibleId: 'de4e12af7f28f599-03', // Chinese Bible ID
  },
  ja: {
    name: '日本語',
    short: '日',
    color: 'hsl(262, 83%, 58%)', // violet
    bibleId: 'de4e12af7f28f599-04', // Japanese Bible ID
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
