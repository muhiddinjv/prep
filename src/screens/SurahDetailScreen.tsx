import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Dimensions 
} from "react-native";
import { useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { quranAPI } from "../services/api";
import { useApiCall } from "../hooks/useApiCall";
import { useBookmarks } from "../hooks/useBookmarks";
import { Surah, Ayah, BookmarkedAyah } from "../types";
import { RootStackParamList } from "../navigation/AppNavigator";
import LoadingSpinner from "../components/LoadingSpinner";

type SurahDetailRouteProp = RouteProp<RootStackParamList, 'SurahDetail'>;

const { width } = Dimensions.get('window');

// Memoized Ayah Item Component for better performance
const AyahItem = memo(({ 
  item, 
  isBookmarked, 
  onToggleBookmark 
}: { 
  item: Ayah; 
  isBookmarked: boolean; 
  onToggleBookmark: (ayah: Ayah) => void; 
}) => (
  <View style={styles.ayahContainer}>
    <View style={styles.ayahHeader}>
      <View style={styles.ayahNumberContainer}>
        <Text style={styles.ayahNumber}>{item.numberInSurah}</Text>
      </View>
      <TouchableOpacity 
        style={styles.bookmarkButton}
        onPress={() => onToggleBookmark(item)}
      >
        <Icon 
          name={isBookmarked ? "bookmark" : "bookmark-border"} 
          size={24} 
          color={isBookmarked ? "#2E7D32" : "#666"} 
        />
      </TouchableOpacity>
    </View>
    
    <View style={styles.ayahContent}>
      <Text style={styles.translationText}>
        {item.numberInSurah}. {item.text}
      </Text>
    </View>
    
    <View style={styles.ayahFooter}>
      <Text style={styles.ayahInfo}>
        Juz {item.juz} • Page {item.page}
      </Text>
    </View>
  </View>
));

export default function SurahDetailScreen() {
  const route = useRoute<SurahDetailRouteProp>();
  const { surahNumber, surahName, targetAyahNumber } = route.params;
  const flatListRef = useRef<FlatList>(null);

  


  const { loading, error, data, execute } = useApiCall(quranAPI.getSurah);
  const { bookmarks, toggleBookmark, isBookmarked, refreshBookmarks } = useBookmarks();

  useEffect(() => {
    console.log('Loading surah:', surahNumber);
    execute({ number: surahNumber, language: 'en', reciter: 'asad' });
  }, [surahNumber]);

  // Refresh bookmarks when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshBookmarks();
    }, [refreshBookmarks])
  );

  // Scroll to target ayah when data is loaded and targetAyahNumber is provided
  useEffect(() => {
    if (data?.data?.ayahs && targetAyahNumber) {
      const targetIndex = data.data.ayahs.findIndex(
        ayah => ayah.numberInSurah === targetAyahNumber
      );
      if (targetIndex !== -1) {
        console.log('Scrolling to ayah:', targetAyahNumber, 'at index:', targetIndex);
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: targetIndex,
            animated: true,
            viewPosition: 0.5, // Center the ayah on the screen
          });
        }, 500); // Small delay to ensure the list is rendered
      }
    }
  }, [data, targetAyahNumber]);

  // Scroll to target ayah when screen comes into focus (for navigation back to screen)
  useFocusEffect(
    React.useCallback(() => {
      if (data?.data?.ayahs && targetAyahNumber) {
        const targetIndex = data.data.ayahs.findIndex(
          ayah => ayah.numberInSurah === targetAyahNumber
        );
        if (targetIndex !== -1) {
          console.log('Focus scroll to ayah:', targetAyahNumber, 'at index:', targetIndex);
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: targetIndex,
              animated: true,
              viewPosition: 0.5, // Center the ayah on the screen
            });
          }, 300); // Shorter delay for focus events
        }
      }
    }, [data, targetAyahNumber])
  );


  const handleToggleBookmark = async (ayah: Ayah) => {
    const bookmark: BookmarkedAyah = {
      surahNumber: surahNumber,
      surahName: surahName,
      ayahNumber: ayah.numberInSurah,
      ayahText: ayah.text,
      timestamp: Date.now(),
    };
    
    try {
      await toggleBookmark(bookmark);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };



  const renderAyahItem = useCallback(({ item, index }: { item: Ayah; index: number }) => {
    const isBookmarkedStatus = isBookmarked(surahNumber, item.numberInSurah);
    
    return (
      <AyahItem
        item={item}
        isBookmarked={isBookmarkedStatus}
        onToggleBookmark={handleToggleBookmark}
      />
    );
  }, [surahNumber, isBookmarked, handleToggleBookmark]);

  const renderSurahHeader = () => {
    const surah = data?.data;
    if (!surah) return null;

    return (
      <View style={styles.surahHeader}>
        <Text style={styles.surahName}>{surah.englishName}</Text>
        <Text style={styles.surahArabicName}>{surah.name}</Text>
        <Text style={styles.surahTranslation}>{surah.englishNameTranslation}</Text>
        <Text style={styles.surahInfo}>
          {surah.revelationType} • {surah.numberOfAyahs} verses
        </Text>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <LoadingSpinner 
        loading={loading} 
        error={error}
        text="Loading Surah..."
      >
        <FlatList
          ref={flatListRef}
          data={data?.data?.ayahs || []}
          renderItem={renderAyahItem}
          keyExtractor={(item) => item.number.toString()}
          ListHeaderComponent={renderSurahHeader}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          windowSize={10}
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
  },
  surahHeader: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  surahName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  surahArabicName: {
    fontSize: 20,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  surahTranslation: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  surahInfo: {
    fontSize: 14,
    color: "#999",
  },
  ayahContainer: {
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
  ayahHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ayahNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
  ayahNumber: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  bookmarkButton: {
    padding: 4,
  },
  ayahContent: {
    marginBottom: 12,
  },
  arabicText: {
    fontSize: 18,
    color: "#333",
    lineHeight: 32,
    textAlign: "right",
    marginBottom: 12,
    fontFamily: "System",
  },
  translationText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  ayahFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  ayahInfo: {
    fontSize: 12,
    color: "#999",
  },

});
