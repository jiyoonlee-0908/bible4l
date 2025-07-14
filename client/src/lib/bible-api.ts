import { BibleApiResponse, BibleBook, BibleChapter, BibleVerse } from '@/types/bible';

const API_BASE_URL = 'https://api.scripture.api.bible/v1';
const API_KEY = import.meta.env.VITE_BIBLE_API_KEY || 'your-api-key-here';

const headers = {
  'api-key': API_KEY,
  'Content-Type': 'application/json',
};

export class BibleApi {
  private static async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Bible API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getBooks(bibleId: string): Promise<BibleBook[]> {
    const response = await this.request<BibleApiResponse<BibleBook[]>>(`/bibles/${bibleId}/books`);
    return response.data;
  }

  static async getChapters(bibleId: string, bookId: string): Promise<BibleChapter[]> {
    const response = await this.request<BibleApiResponse<BibleChapter[]>>(`/bibles/${bibleId}/books/${bookId}/chapters`);
    return response.data;
  }

  static async getVerse(bibleId: string, verseId: string): Promise<BibleVerse> {
    const response = await this.request<BibleApiResponse<BibleVerse>>(`/bibles/${bibleId}/verses/${verseId}`);
    return response.data;
  }

  static async getVerses(bibleId: string, chapterId: string): Promise<BibleVerse[]> {
    const response = await this.request<BibleApiResponse<BibleVerse[]>>(`/bibles/${bibleId}/chapters/${chapterId}/verses`);
    return response.data;
  }

  static async search(bibleId: string, query: string): Promise<BibleVerse[]> {
    const response = await this.request<BibleApiResponse<{ verses: BibleVerse[] }>>(`/bibles/${bibleId}/search?query=${encodeURIComponent(query)}`);
    return response.data.verses || [];
  }
}
