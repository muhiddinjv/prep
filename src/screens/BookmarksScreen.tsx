import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useBookmarks } from '@/hooks/useBookmarks';

import { BookmarksItem } from '../components/bookmarks/BookmarkItem';
import { BookmarksEmptyState } from '../components/bookmarks/BookmarksEmptyState';
import { BookmarksHeader } from '../components/bookmarks/BookmarksHeader';

export default function BookmarksScreen() {
  const { bookmarks, loading, removeBookmark, clearAllBookmarks, refreshBookmarks } = useBookmarks();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBookmarks();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshBookmarks();
    }, [refreshBookmarks]),
  );

  return (
    <View style={styles.container}>
      <LoadingSpinner loading={loading} text="Loading bookmarks...">
        <FlatList
          data={bookmarks}
          renderItem={({ item }) => <BookmarksItem item={item} removeBookmark={removeBookmark} />}
          keyExtractor={(item) => `${item.surahNumber}-${item.ayahNumber}`}
          ListHeaderComponent={
            <BookmarksHeader hasBookmarks={bookmarks.length > 0} onButtonClear={clearAllBookmarks} />
          }
          ListEmptyComponent={BookmarksEmptyState}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2E7D32']} />}
        />
      </LoadingSpinner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
});
