import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle } from "lucide-react-native";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TrainingCompletionScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        },
        icon: {
          marginBottom: 24,
        },
        title: {
          fontSize: 28,
          fontWeight: "bold",
          color: colors.text,
          textAlign: "center",
          marginBottom: 12,
        },
        message: {
          fontSize: 16,
          color: colors.muted,
          textAlign: "center",
          marginBottom: 32,
          lineHeight: 22,
        },
        button: {
          backgroundColor: colors.primary,
          paddingHorizontal: 32,
          paddingVertical: 14,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        buttonText: {
          color: colors.card,
          fontSize: 16,
          fontWeight: "600",
        },
      }),
    [colors]
  );

  const handleBackToTopics = () => {
    router.push("/training/topics")
  };

  return (
    <View style={styles.container}>
      <CheckCircle size={80} color={colors.success} style={styles.icon} />
      <Text style={styles.title}>Тема пройдена!</Text>
      <Text style={styles.message}>
        Вы успешно завершили эту тему.{"\n"}
        Выберите другую тему для продолжения обучения.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleBackToTopics}>
        <ArrowLeft size={20} color={colors.card} />
        <Text style={styles.buttonText}>К списку тем</Text>
      </TouchableOpacity>
    </View>
  );
}