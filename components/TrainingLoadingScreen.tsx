// components/TrainingLoadingScreen.tsx
import { useTheme } from "@/components/ThemeProvider";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface TrainingLoadingScreenProps {
  message?: string;
}

export default function TrainingLoadingScreen({
  message = "Загрузка вопросов...",
}: TrainingLoadingScreenProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    text: {
      marginTop: 16,
      fontSize: 16,
      color: colors.muted,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
