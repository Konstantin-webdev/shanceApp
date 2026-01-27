// app/exam/results.tsx
import { useTheme } from "@/components/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Award,
  CheckCircle,
  Clock,
  Home,
  RotateCcw,
  XCircle,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { saveExamResult } from "../data/examResults";

interface QuestionData {
  id: string;
  text: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  professionId: number;
}

export default function ExamResultsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams<{
    correctAnswers: string;
    totalQuestions: string;
    professionName: string;
    professionId: string;
    score: string;
    passed: string;
    timeSpent?: string;
    questionsData?: string;
    answersData?: string;
    saved?: string;
  }>();

  const correctAnswers = parseInt(params.correctAnswers || "0");
  const totalQuestions = parseInt(params.totalQuestions || "0");
  const professionName = params.professionName || "";
  const professionId = params.professionId || "";
  const score = parseInt(params.score || "0");
  const passed = params.passed === "true";
  const timeSpent = parseInt(params.timeSpent || "0");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const questionsData: QuestionData[] = params.questionsData
    ? JSON.parse(params.questionsData)
    : [];
  const answersData: Record<number, string> = params.answersData
    ? JSON.parse(params.answersData)
    : {};

  useEffect(() => {
    const saveResult = async () => {
      if (params.saved !== "true") {
        try {
          await saveExamResult({
            professionId: professionId,
            professionName: professionName,
            correctAnswers: correctAnswers,
            totalQuestions: totalQuestions,
            score: score,
            passed: passed,
            timeSpent: timeSpent,
          });
        } catch (error) {
          console.error("Ошибка при сохранении результата:", error);
        }
      }
    };

    saveResult();
  }, []);

  const handleGoHome = () => {
    router.push("/(tabs)/exam");
  };

  const handleRetry = () => {
    router.push({
      pathname: "/exam/[professionId]",
      params: { professionId },
    });
  };

  const handleViewStats = () => {
    router.push("/(tabs)/stats");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Иконка результата */}
          <View
            style={[
              styles.resultIconContainer,
              passed
                ? { backgroundColor: isDark ? "#1C3C1C" : "#F0FFF4" }
                : { backgroundColor: isDark ? "#3C1C1C" : "#FFF0F0" },
            ]}
          >
            {passed ? (
              <Award size={80} color={colors.success} />
            ) : (
              <XCircle size={80} color={colors.danger} />
            )}
          </View>

          {/* Заголовок */}
          <Text style={[styles.resultTitle, { color: colors.text }]}>
            {passed ? "Экзамен сдан!" : "Экзамен не сдан"}
          </Text>

          <Text style={[styles.professionName, { color: colors.muted }]}>
            {professionName}
          </Text>

          {/* Основная статистика */}
          <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreLabel, { color: colors.muted }]}>
                Ваш результат
              </Text>
              <Text
                style={[
                  styles.scoreValue,
                  passed ? { color: colors.success } : { color: colors.danger },
                ]}
              >
                {score}%
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <CheckCircle size={24} color={colors.success} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {correctAnswers}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Правильно
                </Text>
              </View>

              <View
                style={[styles.statDivider, { backgroundColor: colors.border }]}
              />

              <View style={styles.statItem}>
                <XCircle size={24} color={colors.danger} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {totalQuestions - correctAnswers}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Ошибок
                </Text>
              </View>

              <View
                style={[styles.statDivider, { backgroundColor: colors.border }]}
              />

              <View style={styles.statItem}>
                <Clock size={24} color={colors.primary} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {formatTime(timeSpent)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Время
                </Text>
              </View>
            </View>

            <View style={styles.passIndicator}>
              <View
                style={[styles.passBar, { backgroundColor: colors.border }]}
              >
                <View
                  style={[
                    styles.passProgress,
                    { width: `${Math.min(score, 100)}%` },
                    passed
                      ? { backgroundColor: colors.success }
                      : { backgroundColor: colors.danger },
                  ]}
                />
              </View>
              <View style={styles.passThreshold}>
                <View
                  style={[
                    styles.thresholdLine,
                    { backgroundColor: colors.primary },
                  ]}
                />
                <Text style={[styles.thresholdText, { color: colors.primary }]}>
                  70% - порог
                </Text>
              </View>
            </View>
          </View>

          {/* Детали по вопросам */}
          {questionsData.length > 0 && (
            <View style={styles.detailsCard}>
              <Text style={[styles.detailsTitle, { color: colors.text }]}>
                Детали по вопросам:
              </Text>

              <View style={styles.questionsList}>
                {questionsData.map((question, index) => {
                  const userAnswer = answersData[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  const correctOption = question.options.find(
                    (opt) => opt.id === question.correctAnswer,
                  );
                  const userOption = question.options.find(
                    (opt) => opt.id === userAnswer,
                  );

                  return (
                    <View
                      key={question.id}
                      style={[
                        styles.questionItem,
                        {
                          backgroundColor: isDark ? "#2C2C2E" : "#F8F9FA",
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <View style={styles.questionItemHeader}>
                        <Text
                          style={[
                            styles.questionItemNumber,
                            { color: colors.primary },
                          ]}
                        >
                          Вопрос {index + 1}
                        </Text>
                        <View
                          style={[
                            styles.questionItemStatus,
                            isCorrect
                              ? { backgroundColor: colors.success + "20" }
                              : { backgroundColor: colors.danger + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.questionItemStatusText,
                              isCorrect
                                ? { color: colors.success }
                                : { color: colors.danger },
                            ]}
                          >
                            {isCorrect ? "✓" : "✗"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.questionContent}>
                        <Text
                          style={[styles.questionText, { color: colors.text }]}
                        >
                          {question.text}
                        </Text>
                      </View>

                      <View style={styles.answersContainer}>
                        <View style={styles.answerRow}>
                          <Text
                            style={[
                              styles.answerLabel,
                              { color: colors.muted },
                            ]}
                          >
                            Ваш ответ:
                          </Text>
                          <View style={styles.answerTextContainer}>
                            <Text
                              style={[
                                styles.answerText,
                                isCorrect
                                  ? { color: colors.success }
                                  : { color: colors.danger },
                              ]}
                            >
                              {userOption?.text || "Не ответил"}
                            </Text>
                          </View>
                        </View>

                        {!isCorrect && correctOption && (
                          <View style={styles.answerRow}>
                            <Text
                              style={[
                                styles.answerLabel,
                                { color: colors.muted },
                              ]}
                            >
                              Правильный:
                            </Text>
                            <View style={styles.answerTextContainer}>
                              <Text
                                style={[
                                  styles.correctAnswerText,
                                  { color: colors.success },
                                ]}
                              >
                                {correctOption.text}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Кнопки действий */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.statsButton,
                { borderColor: colors.success },
              ]}
              onPress={handleViewStats}
            >
              <Award size={20} color={colors.success} />
              <Text
                style={[styles.actionButtonText, { color: colors.success }]}
              >
                Статистика
              </Text>
            </TouchableOpacity>

            {!passed && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.retryButton,
                  { backgroundColor: colors.warning },
                ]}
                onPress={handleRetry}
              >
                <RotateCcw size={20} color="#FFFFFF" />
                <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
                  Снова
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.homeButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleGoHome}
            >
              <Home size={20} color="#FFFFFF" />
              <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
                На главную
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  resultIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  professionName: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "700",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
  },
  passIndicator: {
    marginTop: 16,
  },
  passBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  passProgress: {
    height: "100%",
    borderRadius: 3,
  },
  passThreshold: {
    marginTop: 8,
    position: "relative",
    height: 16,
  },
  thresholdLine: {
    position: "absolute",
    left: "70%",
    top: 0,
    bottom: 0,
    width: 2,
  },
  thresholdText: {
    position: "absolute",
    left: "70%",
    top: 20,
    fontSize: 10,
    transform: [{ translateX: -20 }],
  },
  detailsCard: {
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  questionsList: {
    gap: 12,
  },
  questionItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  questionItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionItemNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  questionItemStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  questionItemStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  questionContent: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  answersContainer: {
    gap: 8,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  answerLabel: {
    fontSize: 12,
    minWidth: 80,
    marginTop: 2,
  },
  answerTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  answerText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    flexWrap: "wrap",
  },
  correctAnswerText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    flexWrap: "wrap",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    minWidth: 120,
  },
  statsButton: {
    borderWidth: 1,
  },
  retryButton: {
    borderWidth: 0,
  },
  homeButton: {
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
