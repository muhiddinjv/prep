
export interface QuranApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

// Surah List Response
export interface SurahListResponse extends Array<Surah> {}

// Individual Surah Response
export interface SurahResponse extends Surah {}

// Surah Type
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: Ayah[];
}

// Ayah Type
export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

// Individual Ayah Response
export interface AyahResponse {
  ayah: Ayah;
}

// Bookmark Types
export interface BookmarkedAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  timestamp: number;
  note?: string;
}

// API Request Parameters
export interface QuranData {
  number: number;
  language: string;
  reciter: string;
}

// Error Response
export interface ApiErrorResponse {
  code: number;
  status: string;
  data: string;
}

// Loading States
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Search Types
export interface SearchResult {
  surah: number;
  ayah: number;
  text: string;
  translation: string;
}

export interface SearchResponse {
  quran: SearchResult[];
  translation: SearchResult[];
} 
