import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { quranAPI } from "../services/api";
import { useApiCall } from "../hooks/useApiCall";
import { Surah } from "../types";
import { RootStackParamList } from "../navigation/AppNavigator";
import LoadingSpinner from "../components/LoadingSpinner";

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
    <TouchableOpacity 
      style={styles.surahItem} 
      onPress={() => handleSurahPress(item)}
    >
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
      <LoadingSpinner 
        loading={loading} 
        error={error}
        text="Loading Surahs..."
      >
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
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    padding: 16,
  },
  surahItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  numberText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  surahTranslation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  surahDetails: {
    fontSize: 12,
    color: "#999",
  },
  arabicName: {
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "bold",
  },
});
