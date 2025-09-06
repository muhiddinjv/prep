import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  hasBookmarks: boolean;
  onButtonClear: () => void;
};

export const BookmarksHeader = ({ hasBookmarks, onButtonClear }: Props) => {
  const handleClearAllBookmarks = () => {
    Alert.alert('Clear All Bookmarks', 'Are you sure you want to remove all bookmarks? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: onButtonClear,
      },
    ]);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Bookmarks</Text>

      {hasBookmarks && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAllBookmarks}>
          <MaterialIcons name="clear-all" size={20} color="#d32f2f" />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  clearButton: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  clearButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    marginLeft: 4,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
