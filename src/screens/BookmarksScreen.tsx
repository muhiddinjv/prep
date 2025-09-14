import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

import { BookmarkService } from "../services/bookmarkService";
import LoadingSpinner from "../components/LoadingSpinner";
import { RootStackParamList } from "../navigation/AppNavigator";
import { BookmarkedAyah } from "../types";

type BookmarksNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Bookmarks"
>;

export default function BookmarksScreen() {
  const navigation = useNavigation<BookmarksNavigationProp>();
  const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const savedBookmarks = await BookmarkService.getBookmarks();
      const sortedBookmarks = savedBookmarks.sort(
        (a, b) =>
          new Date(b.bookmarkedAt).getTime() -
          new Date(a.bookmarkedAt).getTime()
      );
      setBookmarks(sortedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  const handleNavigateToAyah = (bookmark: BookmarkedAyah) => {
    navigation.navigate("SurahDetail", {
      surahNumber: bookmark.surahNumber,
      surahName: bookmark.surahName,
      targetAyahNumber: bookmark.ayahNumber,
    });
  };

  const handleClearAllBookmarks = () => {
    Alert.alert(
      "Clear All Bookmarks",
      "Are you sure you want to remove all bookmarks? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await BookmarkService.clearAllBookmarks();
              setBookmarks([]);
            } catch (error) {
              Alert.alert("Error", "Failed to clear bookmarks");
            }
          },
        },
      ]
    );
  };

  const renderBookmarkItem = ({ item }: { item: BookmarkedAyah }) => {
  return (
    <TouchableOpacity
      style={styles.bookmarkItem}
      onPress={() => handleNavigateToAyah(item)}
      activeOpacity={0.7}
    >
      <View style={styles.ayahNumber}>
        <Text style={styles.numberText}>{item.surahNumber}</Text>
      </View>
      <View style={styles.ayahContent}>
        <View style={styles.surahInfo}>
          <Text style={styles.surahName}>{item.surahName}</Text>
          <Text style={styles.ayahIndex}>Ayah {item.ayahNumber}</Text>
        </View>
        <Text style={styles.arabicText} numberOfLines={2}>
          {item.arabicText}
        </Text>
        {item.englishText && (
          <Text style={styles.englishText} numberOfLines={2}>
            {item.englishText}
          </Text>
        )}
        <Text style={styles.bookmarkedDate}>
          Bookmarked: {new Date(item.bookmarkedAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={async () => {
          try {
            await BookmarkService.removeBookmark(item.surahNumber, item.ayahNumber);
            setBookmarks(prev => 
              prev.filter(bookmark => 
                !(bookmark.surahNumber === item.surahNumber && bookmark.ayahNumber === item.ayahNumber)
              )
            );
          } catch (error) {
            Alert.alert("Error", "Failed to remove bookmark");
          }
        }}
      >
        <MaterialIcons name="delete" size={24} color="#d32f2f" />
      </TouchableOpacity>
    </TouchableOpacity>
  )};

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="bookmark-border" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptySubtext}>
        Start exploring surahs and swipe up on ayahs to bookmark them!
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading Bookmarks..." />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarked Ayahs</Text>
        {bookmarks.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAllBookmarks}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={bookmarks}
        renderItem={renderBookmarkItem}
        keyExtractor={(item) => item?.ayahNumber?.toString() + item?.surahNumber?.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#d32f2f",
    borderRadius: 6,
  },
  clearButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  bookmarkItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ayahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  numberText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  ayahContent: {
    flex: 1,
  },
  surahInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  surahName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  ayahIndex: {
    fontSize: 12,
    color: "#666",
  },
  arabicText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
    textAlign: "right",
    lineHeight: 24,
  },
  englishText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    lineHeight: 20,
  },
  bookmarkedDate: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  removeButton: {
    padding: 8,
    alignSelf: "flex-start",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});
