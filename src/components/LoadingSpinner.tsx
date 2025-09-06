import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingSpinnerProps {
  loading: boolean;
  error?: string | null;
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  children?: React.ReactNode;
}

export default function LoadingSpinner({
  loading,
  error,
  size = 'large',
  color = '#2E7D32',
  text = 'Loading...',
  children,
}: LoadingSpinnerProps) {
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={size} color={color} />
        <Text style={styles.loadingText}>{text}</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },
});
