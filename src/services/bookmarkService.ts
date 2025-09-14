import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookmarkedAyah } from "../types";

const BOOKMARKS_KEY = "bookmarked_ayahs";

export class BookmarkService {
  static async getBookmarks(): Promise<BookmarkedAyah[]> {
    try {
      const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (bookmarksJson) {
        return JSON.parse(bookmarksJson);
      }
      return [];
    } catch (error) {
      console.error("Error getting bookmarks:", error);
      return [];
    }
  }

  static async addBookmark(bookmark: BookmarkedAyah): Promise<void> {
    try {
      const existingBookmarks = await this.getBookmarks();
      const updatedBookmarks = [...existingBookmarks, bookmark];
      await AsyncStorage.setItem(
        BOOKMARKS_KEY,
        JSON.stringify(updatedBookmarks)
      );
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  }

  static async removeBookmark(surahNumber: number, ayahNumber: number): Promise<void> {
    try {
      const existingBookmarks = await this.getBookmarks();
      const updatedBookmarks = existingBookmarks.filter(
        bookmark => !(bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber)
      );
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  }

  static async isBookmarked(surahNumber: number, ayahNumber: number): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some(
        bookmark => bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber
      );    } catch (error) {
      console.error("Error checking bookmark status:", error);
      return false;
    }
  }

  static async clearAllBookmarks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
    } catch (error) {
      console.error("Error clearing bookmarks:", error);
    }
  }
}
