import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import Swiper from "react-native-deck-swiper";

import { BookmarkedAyah } from "../types";
import { QuranApi } from "../services/quranApi";
import { BookmarkService } from "../services/bookmarkService";
import LoadingSpinner from "../components/LoadingSpinner";
import AyahCard from "../components/AyahCard";
import SwipeControls from "../components/SwipeControls";
import { RootStackParamList } from "../navigation/AppNavigator";

type SurahDetailRouteProp = RouteProp<RootStackParamList, "SurahDetail">;

const { width, height } = Dimensions.get("window");

export default function SurahDetailScreen() {
  const [surahData, setSurahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>([]);
  const [bookmarkUpdateTrigger, setBookmarkUpdateTrigger] = useState(0);
  
  const swiperRef = useRef<Swiper<any>>(null);
  const isRef = useRef({ isProgrammaticSwipe: false });
  const route = useRoute<SurahDetailRouteProp>();
  const { surahNumber, targetAyahNumber } = route.params;

  const headerHeight = 120;
  const controlsHeight = 180;
  const safeAreaPadding = 100;
  const bismillahHeight = surahNumber !== 1 && surahNumber !== 9 && currentIndex === 0 ? 60 : 0;
  const calculatedCardHeight = height - headerHeight - controlsHeight - safeAreaPadding - bismillahHeight;
  const maxCardHeight = height * 0.55;
  const availableCardHeight = Math.min(calculatedCardHeight, maxCardHeight);

  useEffect(() => {
    fetchSurahDetail();
  }, [surahNumber]);

  const loadBookmarks = useCallback(async () => {
    try {
      const savedBookmarks = await BookmarkService.getBookmarks();
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
      // Jump to target ayah if specified and surah data is loaded
      if (targetAyahNumber && surahData) {
        // Find the correct index by matching numberInSurah
        const targetIndex = surahData[0]?.ayahs?.findIndex(
          (ayah: any) => ayah.numberInSurah === targetAyahNumber
        ) || 0;
        setCurrentIndex(targetIndex);
        setTimeout(() => {
          if (swiperRef.current) {
            swiperRef.current.jumpToCardIndex(targetIndex);
          }
        }, 100);
      }
    }, [loadBookmarks, targetAyahNumber, surahData])
  );

  const fetchSurahDetail = async () => {
    try {
      const response = await QuranApi.getSurahWithTranslation(surahNumber);
      if (response.code === 200) {
        setSurahData(response.data);
        
        // Jump to target ayah if specified
        if (targetAyahNumber) {
          // Find the correct index by matching numberInSurah
          const targetIndex = response.data[0]?.ayahs?.findIndex(
            (ayah: any) => ayah.numberInSurah === targetAyahNumber
          ) || 0;
          setCurrentIndex(targetIndex);
          // Use setTimeout to ensure Swiper is rendered before jumping
          setTimeout(() => {
            if (swiperRef.current) {
              swiperRef.current.jumpToCardIndex(targetIndex);
            }
          }, 500);
        }
      } else {
        Alert.alert("Error", "Failed to fetch surah details");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (aya: any) => {
    try {
      const arabicAyah = surahData?.[0]?.ayahs?.find?.(
        (ayah: any) => ayah?.numberInSurah === aya.numberInSurah
      );
      const englishAyah = surahData?.[1]?.ayahs?.find?.(
        (ayah: any) => ayah?.numberInSurah === aya.numberInSurah
      );

      const bookmarkedAyah: BookmarkedAyah = {
        surahNumber,
        ayahNumber: aya.numberInSurah,
        surahName: surahData?.[0]?.englishName,
        arabicText: arabicAyah?.text,
        englishText: englishAyah?.text,
        bookmarkedAt: new Date()?.toISOString?.(),
      };
      const isBookmarked = await BookmarkService.isBookmarked(surahNumber, aya.numberInSurah);
      
      if (isBookmarked) {
        await BookmarkService.removeBookmark(surahNumber, aya.numberInSurah);
      } else {
        await BookmarkService.addBookmark(bookmarkedAyah);
      }
      // Reload bookmarks to ensure UI is in sync
      await loadBookmarks();
      // Trigger re-render of Swiper
      setBookmarkUpdateTrigger(prev => prev + 1);
    
    } catch (error) {
      console.error("Error handling bookmark:", error);
      Alert.alert("Error", "Failed to update bookmark");
    }
  };

  const handleSwipeNext = () => {
    if (swiperRef.current && !isAnimating && currentIndex < surahData?.[0]?.ayahs?.length - 1) {
      setIsAnimating(true);
      isRef.current.isProgrammaticSwipe = true;
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      swiperRef.current.jumpToCardIndex(newIndex);
      setTimeout(() => {
        setIsAnimating(false);
        isRef.current.isProgrammaticSwipe = false;
      }, 500);
    }
  };

  const handleSwipePrevious = () => {
    if (swiperRef.current && currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      isRef.current.isProgrammaticSwipe = true;
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      swiperRef.current.jumpToCardIndex(newIndex);
      setTimeout(() => {
        setIsAnimating(false);
        isRef.current.isProgrammaticSwipe = false;
      }, 500);
    }
  };

  const handleShuffle = () => {
    if (swiperRef?.current && !isAnimating) {
      const randomIndex = Math?.floor?.(
        Math?.random?.() * surahData?.[0]?.ayahs?.length
      );
      setIsAnimating?.(true);
      setCurrentIndex?.(randomIndex);
      swiperRef?.current?.jumpToCardIndex?.(randomIndex);
      setTimeout?.(() => {
        setIsAnimating?.(false);
      }, 200);
    }
  };

  const renderCard = (item: any, index: number) => {
    const arabicAyah = surahData?.[0]?.ayahs?.[index];
    const englishAyah = surahData?.[1]?.ayahs?.[index];
    const bookmarked = bookmarks.some(b => b?.surahNumber === surahNumber && b?.ayahNumber === item?.numberInSurah);

    return (
      <AyahCard
        isBookmarked={bookmarked}
        ayahNumber={arabicAyah?.numberInSurah}
        arabicText={arabicAyah?.text}
        englishText={englishAyah?.text}
        surahName={surahData?.[0]?.englishName}
        totalAyahs={surahData?.[0]?.numberOfAyahs}
        onBookmark={()=>handleBookmark(item)}
        maxHeight={availableCardHeight}
      />
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading Surah..." />;
  }

  if (!surahData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load surah data</Text>
      </View>
    );
  }

  const arabicSurah = surahData[0];

  const onSwipe = (cardIndex:number, swipeRight:boolean) => {
    if (!isRef.current.isProgrammaticSwipe) {
      setCurrentIndex(prev => swipeRight ? cardIndex - 1 : cardIndex + 1);
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    isRef.current.isProgrammaticSwipe = false;
  }

  const disableLastSwipe = currentIndex === arabicSurah.ayahs.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.surahTitle}>{arabicSurah.name}</Text>
        <Text style={styles.surahSubtitle}>{arabicSurah.englishName}</Text>
        <Text style={styles.surahInfo}>
          {arabicSurah.numberOfAyahs} ayahs • {arabicSurah.revelationType}
        </Text>
      </View>

      {/* Bismillah for specific surahs */}
      {surahNumber !== 1 && surahNumber !== 9 && currentIndex === 0 && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillah}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
        </View>
      )}

      {/* Card Swiper */}
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={arabicSurah.ayahs}
          renderCard={renderCard}
          onSwipedRight={(ind)=> onSwipe(ind, true)}
          onSwipedLeft={(ind)=> onSwipe(ind, false)}
          onSwipedTop={(cardIndex) => {handleBookmark(arabicSurah.ayahs[cardIndex])}}
          cardIndex={currentIndex + bookmarkUpdateTrigger * 0.0001}
          backgroundColor="transparent"
          stackSize={2}
          stackScale={10}
          stackSeparation={15}
          swipeAnimationDuration={200}
          stackAnimationFriction={15}
          stackAnimationTension={100}
          disableLeftSwipe={disableLastSwipe}
          disableBottomSwipe={disableLastSwipe}
          disableTopSwipe={disableLastSwipe}
          disableRightSwipe={currentIndex === 0}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
          overlayLabels={overlayLabels}
          verticalSwipe={true}
          horizontalSwipe={true}
        />
      </View>

      {/* Controls */}
      <SwipeControls
        onPrevious={handleSwipePrevious}
        onNext={handleSwipeNext}
        onShuffle={handleShuffle}
        canGoPrevious={currentIndex > 0}
        canGoNext={currentIndex < (surahData?.[0]?.ayahs?.length - 1)}
      />
    </SafeAreaView>
  );
}

const overlayLabels = {
  left: {
    title: "NEXT",
    style: {
      label: {
        backgroundColor: "#4ECDC4",
        borderColor: "#4ECDC4",
        color: "white",
        borderWidth: 1,
        fontSize: 24,
      },
      wrapper: {
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        marginTop: 30,
        marginLeft: -30,
      },
    },
  },
  right: {
    title: "NEXT",
    style: {
      label: {
        backgroundColor: "#4ECDC4",
        borderColor: "#4ECDC4",
        color: "white",
        borderWidth: 1,
        fontSize: 24,
      },
      wrapper: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: 30,
        marginLeft: 30,
      },
    },
  },
  top: {
    title: "BOOKMARKED",
    style: {
      label: {
        backgroundColor: "#2E7D32",
        borderColor: "#2E7D32",
        color: "white",
        borderWidth: 1,
        fontSize: 24,
      },
      wrapper: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  surahTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  surahSubtitle: {
    fontSize: 16,
    color: "#E8F5E8",
    marginBottom: 2,
  },
  surahInfo: {
    fontSize: 12,
    color: "#E8F5E8",
  },
  bismillahContainer: {
    backgroundColor: "white",
    padding: 15,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bismillah: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "600",
  },
  swiperContainer: {
    flex: 1,
    paddingTop: 0,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
