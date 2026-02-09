import { ThemeColors, useTheme } from "@/components/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Home } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrainingCompletionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    correctAnswers: string;
    totalQuestions: string;
    professionName: string;
  }>();

  const correctAnswers = parseInt(params.correctAnswers || "0");
  const totalQuestions = parseInt(params.totalQuestions || "0");
  const professionName = params.professionName || "";

  const percentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  const getPerformanceColor = () => {
    if (percentage >= 80) return colors.success; // Отлично
    if (percentage >= 60) return colors.tabTraining; // Хорошо
    if (percentage >= 40) return colors.warning; // Удовлетворительно
    return colors.danger; // Плохо
  };

  const getPerformanceText = () => {
    if (percentage >= 80) return "Отличный результат!";
    if (percentage >= 60) return "Хорошая работа!";
    if (percentage >= 40) return "Неплохо, есть куда расти!";
    return "Попробуйте еще раз!";
  };

  const handleGoHome = () => {
    router.replace({
      pathname: "/(tabs)",
    });
  };

  const styles = createStyles(colors, getPerformanceColor());

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Анимированный значок успеха */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <CheckCircle size={80} color={colors.success} strokeWidth={1.5} />
            </View>
            <View style={styles.iconGlow} />
          </View>

          <Text style={styles.heading}>Тренировка завершена!</Text>
          <Text style={styles.performanceText}>{getPerformanceText()}</Text>

          <View style={styles.professionCard}>
            <Text style={styles.professionName}>{professionName}</Text>
          </View>

          {/* Основная статистика */}
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{correctAnswers}</Text>
                <Text style={styles.statLabel}>Правильных ответов</Text>
                <View
                  style={[
                    styles.statBar,
                    { width: `${Math.min(percentage, 100)}%` },
                  ]}
                />
              </View>

              <View style={styles.statDividerVertical} />

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalQuestions}</Text>
                <Text style={styles.statLabel}>Всего вопросов</Text>
              </View>
            </View>

            {/* Процентный результат с цветовым акцентом */}
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageLabel}>Ваш результат</Text>
              <View style={styles.percentageCircle}>
                <Text style={styles.percentageText}>{percentage}%</Text>
              </View>
              <View style={styles.percentageScale}>
                <View style={styles.scaleItem}>
                  <View
                    style={[
                      styles.scaleDot,
                      { backgroundColor: colors.danger },
                    ]}
                  />
                  <Text style={styles.scaleText}>0-39%</Text>
                </View>
                <View style={styles.scaleItem}>
                  <View
                    style={[
                      styles.scaleDot,
                      { backgroundColor: colors.warning },
                    ]}
                  />
                  <Text style={styles.scaleText}>40-59%</Text>
                </View>
                <View style={styles.scaleItem}>
                  <View
                    style={[
                      styles.scaleDot,
                      { backgroundColor: colors.tabTraining },
                    ]}
                  />
                  <Text style={styles.scaleText}>60-79%</Text>
                </View>
                <View style={styles.scaleItem}>
                  <View
                    style={[
                      styles.scaleDot,
                      { backgroundColor: colors.success },
                    ]}
                  />
                  <Text style={styles.scaleText}>80-100%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Дополнительная информация */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Советы для улучшения:</Text>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>
                Повторите сложные вопросы в разделе "Тренировка"
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>
                Пройдите экзамен для проверки знаний без подсказок
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>
                Следите за прогрессом в разделе "Статистика"
              </Text>
            </View>
          </View>

          {/* Кнопка действий */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleGoHome}
            activeOpacity={0.7}
          >
            <Home size={22} color={colors.card} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>На главный экран</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, performanceColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    iconContainer: {
      position: "relative",
      marginBottom: 24,
    },
    iconBackground: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    iconGlow: {
      position: "absolute",
      top: -10,
      left: -10,
      right: -10,
      bottom: -10,
      borderRadius: 80,
      backgroundColor: colors.success,
      opacity: 0.1,
    },
    heading: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
      letterSpacing: 0.5,
    },
    performanceText: {
      fontSize: 18,
      color: performanceColor,
      marginBottom: 24,
      textAlign: "center",
      fontWeight: "600",
    },
    professionCard: {
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    professionName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
      textAlign: "center",
    },
    statsContainer: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statNumber: {
      fontSize: 36,
      fontWeight: "800",
      color: colors.primary,
      marginBottom: 8,
    },
    statLabel: {
      fontSize: 13,
      color: colors.muted,
      textAlign: "center",
    },
    statBar: {
      height: 4,
      backgroundColor: performanceColor,
      borderRadius: 2,
      marginTop: 8,
      width: "80%",
    },
    statDividerVertical: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    percentageContainer: {
      alignItems: "center",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    percentageLabel: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 16,
    },
    percentageCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: performanceColor,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      shadowColor: performanceColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    percentageText: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.card,
    },
    percentageScale: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 8,
    },
    scaleItem: {
      alignItems: "center",
      flex: 1,
    },
    scaleDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginBottom: 4,
    },
    scaleText: {
      fontSize: 10,
      color: colors.muted,
    },
    tipsContainer: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tipsTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    tipItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    tipDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      marginTop: 8,
      marginRight: 12,
    },
    tipText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    button: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 18,
      borderRadius: 14,
      minWidth: 240,
      marginBottom: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    buttonIcon: {
      marginRight: 12,
    },
    buttonText: {
      color: colors.card,
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    secondaryButton: {
      paddingVertical: 14,
      paddingHorizontal: 24,
    },
    secondaryButtonText: {
      color: colors.muted,
      fontSize: 15,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
  });
