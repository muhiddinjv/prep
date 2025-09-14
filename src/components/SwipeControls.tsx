import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface SwipeControlsProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onShuffle?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export default function SwipeControls({
  onPrevious,
  onNext,
  onShuffle,
  canGoPrevious = true,
  canGoNext = true,
}: SwipeControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canGoPrevious && styles.buttonDisabled]}
        onPress={onPrevious}
        disabled={!canGoPrevious}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="skip-previous"
          size={30}
          color={canGoPrevious ? "#2E7D32" : "#ccc"}
        />
        <Text
          style={[
            styles.buttonText,
            !canGoPrevious && styles.buttonTextDisabled,
          ]}
        >
          Previous
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shuffleButton}
        onPress={onShuffle}
        activeOpacity={0.7}
      >
        <MaterialIcons name="shuffle" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !canGoNext && styles.buttonDisabled]}
        onPress={onNext}
        disabled={!canGoNext}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="skip-next"
          size={30}
          color={canGoNext ? "#2E7D32" : "#ccc"}
        />
        <Text
          style={[styles.buttonText, !canGoNext && styles.buttonTextDisabled]}
        >
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 15,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  button: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    minWidth: 70,
  },
  buttonDisabled: {
    backgroundColor: "#F0F0F0",
  },
  buttonText: {
    fontSize: 12,
    color: "#2E7D32",
    marginTop: 5,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#ccc",
  },
  shuffleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
