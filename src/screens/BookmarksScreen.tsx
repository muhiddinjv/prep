import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoadingSpinner from '../components/LoadingSpinner';
import { useBookmarks } from '../hooks/useBookmarks';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BookmarkedAyah } from '../types';

type BookmarksNavigationProp = StackNavigationProp<RootStackParamList, 'Bookmarks'>;

export default function BookmarksScreen() {
  const navigation = useNavigation<BookmarksNavigationProp>();
  const { bookmarks, loading, removeBookmark, clearAllBookmarks, refreshBookmarks } = useBookmarks();

  const [refreshing, setRefreshing] = useState(false);

  // Refresh bookmarks when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshBookmarks();
    }, [refreshBookmarks]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBookmarks();
    setRefreshing(false);
  };

  const handleBookmarkPress = (bookmark: BookmarkedAyah) => {
    navigation.navigate('SurahDetail', {
      surahNumber: bookmark.surahNumber,
      surahName: bookmark.surahName,
      targetAyahNumber: bookmark.ayahNumber,
    });
  };

  const handleRemoveBookmark = (bookmark: BookmarkedAyah) => {
    Alert.alert('Remove Bookmark', `Remove bookmark for ${bookmark.surahName} verse ${bookmark.ayahNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber),
      },
    ]);
  };

  const handleClearAllBookmarks = () => {
    Alert.alert('Clear All Bookmarks', 'Are you sure you want to remove all bookmarks? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: clearAllBookmarks,
      },
    ]);
  };

  const renderBookmarkItem = ({ item }: { item: BookmarkedAyah }) => (
    <TouchableOpacity style={styles.bookmarkItem} onPress={() => handleBookmarkPress(item)}>
      <View style={styles.bookmarkHeader}>
        <View style={styles.bookmarkInfo}>
          <Text style={styles.surahName}>{item.surahName}</Text>
          <Text style={styles.verseNumber}>Verse {item.ayahNumber}</Text>
        </View>
        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveBookmark(item)}>
          <Icon name="delete" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      <Text style={styles.verseText} numberOfLines={3}>
        {item.ayahText}
      </Text>

      {item.note && (
        <View style={styles.noteContainer}>
          <Icon name="note" size={16} color="#666" />
          <Text style={styles.noteText} numberOfLines={2}>
            {item.note}
          </Text>
        </View>
      )}

      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="bookmark-border" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Bookmarks</Text>
      <Text style={styles.emptySubtitle}>Start reading the Quran and bookmark your favorite verses</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Bookmarks</Text>
      {bookmarks.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAllBookmarks}>
          <Icon name="clear-all" size={20} color="#d32f2f" />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LoadingSpinner loading={loading} text="Loading bookmarks...">
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item) => `${item.surahNumber}-${item.ayahNumber}`}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2E7D32']} />}
        />
      </LoadingSpinner>
    </View>
  );
}

const styles = StyleSheet.create({
  bookmarkHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 1,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  clearButton: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  clearButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    marginLeft: 4,
  },
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptySubtitle: {
    color: '#999',
    fontSize: 16,
    paddingHorizontal: 32,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  noteContainer: {
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    flexDirection: 'row',
    marginBottom: 8,
    padding: 8,
  },
  noteText: {
    color: '#666',
    flex: 1,
    fontSize: 14,
    marginLeft: 4,
  },
  removeButton: {
    padding: 4,
  },
  surahName: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
    textAlign: 'right',
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  verseNumber: {
    color: '#666',
    fontSize: 14,
  },
  verseText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
});
