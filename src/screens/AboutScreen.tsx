import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import AboutFooter from '@/components/about/AboutFooter';
import AboutHeader from '@/components/about/AboutHeader';
import SettingItem from '@/components/about/SettingItem';
import { DEVELOPER_INFO, getSettingsConfig } from '@/shared/constants';
import { COLORS } from '@/shared/styles';
import { MaterialIcons } from '@expo/vector-icons';

type SettingsState = {
  notifications: boolean;
  darkMode: boolean;
  autoPlay: boolean;
  language: string;
};

export default function AboutScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    darkMode: false,
    autoPlay: false,
    language: 'English',
  });

  const handleSettingToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLanguageChange = () => {
    Alert.alert('Select Language', 'Choose your preferred language', [
      { text: 'English', onPress: () => setSettings((prev) => ({ ...prev, language: 'English' })) },
      { text: 'العربية', onPress: () => setSettings((prev) => ({ ...prev, language: 'Arabic' })) },
      { text: 'Français', onPress: () => setSettings((prev) => ({ ...prev, language: 'French' })) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleContactDeveloper = () => {
    Alert.alert('Contact Developer', 'How would you like to contact the developer?', [
      { text: 'Email', onPress: () => Linking.openURL(`mailto:${DEVELOPER_INFO.email}`) },
      { text: 'GitHub', onPress: () => Linking.openURL(DEVELOPER_INFO.githubUrl) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for using Quranic! Please rate our app.', [
      { text: 'Rate Now', onPress: () => Alert.alert('Rate', 'Redirecting to app store...') },
      { text: 'Later', style: 'cancel' },
    ]);
  };

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AboutHeader />
      {renderSectionHeader('Settings')}
      {getSettingsConfig(
        settings,
        setSettings,
        handleSettingToggle,
        handleLanguageChange,
        handleContactDeveloper,
        handleRateApp,
      ).map((setting) => (
        <SettingItem
          key={setting.id}
          icon={setting.icon as keyof typeof MaterialIcons.glyphMap}
          title={setting.title}
          subtitle={setting.subtitle}
          action={setting.action}
          showSwitch={setting.showSwitch}
          switchValue={setting.switchValue}
        />
      ))}
      <AboutFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.quinary,
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: COLORS.quaternary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
