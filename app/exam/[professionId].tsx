import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotImplementedScreen from "../../components/NotImplementedScreen";
import { getProfessionById } from "../data/professions";
import {
  getQuestionsByProfessionId,
  hasQuestionsForProfession,
} from "../data/questions";
import type { IQuestion } from "../types/questions";

// Компоненты
import { useTheme } from "@/components/ThemeProvider";
import ExamHeader from "../../components/Exam/ExamHeader";
import QuestionCard from "../../components/QuestionCard";
import type { IProfession } from "../types/profession";

const EXAM_QUESTIONS_COUNT = 10;
const EXAM_DURATION = 10 * 60; // 10 минут в секундах

// Специальные значения для ответов
const ANSWER_TYPES = {
  SKIPPED: "SKIPPED", // Пользователь пропустил (сам завершил)
  TIMEOUT: "TIMEOUT", // Время вышло
  ANSWERED: "ANSWERED", // Обычный ответ
} as const;

export default function ExamSessionScreen() {
  const router = useRouter();
  const { professionId } = useLocalSearchParams<{ professionId: string }>();
  const { colors, isDark } = useTheme();

  // Состояния
  const [profession, setProfession] = useState<IProfession | null>(null);
  const [allQuestions, setAllQuestions] = useState<IQuestion[]>([]);
  const [examQuestions, setExamQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(EXAM_DURATION);
  const [isFinishing, setIsFinishing] = useState(false);

  // Рефы
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const examStartTimeRef = useRef<number>(Date.now());
  const isExamFinishedRef = useRef<boolean>(false);

  const showCorrectAnswers = professionId === "38" || professionId === "78";

  // Таймер экзамена
  useEffect(() => {
    if (timerActive && !isExamFinishedRef.current) {
      timerIntervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timerActive]);

  // Загрузка данных
  useEffect(() => {
    const initializeExam = async () => {
      if (!professionId) {
        router.back();
        return;
      }

      setIsLoading(true);
      const id = parseInt(professionId);
      const prof = getProfessionById(id) as IProfession;
      setProfession(prof);

      if (!hasQuestionsForProfession(id)) {
        setIsLoading(false);
        return;
      }

      const loadedQuestions = getQuestionsByProfessionId(id);
      setAllQuestions(loadedQuestions);

      if (loadedQuestions.length >= EXAM_QUESTIONS_COUNT) {
        startExam(loadedQuestions);
      } else {
        router.back();
      }
    };

    initializeExam();
  }, [professionId]);

  // Запуск экзамена
  const startExam = (questions: IQuestion[]) => {
    const shuffled = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, EXAM_QUESTIONS_COUNT);

    setExamQuestions(shuffled);
    setTimerActive(true);
    setRemainingTime(EXAM_DURATION);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsLoading(false);
    isExamFinishedRef.current = false;
    examStartTimeRef.current = Date.now();
  };

  // Время вышло
  const handleTimeUp = () => {
    if (isExamFinishedRef.current) return;
    isExamFinishedRef.current = true;

    setTimerActive(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const spentTime = EXAM_DURATION - remainingTime;
    finishExam(spentTime, ANSWER_TYPES.TIMEOUT);
  };

  // Навигация назад
  const handleBack = () => {
    router.back();
  };

  // Выбор ответа
  const handleAnswerSelect = (questionIndex: number, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerId,
    }));
  };

  // Завершение экзамена (кнопка "Завершить")
  const handleFinishExam = () => {
    if (isExamFinishedRef.current || isFinishing || examQuestions.length === 0) {
      return;
    }

    setIsFinishing(true);
    isExamFinishedRef.current = true;

    setTimerActive(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const spentTime = EXAM_DURATION - remainingTime;
    finishExam(spentTime, ANSWER_TYPES.SKIPPED);
  };

  // Функция завершения экзамена
  const finishExam = (spentTime: number, completionType: string) => {
    if (examQuestions.length === 0) return;

    // Подготавливаем финальные ответы
    const finalAnswers = prepareFinalAnswers(selectedAnswers, completionType);

    // Рассчитываем результаты
    const results = calculateResults(examQuestions, finalAnswers);

    // Навигация на результаты
    navigateToResults(results, finalAnswers, spentTime, completionType);
  };

  // Подготовка финальных ответов
  const prepareFinalAnswers = (
    answers: Record<number, string>,
    completionType: string
  ): Record<number, string> => {
    const finalAnswers = { ...answers };

    examQuestions.forEach((_, index) => {
      if (!finalAnswers[index]) {
        // Если ответ отсутствует, помечаем почему
        if (completionType === ANSWER_TYPES.TIMEOUT) {
          finalAnswers[index] = ANSWER_TYPES.TIMEOUT; // "Не успел"
        } else {
          finalAnswers[index] = ANSWER_TYPES.SKIPPED; // "Пропустил"
        }
      }
    });

    return finalAnswers;
  };

  // Расчет результатов (чистая функция)
  const calculateResults = (
    questions: IQuestion[],
    answers: Record<number, string>
  ) => {
    let correctCount = 0;

    questions.forEach((question, index) => {
      const userAnswer = answers[index];

      // Считаем только если ответ есть и это не спец. значение
      if (userAnswer &&
        userAnswer !== ANSWER_TYPES.SKIPPED &&
        userAnswer !== ANSWER_TYPES.TIMEOUT) {
        if (userAnswer === question.correctAnswer) {
          correctCount++;
        }
      }
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70;

    return { correctCount, totalQuestions, score, passed };
  };

  // Навигация на экран результатов
  const navigateToResults = (
    results: ReturnType<typeof calculateResults>,
    finalAnswers: Record<number, string>,
    spentTime: number,
    completionType: string
  ) => {
    const params = {
      correctAnswers: results.correctCount.toString(),
      totalQuestions: results.totalQuestions.toString(),
      professionName: profession?.name || "",
      professionId: professionId || "",
      score: results.score.toString(),
      passed: results.passed.toString(),
      timeSpent: spentTime.toString(),
      questionsData: JSON.stringify(examQuestions),
      answersData: JSON.stringify(finalAnswers),
      completionType: completionType, // Добавляем тип завершения
    };

    router.replace({
      pathname: "/exam/results",
      params,
    });
  };

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Если вопросы в разработке
  if (!isLoading && allQuestions.length === 0) {
    return <NotImplementedScreen />;
  }

  if (isLoading || !profession) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Загрузка...</Text>
      </View>
    );
  }

  // Основной экран экзамена
  const currentQuestion = examQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;
  const isAnswered = !!selectedAnswers[currentQuestionIndex];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ExamHeader
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={examQuestions.length}
        remainingTime={remainingTime}
        onBack={handleBack}
        timerActive={timerActive}
        onTimeUp={handleTimeUp}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswers[currentQuestionIndex]}
          onAnswerSelect={(answerId) =>
            handleAnswerSelect(currentQuestionIndex, answerId)
          }
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={examQuestions.length}
          showCorrectAnswers={showCorrectAnswers}
        />
      </ScrollView>

      {/* Фиксированная кнопка навигации */}
      <View style={styles.navigationContainer}>
        <View
          style={[
            styles.navigationContent,
            { backgroundColor: colors.background },
          ]}
        >
          {isLastQuestion ? (
            <TouchableOpacity
              style={[
                styles.finishButton,
                { backgroundColor: colors.danger },
                !isAnswered && styles.disabledButton,
                isFinishing && styles.processingButton,
              ]}
              onPress={handleFinishExam}
              disabled={!isAnswered || isFinishing}
            >
              {isFinishing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.finishButtonText}>Завершить экзамен</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: colors.danger },
                !isAnswered && styles.disabledButton,
              ]}
              onPress={handleNextQuestion}
              disabled={!isAnswered}
            >
              <Text style={styles.nextButtonText}>Следующий вопрос</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  navigationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navigationContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  nextButton: {
    borderRadius: 12,
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  processingButton: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  finishButton: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});