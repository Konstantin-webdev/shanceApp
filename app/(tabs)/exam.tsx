import { useTheme } from "@/components/ThemeProvider"; // Добавьте импорт
import { useRouter } from "expo-router";
import { AlertCircle, Award, Clock, Play } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfessionStore } from "../store/useProfessionStore";

export default function ExamScreen() {
  const router = useRouter();
  const { selectedProfession } = useProfessionStore();
  const [isLoading, setIsLoading] = useState(false);

  // Используем тему
  const { colors } = useTheme();

  const handleStartExam = () => {
    if (!selectedProfession) return;

    setIsLoading(true);
    router.push({
      pathname: "/exam/[professionId]",
      params: { professionId: selectedProfession.id.toString() },
    });
    setIsLoading(false);
  };

  // Создаем стили с использованием цветов темы
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 12, // Уменьшен отступ сверху
      paddingBottom: 16,
      backgroundColor: colors.card,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.danger, // Красный цвет для экзамена
    },
    subtitle: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
    },
    content: {
      padding: 20,
    },
    professionInfo: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginTop: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.danger + "20", // 20% прозрачности danger цвета
    },
    professionName: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    professionStats: {
      fontSize: 14,
      color: colors.danger,
      marginTop: 4,
    },
    startButton: {
      backgroundColor: colors.danger,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: 12,
      marginTop: 8,
      marginBottom: 24,
      gap: 8,
    },
    disabledButton: {
      backgroundColor: colors.muted,
    },
    startButtonText: {
      color: "#FFFFFF", // Белый остается всегда белым
      fontSize: 16,
      fontWeight: "600",
    },
    featuresCard: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    featuresTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    featureTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    featureTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    featureDescription: {
      fontSize: 13,
      color: colors.muted,
    },
    rules: {
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    rulesTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 10,
    },
    ruleText: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 6,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Экзамен</Text>
          <Text style={styles.subtitle}>Режим проверки знаний</Text>
        </View>

        <View style={styles.content}>
          {selectedProfession && (
            <View style={styles.professionInfo}>
              <Text style={styles.professionName}>
                {selectedProfession.name}
              </Text>
              <Text style={styles.professionStats}>
                {selectedProfession.questionCount} вопросов доступно
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.startButton,
              (!selectedProfession || isLoading) && styles.disabledButton,
            ]}
            onPress={handleStartExam}
            disabled={!selectedProfession || isLoading}
            activeOpacity={0.8}
          >
            <Play size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>
              {isLoading ? "Загрузка..." : "Начать экзамен"}
            </Text>
          </TouchableOpacity>

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Особенности экзамена:</Text>

            <View style={styles.featureItem}>
              <Clock size={20} color={colors.danger} />
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Ограничение по времени</Text>
                <Text style={styles.featureDescription}>
                  20 минут на 10 вопросов
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <AlertCircle size={20} color={colors.warning} />
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Без подсказок</Text>
                <Text style={styles.featureDescription}>
                  Проверка реальных знаний
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Award size={20} color={colors.primary} />
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Сертификат</Text>
                <Text style={styles.featureDescription}>
                  Результат сохраняется в истории
                </Text>
              </View>
            </View>

            <View style={styles.rules}>
              <Text style={styles.rulesTitle}>Правила:</Text>
              <Text style={styles.ruleText}>• 10 случайных вопросов</Text>
              <Text style={styles.ruleText}>• Таймер 20 минут</Text>
              <Text style={styles.ruleText}>
                • Нет возможности исправить ответ
              </Text>
              <Text style={styles.ruleText}>• Минимальный балл: 70%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
