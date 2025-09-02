import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

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
  children 
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
