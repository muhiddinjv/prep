import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  SurahList: undefined;
  SurahDetail: { surahNumber: number; surahName: string; targetAyahNumber?: number };
  Bookmarks: undefined;
};

export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface QuranApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export type SurahListResponse = Array<Surah> & {};
export type SurahResponse = Surah & {};

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: Ayah[];
}

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

export interface AyahResponse {
  ayah: Ayah;
}

export interface BookmarkedAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  timestamp: number;
  note?: string;
}

export interface QuranData {
  number: number;
  language: string;
  reciter: string;
}

export interface ApiErrorResponse {
  code: number;
  status: string;
  data: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

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

export type SurahListNavigationProp = StackNavigationProp<RootStackParamList, 'SurahList'>;
export type SurahDetailRouteProp = RouteProp<RootStackParamList, 'SurahDetail'>;

