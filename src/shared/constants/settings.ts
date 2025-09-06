import { Alert, Linking } from "react-native";

import { DEVELOPER_INFO } from "./app";

export interface SettingItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'action' | 'language';
  action?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
}

export const getSettingsConfig = (
  settings: any,
  setSettings: any,
  handleSettingToggle: (key: 'notifications' | 'darkMode' | 'autoPlay') => void,
  handleLanguageChange: () => void,
  handleContactDeveloper: () => void,
  handleRateApp: () => void
): SettingItem[] => [
  // Settings Section
  {
    id: 'notifications',
    icon: 'notifications',
    title: 'Notifications',
    subtitle: 'Get notified about daily verses',
    type: 'toggle',
    showSwitch: true,
    switchValue: settings.notifications,
    action: () => handleSettingToggle('notifications'),
  },
  {
    id: 'darkMode',
    icon: 'dark-mode',
    title: 'Dark Mode',
    subtitle: 'Switch to dark theme',
    type: 'toggle',
    showSwitch: true,
    switchValue: settings.darkMode,
    action: () => handleSettingToggle('darkMode'),
  },
  {
    id: 'autoPlay',
    icon: 'play-arrow',
    title: 'Auto Play',
    subtitle: 'Automatically play audio recitations',
    type: 'toggle',
    showSwitch: true,
    switchValue: settings.autoPlay,
    action: () => handleSettingToggle('autoPlay'),
  },
  {
    id: 'language',
    icon: 'language',
    title: 'Language',
    subtitle: `Current: ${settings.language}`,
    type: 'action',
    action: handleLanguageChange,
  },

  // App Actions Section
  {
    id: 'rateApp',
    icon: 'star',
    title: 'Rate App',
    subtitle: 'Rate us on the app store',
    type: 'action',
    action: handleRateApp,
  },
  {
    id: 'shareApp',
    icon: 'share',
    title: 'Share App',
    subtitle: 'Share with friends and family',
    type: 'action',
    action: () => Alert.alert('Share', 'Sharing app...'),
  },
  {
    id: 'feedback',
    icon: 'feedback',
    title: 'Send Feedback',
    subtitle: 'Help us improve the app',
    type: 'action',
    action: () => Alert.alert('Feedback', 'Opening feedback form...'),
  },

  // Developer Section
  {
    id: 'developer',
    icon: 'person',
    title: 'Developer',
    subtitle: DEVELOPER_INFO.name,
    type: 'action',
    action: handleContactDeveloper,
  },
  {
    id: 'contact',
    icon: 'email',
    title: 'Contact',
    subtitle: DEVELOPER_INFO.email,
    type: 'action',
    action: () => Linking.openURL(`mailto:${DEVELOPER_INFO.email}`),
  },
  {
    id: 'github',
    icon: 'code',
    title: 'GitHub',
    subtitle: 'View source code',
    type: 'action',
    action: () => Linking.openURL(DEVELOPER_INFO.githubUrl),
  },

  // Legal Section
  {
    id: 'privacy',
    icon: 'description',
    title: 'Privacy Policy',
    subtitle: 'Read our privacy policy',
    type: 'action',
    action: () => Alert.alert('Privacy Policy', 'Opening privacy policy...'),
  },
  {
    id: 'terms',
    icon: 'description',
    title: 'Terms of Service',
    subtitle: 'Read our terms of service',
    type: 'action',
    action: () => Alert.alert('Terms of Service', 'Opening terms of service...'),
  },
  {
    id: 'licenses',
    icon: 'description',
    title: 'Open Source Licenses',
    subtitle: 'View third-party licenses',
    type: 'action',
    action: () => Alert.alert('Licenses', 'Opening licenses...'),
  },
];
