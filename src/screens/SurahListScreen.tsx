import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Surah } from "../types";
import { QuranApi } from "../services/quranApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { RootStackParamList } from "../navigation/AppNavigator";

type SurahListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SurahList"
>;

export default function SurahListScreen() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation = useNavigation<SurahListNavigationProp>();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async (page: number = 1, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      }

      const response = await QuranApi.getSurahs(page, ITEMS_PER_PAGE);
      if (response.code === 200) {
        if (isLoadMore) {
          setSurahs((pre) => [...pre, ...response.data]);
        } else {
          setSurahs(response.data);
        }
      } else {
        Alert.alert("Error", "Failed to fetch surahs");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please check your connection.");
    } finally {
      if(loadingMore){
        setLoadingMore(false);
      }
      setLoading(false)
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchSurahs(1, false);
  };

  const loadMoreSurahs = () => {
    const nextPage = currentPage + 1;
    fetchSurahs(nextPage, true);
    setCurrentPage(nextPage);
  };

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) {
      return surahs;
    }

    const query = searchQuery.toLowerCase().trim();
    return surahs.filter((surah) => {
      return (
        surah.englishName.toLowerCase().includes(query) ||
        surah.englishNameTranslation.toLowerCase().includes(query) ||
        surah.name.includes(query) ||
        surah.number.toString().includes(query)
      );
    });
  }, [surahs, searchQuery]);

  const handleSurahPress = (surah: Surah) => {
    navigation.navigate("SurahDetail", {
      surahNumber: surah.number,
      surahName: surah.englishName,
    });
  };

  const renderSurahItem = ({ item, index }: { item: Surah; index: number }) => (
    <TouchableOpacity
      style={styles.surahItem}
      onPress={() => handleSurahPress(filteredSurahs[index])}
      activeOpacity={0.7}
    >
      <View style={styles.surahNumber}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.arabicName}>{item.name}</Text>
        <Text style={styles.englishName}>{item.englishName}</Text>
        <Text style={styles.translation}>{item.englishNameTranslation}</Text>
        <Text style={styles.details}>
          {item.numberOfAyahs} ayahs • {item.revelationType}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading more surahs...</Text>
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading Surahs..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search surahs..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredSurahs.length === 0 && searchQuery.trim().length > 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No surahs found for "{searchQuery}"
          </Text>
          <Text style={styles.emptySubtext}>
            Try searching by English name, translation, or number
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSurahs}
          renderItem={renderSurahItem}
          keyExtractor={(item) => item.number.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreSurahs}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            searchQuery.trim().length === 0 ? renderFooter : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    marginBottom: 8,
    position: "relative",
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  clearButton: {
    position: "absolute",
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  surahItem: {
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
  surahNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  numberText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  surahInfo: {
    flex: 1,
  },
  arabicName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 4,
    textAlign: "right",
  },
  englishName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  translation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontStyle: "italic",
  },
  details: {
    fontSize: 12,
    color: "#888",
  },
});
