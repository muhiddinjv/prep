import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { useFocusEffect, useRoute } from '@react-navigation/native';

import LoadingSpinner from '@/components/LoadingSpinner';
import { AyahItem } from '@/components/surah/AyahItem';
import { SurahHeader } from '@/components/surah/SurahHeader';
import { useApiCall } from '@/hooks/useApiCall';
import { useBookmarks } from '@/hooks/useBookmarks';
import { quranAPI } from '@/services/api';
import { Ayah, BookmarkedAyah, QuranData, Surah, SurahDetailRouteProp } from '@/types';


export default function SurahDetailScreen() {
  const route = useRoute<SurahDetailRouteProp>();
  const { surahNumber, surahName, targetAyahNumber } = route.params;
  const flatListRef = useRef<FlatList>(null);

  const { loading, error, data, execute } = useApiCall<Surah, [QuranData]>(quranAPI.getSurah);
  const { toggleBookmark, isBookmarked, refreshBookmarks } = useBookmarks();

  useEffect(() => {
    execute({ number: surahNumber, language: 'en', reciter: 'asad' });
  }, [surahNumber]);

  useFocusEffect(
    React.useCallback(() => {
      refreshBookmarks();
    }, [refreshBookmarks]),
  );

  useEffect(() => {
      if (data?.ayahs && targetAyahNumber) {
      const targetIndex = data.ayahs.findIndex((ayah) => ayah.numberInSurah === targetAyahNumber);
      if (targetIndex !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: targetIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 500);
      }
    }
  }, [data, targetAyahNumber]);

  useFocusEffect(
    React.useCallback(() => {
      if (data?.ayahs && targetAyahNumber) {
        const targetIndex = data.ayahs.findIndex((ayah) => ayah.numberInSurah === targetAyahNumber);
        if (targetIndex !== -1) {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: targetIndex,
              animated: true,
              viewPosition: 0.5,
            });
          }, 300);
        }
      }
    }, [data, targetAyahNumber]),
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

  const renderAyahItem = useCallback(
    ({ item, index }: { item: Ayah; index: number }) => {
      const isBookmarkedStatus = isBookmarked(surahNumber, item.numberInSurah);

      return <AyahItem item={item} isBookmarked={isBookmarkedStatus} onToggleBookmark={handleToggleBookmark} />;
    },
    [surahNumber, isBookmarked, handleToggleBookmark],
  );

  return (
    <View style={styles.container}>
      <LoadingSpinner loading={loading} error={error} text="Loading Surah...">
        <FlatList
          ref={flatListRef}
          data={data?.ayahs || []}
          renderItem={renderAyahItem}
          keyExtractor={(item) => item.number.toString()}
          ListHeaderComponent={<SurahHeader surah={data} />}
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
  bookmarkButton: {
    padding: 4,
  },
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  surahHeader: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  surahName: {
    color: '#2E7D32',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  translationText: {
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
  },
});
