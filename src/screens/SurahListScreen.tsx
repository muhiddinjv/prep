import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import LoadingSpinner from '../components/LoadingSpinner';
import { useApiCall } from '../hooks/useApiCall';
import { RootStackParamList } from '../navigation/AppNavigator';
import { quranAPI } from '../services/api';
import { Surah } from '../types';

type SurahListNavigationProp = StackNavigationProp<RootStackParamList, 'SurahList'>;

export default function SurahListScreen() {
  const navigation = useNavigation<SurahListNavigationProp>();

  const { loading, error, data, execute } = useApiCall(quranAPI.getSurahs);

  useEffect(() => {
    execute();
  }, [execute]);

  const handleSurahPress = (surah: Surah) => {
    navigation.navigate('SurahDetail', {
      surahNumber: surah.number,
      surahName: surah.englishName,
    });
  };

  const renderSurahItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity style={styles.surahItem} onPress={() => handleSurahPress(item)}>
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

  return (
    <View style={styles.container}>
      <LoadingSpinner loading={loading} error={error} text="Loading Surahs...">
        <FlatList
          data={data?.data || []}
          renderItem={renderSurahItem}
          keyExtractor={(item) => item.number.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </LoadingSpinner>
    </View>
  );
}

const styles = StyleSheet.create({
  arabicName: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  listContainer: {
    padding: 16,
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
