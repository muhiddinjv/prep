import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { BookmarkedAyah, SurahListNavigationProp } from '@/types';

type Props = {
  item: BookmarkedAyah;
  removeBookmark: (surahNumber: number, ayahNumber: number) => void;
};

export const BookmarksItem = ({ item, removeBookmark }: Props) => {
  const navigation = useNavigation<SurahListNavigationProp>();

  const handleBookmarkPress = () => {
    navigation.navigate('SurahDetail', {
      surahNumber: item.surahNumber,
      surahName: item.surahName,
      targetAyahNumber: item.ayahNumber,
    });
  };

  const handleRemoveBookmark = () => {
    Alert.alert('Remove Bookmark', `Remove bookmark for ${item.surahName} verse ${item.ayahNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeBookmark(item.surahNumber, item.ayahNumber),
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.bookmarkItem} onPress={handleBookmarkPress}>
      <View style={styles.bookmarkHeader}>
        <View style={styles.bookmarkInfo}>
          <Text style={styles.surahName}>{item.surahName}</Text>
          <Text style={styles.verseNumber}>Verse {item.ayahNumber}</Text>
        </View>
        <TouchableOpacity style={styles.removeButton} onPress={handleRemoveBookmark}>
          <MaterialIcons name="delete" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      <Text style={styles.verseText} numberOfLines={3}>
        {item.ayahText}
      </Text>

      {item.note && (
        <View style={styles.noteContainer}>
          <MaterialIcons name="note" size={16} color="#666" />
          <Text style={styles.noteText} numberOfLines={2}>
            {item.note}
          </Text>
        </View>
      )}

      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );
};

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
