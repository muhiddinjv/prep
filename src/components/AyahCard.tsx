import { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface AyahCardProps {
  isBookmarked: boolean;
  ayahNumber: number;
  arabicText: string;
  englishText?: string;
  surahName: string;
  totalAyahs: number;
  onBookmark: () => void;
  maxHeight?: number;
}

const { width, height } = Dimensions.get("window");

const AyahCard = memo(({
  isBookmarked,
  ayahNumber,
  arabicText,
  englishText,
  surahName,
  totalAyahs,
  onBookmark,
  maxHeight,
}: AyahCardProps) => {
  const cardHeight = maxHeight || height - 200;
 
  return (
    <View style={[styles.card, { height: cardHeight }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.ayahInfo}>
          <Text style={styles.surahName}>{surahName}</Text>
          <Text style={styles.ayahProgress}>
            {ayahNumber} of {totalAyahs}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={onBookmark}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name={isBookmarked ? "bookmark" : "bookmark-border"} 
            size={24} color="#999" 
          />
        </TouchableOpacity>
      </View>

      {/* Ayah Number Circle */}
      <View style={styles.ayahNumberContainer}>
        <View style={styles.ayahNumberCircle}>
          <Text style={styles.ayahNumberText}>{ayahNumber}</Text>
        </View>
      </View>

      {/* Arabic Text */}
      <View style={styles.arabicContainer}>
        <Text style={styles.arabicText}>{arabicText}</Text>
      </View>

      {/* English Translation */}
      {englishText && (
        <View style={styles.englishContainer}>
          <Text style={styles.englishText}>{englishText}</Text>
        </View>
      )}

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(ayahNumber / totalAyahs) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Swipe Hint */}
      <View style={styles.swipeHint}>
        <MaterialIcons name="swipe" size={20} color="#999" />
        <Text style={styles.swipeText}>Swipe for next ayah</Text>
      </View>
    </View>
  );
})

export default AyahCard;

const styles = StyleSheet.create({
  card: {
    width: width - 40,
    // Height will be set dynamically via props
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  ayahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 2,
  },
  ayahProgress: {
    fontSize: 14,
    color: "#666",
  },
  bookmarkButton: {
    padding: 8,
  },
  ayahNumberContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  ayahNumberCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F5E8",
    borderWidth: 2,
    borderColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
  ayahNumberText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  arabicContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: "center",
    color: "#1B5E20",
    fontWeight: "500",
  },
  englishContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  englishText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#555",
    fontStyle: "italic",
  },
  progressContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 2,
  },
  swipeHint: {
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.6,
  },
  swipeText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 5,
  },
});
