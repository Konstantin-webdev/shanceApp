// app/exam/[professionId].tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { getProfessionById } from "../data/professions";
import {
  getQuestionsByProfessionId,
  hasQuestionsForProfession,
} from "../data/questions";
import NotImplementedScreen from "../../components/NotImplementedScreen";
import ExamTimer from "../../components/ExamTimer";
import type { IQuestion } from "../types/questions";

const { width } = Dimensions.get("window");
const EXAM_TIME = 20 * 60; // 20 минут в секундах
const EXAM_QUESTIONS_COUNT = 10;

export default function ExamSessionScreen() {
  const router = useRouter();
  const { professionId } = useLocalSearchParams<{ professionId: string }>();

  const scrollViewRef = React.useRef<ScrollView>(null);
  const [profession, setProfession] = useState<any>(null);
  const [allQuestions, setAllQuestions] = useState<IQuestion[]>([]);
  const [examQuestions, setExamQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);

  // Добавляем состояние для отображения результатов во время экзамена
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadData();
  }, [professionId]);

  useEffect(() => {
    if (scrollViewRef.current && examQuestions.length > 0 && !showResults) {
      scrollViewRef.current.scrollTo({
        x: currentQuestionIndex * width,
        animated: true,
      });
    }
  }, [currentQuestionIndex, examQuestions.length, showResults]);

  const loadData = async () => {
    if (!professionId) {
      router.back();
      return;
    }

    setIsLoading(true);

    const id = parseInt(professionId);
    const prof = getProfessionById(id);
    setProfession(prof);

    if (!hasQuestionsForProfession(id)) {
      setIsLoading(false);
      return;
    }

    const loadedQuestions = getQuestionsByProfessionId(id);
    setAllQuestions(loadedQuestions);
    setIsLoading(false);
  };

  const startExam = () => {
    if (allQuestions.length < EXAM_QUESTIONS_COUNT) {
      Alert.alert(
        "Недостаточно вопросов",
        `Для экзамена нужно минимум ${EXAM_QUESTIONS_COUNT} вопросов, доступно ${allQuestions.length}`,
        [{ text: "OK" }]
      );
      return;
    }

    const shuffled = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, EXAM_QUESTIONS_COUNT);

    setExamQuestions(shuffled);
    setExamStarted(true);
  };

  const handleTimeUp = () => {
    Alert.alert("Время вышло!", "Экзамен автоматически завершен", [
      {
        text: "Посмотреть результаты",
        onPress: showExamResults,
      },
    ]);
  };

  const handleScrollEnd = useCallback(
    (event: any) => {
      if (showResults) return;

      const page = Math.round(event.nativeEvent.contentOffset.x / width);
      if (page !== currentQuestionIndex) {
        setCurrentQuestionIndex(page);
      }
    },
    [currentQuestionIndex, showResults]
  );

  const handleAnswerSelect = useCallback(
    (questionIndex: number, answerId: string) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: answerId,
      }));
    },
    []
  );

  // Функция для показа результатов
  const showExamResults = () => {
    setShowResults(true);
  };

  const finishExam = () => {
    const correctAnswers = calculateCorrectAnswers();
    const score = Math.round((correctAnswers / examQuestions.length) * 100);
    const passed = score >= 70;

    router.push({
      pathname: "/exam/results",
      params: {
        correctAnswers: correctAnswers.toString(),
        totalQuestions: examQuestions.length.toString(),
        professionName: profession?.name || "",
        professionId: professionId || "",
        score: score.toString(),
        passed: passed.toString(),
        // Добавляем данные для отображения деталей
        questionsData: JSON.stringify(examQuestions),
        answersData: JSON.stringify(selectedAnswers),
      },
    });
  };

  const calculateCorrectAnswers = () => {
    return examQuestions.reduce((count, question, index) => {
      const userAnswer = selectedAnswers[index];
      return userAnswer === question.correctAnswer ? count + 1 : count;
    }, 0);
  };

  // Если вопросы в разработке
  if (!isLoading && allQuestions.length === 0) {
    return <NotImplementedScreen />;
  }

  if (isLoading || !profession) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  // Экран начала экзамена
  if (!examStarted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#FF3B30" />
          </TouchableOpacity>
          <Text style={styles.title}>Подготовка к экзамену</Text>
        </View>

        <View style={styles.examIntro}>
          <Text style={styles.examTitle}>Экзамен по профессии:</Text>
          <Text style={styles.professionName}>{profession.name}</Text>

          <View style={styles.examRules}>
            <Text style={styles.rulesTitle}>Правила экзамена:</Text>
            <Text style={styles.rule}>
              • {EXAM_QUESTIONS_COUNT} случайных вопросов
            </Text>
            <Text style={styles.rule}>• Время: 20 минут</Text>
            <Text style={styles.rule}>• Можно менять ответы</Text>
            <Text style={styles.rule}>• Минимальный проходной балл: 70%</Text>
          </View>

          <TouchableOpacity style={styles.startExamButton} onPress={startExam}>
            <Text style={styles.startExamButtonText}>Начать экзамен</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Если показываем результаты (после завершения)
  if (showResults) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setShowResults(false)}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#FF3B30" />
          </TouchableOpacity>
          <Text style={styles.title}>Результаты экзамена</Text>
        </View>

        <ScrollView style={styles.resultsContainer}>
          {examQuestions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const correctAnswer = question.options.find(
              (opt) => opt.id === question.correctAnswer
            );

            return (
              <View key={question.id} style={styles.resultCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>
                    Вопрос {index + 1} из {examQuestions.length}
                  </Text>
                  <View
                    style={[
                      styles.resultBadge,
                      isCorrect ? styles.correctBadge : styles.incorrectBadge,
                    ]}
                  >
                    <Text style={styles.resultBadgeText}>
                      {isCorrect ? "✓ Верно" : "✗ Ошибка"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.questionText}>{question.text}</Text>

                <View style={styles.answerSection}>
                  <Text style={styles.answerLabel}>Ваш ответ:</Text>
                  {userAnswer ? (
                    <View
                      style={[
                        styles.userAnswer,
                        isCorrect
                          ? styles.correctAnswer
                          : styles.incorrectAnswer,
                      ]}
                    >
                      <Text style={styles.answerText}>
                        {
                          question.options.find((opt) => opt.id === userAnswer)
                            ?.text
                        }
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.noAnswer}>
                      Вы не ответили на этот вопрос
                    </Text>
                  )}
                </View>

                {!isCorrect && correctAnswer && (
                  <View style={styles.correctAnswerSection}>
                    <Text style={styles.correctAnswerLabel}>
                      Правильный ответ:
                    </Text>
                    <View style={styles.correctAnswerBox}>
                      <Text style={styles.correctAnswerText}>
                        {correctAnswer.text}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.resultsActions}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={finishExam}
            >
              <Text style={styles.continueButtonText}>
                Завершить и перейти к итогам
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Основной экран экзамена
  const currentQuestion = examQuestions[currentQuestionIndex];
  const userAnswer = selectedAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;
  const progress = (currentQuestionIndex + 1) / examQuestions.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Шапка с таймером */}
      <View style={styles.examHeader}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Выйти из экзамена?", "Все ответы будут потеряны", [
              { text: "Отмена", style: "cancel" },
              {
                text: "Выйти",
                style: "destructive",
                onPress: () => router.back(),
              },
            ]);
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FF3B30" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.professionName} numberOfLines={1}>
            {profession.name}
          </Text>
          <Text style={styles.progressText}>
            Вопрос {currentQuestionIndex + 1} из {examQuestions.length}
          </Text>
        </View>
      </View>

      {/* Таймер */}
      <View style={styles.timerContainer}>
        <ExamTimer initialTime={EXAM_TIME} onTimeUp={handleTimeUp} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>

      {/* Горизонтальный ScrollView для вопросов */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.horizontalScrollView}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        {examQuestions.map((question, index) => {
          const userAnswerForQuestion = selectedAnswers[index];

          return (
            <View key={question.id} style={styles.questionPage}>
              <ScrollView
                style={styles.verticalScrollView}
                contentContainerStyle={styles.verticalScrollContent}
                showsVerticalScrollIndicator={true}
              >
                {/* Вопрос */}
                <View style={styles.questionCard}>
                  <Text style={styles.questionText}>{question.text}</Text>
                </View>

                {/* Варианты ответов */}
                <View style={styles.optionsContainer}>
                  {question.options.map((option) => {
                    const isSelected = userAnswerForQuestion === option.id;

                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.optionButton,
                          isSelected && styles.selectedOption,
                        ]}
                        onPress={() => handleAnswerSelect(index, option.id)}
                      >
                        <View style={styles.optionContent}>
                          <View
                            style={[
                              styles.optionIndicator,
                              isSelected && styles.selectedOptionIndicator,
                            ]}
                          >
                            <Text
                              style={[
                                styles.optionLetter,
                                isSelected && styles.selectedOptionLetter,
                              ]}
                            >
                              {option.id.toUpperCase()}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.optionText,
                              isSelected && styles.selectedOptionText,
                            ]}
                          >
                            {option.text}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Подсказка */}
                <View style={styles.hintContainer}>
                  <Text style={styles.hintText}>
                    {userAnswerForQuestion
                      ? "Вы можете изменить ответ"
                      : "Выберите ответ"}
                  </Text>
                </View>
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      {/* Панель навигации */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.disabledNavButton,
          ]}
          onPress={() =>
            setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
          }
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Назад</Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={showExamResults}
          >
            <Text style={styles.finishButtonText}>Завершить экзамен</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setCurrentQuestionIndex((prev) => prev + 1)}
          >
            <Text style={styles.nextButtonText}>Далее</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginLeft: 16,
  },
  examIntro: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  examTitle: {
    fontSize: 18,
    color: "#8E8E93",
    marginBottom: 8,
  },
  professionName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 32,
    textAlign: "center",
  },
  examRules: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    width: "100%",
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  rule: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 8,
  },
  startExamButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  startExamButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 12,
  },
  cancelButtonText: {
    color: "#8E8E93",
    fontSize: 16,
  },
  examHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  timerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FF3B30",
    borderRadius: 2,
  },
  horizontalScrollView: {
    flex: 1,
  },
  horizontalScrollContent: {
    flexDirection: "row",
  },
  questionPage: {
    width: width,
  },
  verticalScrollView: {
    flex: 1,
  },
  verticalScrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1C1C1E",
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F7FF",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedOptionIndicator: {
    backgroundColor: "#007AFF",
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  selectedOptionLetter: {
    color: "#FFFFFF",
  },
  optionText: {
    fontSize: 16,
    color: "#1C1C1E",
    flex: 1,
  },
  selectedOptionText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  hintContainer: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  hintText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  disabledNavButton: {
    opacity: 0.5,
  },
  navButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  finishButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Стили для экрана результатов
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    color: "#8E8E93",
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  correctBadge: {
    backgroundColor: "#F0FFF4",
  },
  incorrectBadge: {
    backgroundColor: "#FFF0F0",
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  correctBadgeText: {
    color: "#34C759",
  },
  incorrectBadgeText: {
    color: "#FF3B30",
  },
  answerSection: {
    marginTop: 12,
  },
  answerLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  userAnswer: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  correctAnswer: {
    borderColor: "#34C759",
    backgroundColor: "#F0FFF4",
  },
  incorrectAnswer: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF0F0",
  },
  answerText: {
    fontSize: 16,
    color: "#1C1C1E",
  },
  noAnswer: {
    fontSize: 16,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  correctAnswerSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  correctAnswerLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  correctAnswerBox: {
    backgroundColor: "#F0FFF4",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#34C759",
  },
  correctAnswerText: {
    fontSize: 16,
    color: "#34C759",
    fontWeight: "500",
  },
  resultsActions: {
    marginTop: 24,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
