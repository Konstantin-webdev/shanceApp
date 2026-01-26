// components/TrainingLoadingScreen.tsx
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

interface TrainingLoadingScreenProps {
  message?: string;
}

export default function TrainingLoadingScreen({
  message = "Загрузка вопросов...",
}: TrainingLoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
  },
});
