import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

export const BookmarksEmptyState = () => {
  return (
    <View style={styles.emptyState}>
      <MaterialIcons name="bookmark-border" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Bookmarks</Text>
      <Text style={styles.emptySubtitle}>Start reading the Quran and bookmark your favorite verses</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptySubtitle: {
    color: '#999',
    fontSize: 16,
    paddingHorizontal: 32,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
});
