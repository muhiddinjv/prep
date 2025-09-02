import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { appVersion, DEVELOPER_INFO } from "../shared/constants/app";
import { COLORS } from "../shared/styles/colors";
import SettingItem from "./SettingItem";
import { getSettingsConfig } from "../shared/constants/settings";

interface SettingsState {
  notifications: boolean;
  darkMode: boolean;
  autoPlay: boolean;
  language: string;
}

export default function AboutScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    darkMode: false,
    autoPlay: false,
    language: 'English',
  });

  const handleSettingToggle = (key: keyof SettingsState) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLanguageChange = () => {
    Alert.alert(
      "Select Language",
      "Choose your preferred language",
      [
        { text: "English", onPress: () => setSettings(prev => ({ ...prev, language: 'English' })) },
        { text: "العربية", onPress: () => setSettings(prev => ({ ...prev, language: 'Arabic' })) },
        { text: "Français", onPress: () => setSettings(prev => ({ ...prev, language: 'French' })) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleContactDeveloper = () => {
    Alert.alert(
      "Contact Developer",
      "How would you like to contact the developer?",
      [
        { text: "Email", onPress: () => Linking.openURL(`mailto:${DEVELOPER_INFO.email}`) },
        { text: "GitHub", onPress: () => Linking.openURL(DEVELOPER_INFO.githubUrl) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      "Rate App",
      "Thank you for using Quranic! Please rate our app.",
      [
        { text: "Rate Now", onPress: () => Alert.alert("Rate", "Redirecting to app store...") },
        { text: "Later", style: "cancel" }
      ]
    );
  };

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* App Header */}
      <View style={styles.appHeader}>
        <View style={styles.appIcon}>
          <Icon name="book" size={48} color="#ffffff" />
        </View>
        <Text style={styles.appName}>Quranic</Text>
        <Text style={styles.appVersion}>Version {appVersion}</Text>
        <Text style={styles.appDescription}>
          A beautiful Quran reading app with translations and bookmarks
        </Text>
      </View>

      {/* Settings Section */}
      {renderSectionHeader("Settings")}
      
      {/* Settings Items */}
      {getSettingsConfig(
        settings,
        setSettings,
        handleSettingToggle,
        handleLanguageChange,
        handleContactDeveloper,
        handleRateApp
      ).map((setting) => (
        <SettingItem
          key={setting.id}
          icon={setting.icon}
          title={setting.title}
          subtitle={setting.subtitle}
          action={setting.action}
          showSwitch={setting.showSwitch}
          switchValue={setting.switchValue}
        />
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for the Muslim community
        </Text>
        <Text style={styles.footerText}>
          © 2024 Quranic. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.quinary,
  },
  appHeader: {
    backgroundColor: COLORS.white,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 16,
    color: COLORS.secondary,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionHeader: {
    backgroundColor: COLORS.quaternary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: COLORS.tertiary,
    textAlign: "center",
    marginBottom: 4,
  },
});
