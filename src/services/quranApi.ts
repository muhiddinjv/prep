import axios from "axios";
import { SurahListResponse, SurahDetailResponse } from "../types";

const BASE_URL = "http://api.alquran.cloud/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export class QuranApi {
  static async getSurahs(
    page: number = 1,
    limit: number = 10
  ): Promise<SurahListResponse> {
    try {
      // Fetch all surahs first
      const response = await api.get("/surah");
      const allSurahs = response.data.data;

      // Simulate pagination by slicing the results
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSurahs = allSurahs.slice(startIndex, endIndex);

      // Return data in the same format but with paginated results
      return {
        code: response.data.code,
        status: response.data.status,
        data: paginatedSurahs,
      };
    } catch (error) {
      console.error("Error fetching surahs:", error);
      throw error;
    }
  }

  static async getSurahDetail(
    surahNumber: number,
    edition: string = "quran-uthmani"
  ): Promise<SurahDetailResponse> {
    try {
      const response = await api.get(`/surah/${surahNumber}/${edition}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching surah ${surahNumber}:`, error);
      throw error;
    }
  }

  static async getSurahWithTranslation(surahNumber: number): Promise<any> {
    try {
      // Get both Arabic text and English translation
      const response = await api.get(
        `/surah/${surahNumber}/editions/quran-uthmani,en.asad`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching surah ${surahNumber} with translation:`,
        error
      );
      throw error;
    }
  }
}
