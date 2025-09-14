import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="book" size={60} color="#2E7D32" />
        <Text style={styles.title}>Quranic</Text>
        <Text style={styles.subtitle}>A simple Quran reading app</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this App</Text>
          <Text style={styles.text}>
            This app provides a clean and simple interface to read the Holy
            Quran. Browse through all 114 surahs, read both Arabic text and
            English translations, and enjoy a peaceful reading experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.bulletPoint}>
            • Complete list of all 114 surahs
          </Text>
          <Text style={styles.bulletPoint}>
            • Arabic text with English translation
          </Text>
          <Text style={styles.bulletPoint}>
            • Clean and easy-to-read interface
          </Text>
          <Text style={styles.bulletPoint}>• Offline reading support</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Source</Text>
          <Text style={styles.text}>
            Quran text and translations are provided by AlQuran.cloud API, which
            offers authentic and verified Quranic content.
          </Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openLink("https://alquran.cloud")}
          >
            <Text style={styles.linkText}>Visit AlQuran.cloud</Text>
            <MaterialIcons name="open-in-new" size={16} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Translations</Text>
          <Text style={styles.text}>
            English translation by Muhammad Asad is used for this app. Other
            translations and audio recitations may be added in future updates.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            May Allah accept our efforts in spreading His word.
          </Text>
          <Text style={styles.footerText}>Ameen.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#2E7D32",
    padding: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#E8F5E8",
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 4,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#E8F5E8",
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#2E7D32",
    marginRight: 8,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2E7D32",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 4,
  },
});
