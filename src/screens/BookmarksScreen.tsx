import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  RefreshControl 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useBookmarks } from "../hooks/useBookmarks";
import { BookmarkedAyah } from "../types";
import { RootStackParamList } from "../navigation/AppNavigator";
import LoadingSpinner from "../components/LoadingSpinner";

type BookmarksNavigationProp = StackNavigationProp<RootStackParamList, 'Bookmarks'>;

export default function BookmarksScreen() {
  const navigation = useNavigation<BookmarksNavigationProp>();
  const { 
    bookmarks, 
    loading, 
    removeBookmark, 
    clearAllBookmarks, 
    refreshBookmarks 
  } = useBookmarks();
  
  const [refreshing, setRefreshing] = useState(false);

  // Refresh bookmarks when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshBookmarks();
    }, [refreshBookmarks])
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
    Alert.alert(
      "Remove Bookmark",
      `Remove bookmark for ${bookmark.surahName} verse ${bookmark.ayahNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)
        }
      ]
    );
  };

  const handleClearAllBookmarks = () => {
    Alert.alert(
      "Clear All Bookmarks",
      "Are you sure you want to remove all bookmarks? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: clearAllBookmarks
        }
      ]
    );
  };

  const renderBookmarkItem = ({ item }: { item: BookmarkedAyah }) => (
    <TouchableOpacity 
      style={styles.bookmarkItem}
      onPress={() => handleBookmarkPress(item)}
    >
      <View style={styles.bookmarkHeader}>
        <View style={styles.bookmarkInfo}>
          <Text style={styles.surahName}>{item.surahName}</Text>
          <Text style={styles.verseNumber}>Verse {item.ayahNumber}</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveBookmark(item)}
        >
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
      
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="bookmark-border" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Bookmarks</Text>
      <Text style={styles.emptySubtitle}>
        Start reading the Quran and bookmark your favorite verses
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Bookmarks</Text>
      {bookmarks.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearAllBookmarks}
        >
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#2E7D32"]}
            />
          }
        />
      </LoadingSpinner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  clearButtonText: {
    marginLeft: 4,
    color: "#d32f2f",
    fontSize: 14,
  },
  bookmarkItem: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  bookmarkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookmarkInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 2,
  },
  verseNumber: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    padding: 4,
  },
  verseText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 8,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
