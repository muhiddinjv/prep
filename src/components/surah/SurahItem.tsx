import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Surah, SurahListNavigationProp } from '@/types';

type Props = {
  item: Surah;
};

export const SurahItem = ({ item }: Props) => {
  const navigation = useNavigation<SurahListNavigationProp>();

  const handleSurahPress = () => {
    navigation.navigate('SurahDetail', {
      surahNumber: item.number,
      surahName: item.englishName,
    });
  };

  return (
    <TouchableOpacity style={styles.surahItem} onPress={handleSurahPress}>
      <View style={styles.surahNumber}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.englishName}</Text>
        <Text style={styles.surahTranslation}>{item.englishNameTranslation}</Text>
        <Text style={styles.surahDetails}>
          {item.revelationType} • {item.numberOfAyahs} verses
        </Text>
      </View>
      <Text style={styles.arabicName}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arabicName: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  numberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  surahDetails: {
    color: '#999',
    fontSize: 12,
  },
  surahInfo: {
    flex: 1,
  },
  surahItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  surahName: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  surahNumber: {
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: 16,
    width: 40,
  },
  surahTranslation: {
    color: '#666',
    fontSize: 14,
    marginBottom: 2,
  },
});
