import { StyleSheet, Text, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { appVersion } from '@/shared/constants';
import { COLORS } from '@/shared/styles';

const AboutHeader = () => {
  return (
    <View style={styles.appHeader}>
      <View style={styles.appIcon}>
        <MaterialIcons name="book" size={48} color="#ffffff" />
      </View>
      <Text style={styles.appName}>Quranic</Text>
      <Text style={styles.appVersion}>Version {appVersion}</Text>
      <Text style={styles.appDescription}>A beautiful Quran reading app with translations and bookmarks</Text>
    </View>
  );
};

export default AboutHeader;

const styles = StyleSheet.create({
  appDescription: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  appHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 16,
    padding: 24,
  },
  appIcon: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  appName: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    color: COLORS.secondary,
    fontSize: 16,
    marginBottom: 12,
  },
});
