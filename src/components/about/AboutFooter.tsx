import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/shared/styles';

const AboutFooter = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Made with ❤️ for the Muslim community</Text>
      <Text style={styles.footerText}>© 2024 Quranic. All rights reserved.</Text>
    </View>
  );
}

export default AboutFooter;


const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    color: COLORS.tertiary,
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
});