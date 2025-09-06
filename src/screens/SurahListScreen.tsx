import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { SurahItem } from '../components/surah/SurahItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApiCall } from '../hooks/useApiCall';
import { quranAPI } from '../services/api';
import { COLORS } from '@/shared/styles';

export default function SurahListScreen() {
  const { loading, error, data, execute } = useApiCall(quranAPI.getSurahs);

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <View style={styles.container}>
      <LoadingSpinner loading={loading} error={error} text="Loading Surahs...">
        <FlatList
          data={data || []}
          renderItem={({ item }) => <SurahItem item={item} />}
          keyExtractor={(item) => item.number.toString()}
          showsVerticalScrollIndicator={false}
        />
      </LoadingSpinner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
});
