export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface QuranData {
  number: number;
  language: string;
  reciter: string;
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
  sajda?: boolean;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface SurahListResponse extends ApiResponse<Surah[]> {}
export interface SurahDetailResponse extends ApiResponse<SurahDetail> {}

export interface BookmarkedAyah {
  ayahNumber: number;
  surahNumber: number;
  surahName: string;
  arabicText: string;
  englishText?: string;
  bookmarkedAt: string;
}
