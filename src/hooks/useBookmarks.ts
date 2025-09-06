import { useCallback, useEffect, useState } from 'react';

import { bookmarkService } from '../services/bookmarkService';
import { BookmarkedAyah } from '../types';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const savedBookmarks = await bookmarkService.getBookmarks();
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookmark = useCallback(async (bookmark: BookmarkedAyah) => {
    try {
      await bookmarkService.saveBookmark(bookmark);
      setBookmarks((prev) => [...prev, bookmark]);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }, []);

  const removeBookmark = useCallback(async (surahNumber: number, ayahNumber: number) => {
    try {
      await bookmarkService.removeBookmark(surahNumber, ayahNumber);
      setBookmarks((prev) =>
        prev.filter((bookmark) => !(bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber)),
      );
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }, []);

  const toggleBookmark = useCallback(
    async (bookmark: BookmarkedAyah) => {
      const isBookmarked = bookmarks.some(
        (b) => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber,
      );

      if (isBookmarked) {
        await removeBookmark(bookmark.surahNumber, bookmark.ayahNumber);
      } else {
        await addBookmark(bookmark);
      }
    },
    [bookmarks, addBookmark, removeBookmark],
  );

  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      return bookmarks.some((bookmark) => bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber);
    },
    [bookmarks],
  );

  const clearAllBookmarks = useCallback(async () => {
    try {
      await bookmarkService.clearAllBookmarks();
      setBookmarks([]);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  }, []);

  const updateBookmarkNote = useCallback(async (surahNumber: number, ayahNumber: number, note: string) => {
    try {
      await bookmarkService.updateBookmarkNote(surahNumber, ayahNumber, note);
      setBookmarks((prev) =>
        prev.map((bookmark) =>
          bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber ? { ...bookmark, note } : bookmark,
        ),
      );
    } catch (error) {
      console.error('Error updating bookmark note:', error);
      throw error;
    }
  }, []);

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAllBookmarks,
    updateBookmarkNote,
    refreshBookmarks: loadBookmarks,
  };
}
