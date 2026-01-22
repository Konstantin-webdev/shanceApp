// app/exam/results.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle,
  XCircle,
  Home,
  Award,
  Share2,
  Clock,
  BookOpen,
  ChevronRight,
} from "lucide-react-native";

interface QuestionData {
  id: string;
  text: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  professionId: number;
}

export default function ExamResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    correctAnswers: string;
    totalQuestions: string;
    professionName: string;
    professionId: string;
    score: string;
    passed: string;
    questionsData?: string;
    answersData?: string;
  }>();

  const correctAnswers = parseInt(params.correctAnswers || "0");
  const totalQuestions = parseInt(params.totalQuestions || "0");
  const professionName = params.professionName || "";
  const professionId = params.professionId || "";
  const score = parseInt(params.score || "0");
  const passed = params.passed === "true";

  // Парсим данные вопросов и ответов
  const questionsData: QuestionData[] = params.questionsData
    ? JSON.parse(params.questionsData)
    : [];
  const answersData: Record<number, string> = params.answersData
    ? JSON.parse(params.answersData)
    : {};

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Я сдал экзамен по профессии "${professionName}" с результатом ${score}%!`,
      });
    } catch (error) {
      console.log("Ошибка при шаринге:", error);
    }
  };

  const handleGoHome = () => {
    router.push("/(tabs)/exam");
  };

  const handleRetry = () => {
    router.push({
      pathname: "/exam/[professionId]",
      params: { professionId },
    });
  };

  const handleViewDetails = (questionIndex: number) => {
    // Можно сделать модальное окно с деталями вопроса
    // Пока просто показываем скролл
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* Иконка результата */}
        <View
          style={[
            styles.resultIconContainer,
            passed ? styles.passedIcon : styles.failedIcon,
          ]}
        >
          {passed ? (
            <Award size={80} color="#34C759" />
          ) : (
            <XCircle size={80} color="#FF3B30" />
          )}
        </View>

        {/* Заголовок */}
        <Text style={styles.resultTitle}>
          {passed ? "Экзамен сдан!" : "Экзамен не сдан"}
        </Text>

        <Text style={styles.professionName}>{professionName}</Text>

        {/* Основная статистика */}
        <View style={styles.statsCard}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Ваш результат</Text>
            <Text
              style={[
                styles.scoreValue,
                passed ? styles.scorePassed : styles.scoreFailed,
              ]}
            >
              {score}%
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <CheckCircle size={24} color="#34C759" />
              <Text style={styles.statNumber}>{correctAnswers}</Text>
              <Text style={styles.statLabel}>Правильно</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <XCircle size={24} color="#FF3B30" />
              <Text style={styles.statNumber}>
                {totalQuestions - correctAnswers}
              </Text>
              <Text style={styles.statLabel}>Ошибок</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <BookOpen size={24} color="#007AFF" />
              <Text style={styles.statNumber}>{totalQuestions}</Text>
              <Text style={styles.statLabel}>Всего</Text>
            </View>
          </View>

          <View style={styles.passIndicator}>
            <View style={styles.passBar}>
              <View
                style={[
                  styles.passProgress,
                  { width: `${score}%` },
                  passed ? styles.passProgressSuccess : styles.passProgressFail,
                ]}
              />
            </View>
            <View style={styles.passThreshold}>
              <View style={styles.thresholdLine} />
              <Text style={styles.thresholdText}>70% - порог</Text>
            </View>
          </View>
        </View>

        {/* Детали по вопросам */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Детали по вопросам:</Text>

          <View style={styles.questionsList}>
            {questionsData.map((question, index) => {
              const userAnswer = answersData[index];
              const isCorrect = userAnswer === question.correctAnswer;
              const correctOption = question.options.find(
                (opt) => opt.id === question.correctAnswer
              );
              const userOption = question.options.find(
                (opt) => opt.id === userAnswer
              );

              return (
                <TouchableOpacity
                  key={question.id}
                  style={styles.questionItem}
                  onPress={() => handleViewDetails(index)}
                >
                  <View style={styles.questionItemHeader}>
                    <Text style={styles.questionItemNumber}>
                      Вопрос {index + 1}
                    </Text>
                    <View
                      style={[
                        styles.questionItemStatus,
                        isCorrect
                          ? styles.questionItemCorrect
                          : styles.questionItemIncorrect,
                      ]}
                    >
                      <Text style={styles.questionItemStatusText}>
                        {isCorrect ? "✓" : "✗"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.questionItemText} numberOfLines={2}>
                    {question.text}
                  </Text>

                  <View style={styles.questionItemAnswers}>
                    <View style={styles.answerRow}>
                      <Text style={styles.answerLabel}>Ваш ответ:</Text>
                      <Text
                        style={[
                          styles.answerValue,
                          isCorrect
                            ? styles.correctAnswerValue
                            : styles.incorrectAnswerValue,
                        ]}
                      >
                        {userOption?.text || "Не ответил"}
                      </Text>
                    </View>

                    {!isCorrect && correctOption && (
                      <View style={styles.answerRow}>
                        <Text style={styles.answerLabel}>Правильный:</Text>
                        <Text style={styles.correctAnswerValue}>
                          {correctOption.text}
                        </Text>
                      </View>
                    )}
                  </View>

                  <ChevronRight
                    size={16}
                    color="#8E8E93"
                    style={styles.chevronIcon}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Кнопки действий */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Поделиться</Text>
          </TouchableOpacity>

          {!passed && (
            <TouchableOpacity
              style={[styles.actionButton, styles.retryButton]}
              onPress={handleRetry}
            >
              <Clock size={20} color="#FFFFFF" />
              <Text style={[styles.actionButtonText, styles.retryButtonText]}>
                Попробовать снова
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.homeButton]}
            onPress={handleGoHome}
          >
            <Home size={20} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, styles.homeButtonText]}>
              На главную
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  resultIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  passedIcon: {
    backgroundColor: "#F0FFF4",
  },
  failedIcon: {
    backgroundColor: "#FFF0F0",
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 8,
  },
  professionName: {
    fontSize: 18,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 32,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: "700",
  },
  scorePassed: {
    color: "#34C759",
  },
  scoreFailed: {
    color: "#FF3B30",
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
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
  },
  passIndicator: {
    marginTop: 16,
  },
  passBar: {
    height: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 4,
    overflow: "hidden",
  },
  passProgress: {
    height: "100%",
    borderRadius: 4,
  },
  passProgressSuccess: {
    backgroundColor: "#34C759",
  },
  passProgressFail: {
    backgroundColor: "#FF3B30",
  },
  passThreshold: {
    marginTop: 8,
    position: "relative",
    height: 20,
  },
  thresholdLine: {
    position: "absolute",
    left: "70%",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#007AFF",
  },
  thresholdText: {
    position: "absolute",
    left: "70%",
    top: 24,
    fontSize: 12,
    color: "#007AFF",
    transform: [{ translateX: -25 }],
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  questionsList: {
    gap: 12,
  },
  questionItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    position: "relative",
  },
  questionItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  questionItemNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  questionItemStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  questionItemCorrect: {
    backgroundColor: "#F0FFF4",
  },
  questionItemIncorrect: {
    backgroundColor: "#FFF0F0",
  },
  questionItemStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  questionItemCorrectText: {
    color: "#34C759",
  },
  questionItemIncorrectText: {
    color: "#FF3B30",
  },
  questionItemText: {
    fontSize: 14,
    color: "#1C1C1E",
    marginBottom: 12,
    lineHeight: 20,
  },
  questionItemAnswers: {
    gap: 6,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  answerLabel: {
    fontSize: 12,
    color: "#8E8E93",
    width: 80,
  },
  answerValue: {
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  correctAnswerValue: {
    color: "#34C759",
  },
  incorrectAnswerValue: {
    color: "#FF3B30",
  },
  chevronIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -8,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  retryButton: {
    backgroundColor: "#FF9500",
    borderColor: "#FF9500",
  },
  retryButtonText: {
    color: "#FFFFFF",
  },
  homeButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  homeButtonText: {
    color: "#FFFFFF",
  },
});
