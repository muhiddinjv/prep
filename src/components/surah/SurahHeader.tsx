import { StyleSheet, Text, View } from 'react-native';

import { Surah } from '@/types';

type Props = {
  surah?: Surah | null;
};

export const SurahHeader = ({ surah }: Props) => {
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

const styles = StyleSheet.create({
  surahHeader: {
    padding: 16,
  },
  surahName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  surahArabicName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  surahTranslation: {
    fontSize: 16,
  },
  surahInfo: {
    fontSize: 16,
  },
});
