import { Ayah } from '@/types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  item: Ayah;
  isBookmarked: boolean;
  onToggleBookmark: (ayah: Ayah) => void;
};

export const AyahItem = ({ item, isBookmarked, onToggleBookmark }: Props) => (
  <View style={styles.ayahContainer}>
    <View style={styles.ayahHeader}>
      <View style={styles.ayahNumberContainer}>
        <Text style={styles.ayahNumber}>{item.numberInSurah}</Text>
      </View>
      <TouchableOpacity style={styles.bookmarkButton} onPress={() => onToggleBookmark(item)}>
        <Icon
          name={isBookmarked ? 'bookmark' : 'bookmark-border'}
          size={24}
          color={isBookmarked ? '#2E7D32' : '#666'}
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
);

const styles = StyleSheet.create({

  ayahContainer: {
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
  ayahContent: {
    marginBottom: 12,
  },
  ayahFooter: {
    borderTopColor: '#f0f0f0',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  ayahHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ayahInfo: {
    color: '#999',
    fontSize: 12,
  },
  ayahNumber: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ayahNumberContainer: {
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  bookmarkButton: {
    padding: 4,
  },
   translationText: {
    color: '#666',
    fontSize: 16,
  },
});
