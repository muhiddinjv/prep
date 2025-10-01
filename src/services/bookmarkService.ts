import AsyncStorage from '@react-native-async-storage/async-storage';

import { BookmarkedAyah } from '../types';

const BOOKMARKS_KEY = '@quranic_bookmarks';

export class BookmarkService {
  async saveBookmark(bookmark: BookmarkedAyah): Promise<void> {
    try {
      const existingBookmarks = await this.getBookmarks();
      const updatedBookmarks = [...existingBookmarks, bookmark];
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error saving bookmark:', error);
      throw error;
    }
  }

  async removeBookmark(surahNumber: number, ayahNumber: number): Promise<void> {
    try {
      const existingBookmarks = await this.getBookmarks();
      const updatedBookmarks = existingBookmarks.filter(
        (bookmark) => !(bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber),
      );
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  async getBookmarks(): Promise<BookmarkedAyah[]> {
    try {
      const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_KEY);
      return bookmarksJson ? JSON.parse(bookmarksJson) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  async isBookmarked(surahNumber: number, ayahNumber: number): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some((bookmark) => bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }

  async getBookmarksForSurah(surahNumber: number): Promise<BookmarkedAyah[]> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.filter((bookmark) => bookmark.surahNumber === surahNumber);
    } catch (error) {
      console.error('Error getting surah bookmarks:', error);
      return [];
    }
  }

  async clearAllBookmarks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  }

  async updateBookmarkNote(surahNumber: number, ayahNumber: number, note: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const updatedBookmarks = bookmarks.map((bookmark) => {
        if (bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber) {
          return { ...bookmark, note };
        }
        return bookmark;
      });
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error updating bookmark note:', error);
      throw error;
    }
  }
}

export const bookmarkService = new BookmarkService();
