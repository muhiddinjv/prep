import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { AyahResponse, QuranApiResponse, QuranData, SurahListResponse, SurahResponse } from '../types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.QURAN_API_URL || 'https://api.alquran.cloud/v1',
  timeout: process.env.QURAN_API_TIMEOUT || 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout');
    }
    if (error.response) {
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
    }
    throw new Error('Network error');
  },
);

export const quranAPI = {
  getSurahs: (): Promise<QuranApiResponse<SurahListResponse>> => api.get('/surah'),

  getSurah: ({ number, language, reciter }: QuranData): Promise<QuranApiResponse<SurahResponse>> =>
    api.get(`/surah/${number}/${language}.${reciter}`),

  getAyah: ({ number, language, reciter }: QuranData): Promise<QuranApiResponse<AyahResponse>> =>
    api.get(`/ayah/${number}/${language}.${reciter}`),
};
