import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import ExamHeader from "../../components/ExamHeader";
import QuestionCard from "../../components/QuestionCard";
import type { IProfession } from "../types/profession";

const EXAM_QUESTIONS_COUNT = 10;
const EXAM_DURATION = 10 * 60; // 10 минут в секундах

export default function ExamSessionScreen() {
  const router = useRouter();
  const { professionId } = useLocalSearchParams<{ professionId: string }>();
  const { colors, isDark } = useTheme();
  const [profession, setProfession] = useState<IProfession | null>(null);
  const [allQuestions, setAllQuestions] = useState<IQuestion[]>([]);
  const [examQuestions, setExamQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(EXAM_DURATION); // <-- ДОБАВЛЕНО
  const [timeSpent, setTimeSpent] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // <-- ДОБАВЛЕНО
  const showCorrectAnswers = professionId === "38" || professionId === "78";

  // Таймер экзамена
  useEffect(() => {
    if (timerActive) {
      // Очищаем предыдущий интервал на всякий случай
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      timerIntervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // Время вышло
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Останавливаем таймер
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timerActive]);

  // Загрузка данных и автоматический старт экзамена
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
  const startExam = (questions: IQuestion[] = allQuestions) => {
    const shuffled = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, EXAM_QUESTIONS_COUNT);

    setExamQuestions(shuffled);
    setTimerActive(true);
    setRemainingTime(EXAM_DURATION); // <-- СБРАСЫВАЕМ ТАЙМЕР
    setTimeSpent(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsLoading(false);
  };

  // Колбэк когда время истекло (10 минут)
  const handleTimeUp = useCallback(() => {
    const spentTime = EXAM_DURATION - remainingTime;
    setTimeSpent(spentTime);
    setTimerActive(false);
    finishExam(spentTime);
  }, [examQuestions, selectedAnswers, remainingTime]);

  // Колбэк когда работник сам завершил экзамен
  const handleExamComplete = useCallback(() => {
    const spentTime = EXAM_DURATION - remainingTime;
    setTimeSpent(spentTime);
    setTimerActive(false);
    finishExam(spentTime);
  }, [remainingTime]);

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

  // Оптимизированная функция показа результатов
  const showExamResults = useCallback(
    (finalAnswers: Record<number, string>, spentTime?: number) => {
      if (!examQuestions.length) return;

      // Быстрый расчет результатов
      const correctAnswers = examQuestions.reduce((count, question, index) => {
        const userAnswer = finalAnswers[index];
        return userAnswer === question.correctAnswer ? count + 1 : count;
      }, 0);

      const score = Math.round((correctAnswers / examQuestions.length) * 100);
      const passed = score >= 70;

      // Готовим данные для перехода
      const params = {
        correctAnswers: correctAnswers.toString(),
        totalQuestions: examQuestions.length.toString(),
        professionName: profession?.name || "",
        professionId: professionId || "",
        score: score.toString(),
        passed: passed.toString(),
        timeSpent: spentTime
          ? spentTime.toString()
          : (EXAM_DURATION - remainingTime).toString(),
        questionsData: JSON.stringify(examQuestions),
        answersData: JSON.stringify(finalAnswers),
      };

      setTimeout(() => {
        router.push({
          pathname: "/exam/results",
          params,
        });
      }, 50);
    },
    [examQuestions, profession, professionId, router, remainingTime],
  );

  // Функция завершения экзамена
  const finishExam = useCallback(
    (spentTime?: number) => {
      if (examQuestions.length === 0) return;

      setIsFinishing(true);

      // Быстрое завершение без проверки всех ответов
      const finalAnswers = { ...selectedAnswers };
      examQuestions.forEach((_, index) => {
        if (!finalAnswers[index]) {
          finalAnswers[index] = "";
        }
      });

      // Немедленный показ результатов
      showExamResults(finalAnswers, spentTime);
    },
    [examQuestions, selectedAnswers, showExamResults],
  );

  // Проверка, отвечен ли текущий вопрос
  const isCurrentQuestionAnswered = () => {
    return !!selectedAnswers[currentQuestionIndex];
  };

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Завершение экзамена (кнопка "Завершить")
  const handleFinishExam = () => {
    if (examQuestions.length === 0) return;

    if (!isCurrentQuestionAnswered()) {
      return;
    }

    setIsFinishing(true);
    handleExamComplete(); // <-- Используем существующий колбэк
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
  const isAnswered = isCurrentQuestionAnswered();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ExamHeader
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={examQuestions.length}
        remainingTime={remainingTime} // <-- ПЕРЕДАЕМ ВРЕМЯ
        onBack={handleBack}
        timerActive={timerActive}
        onTimeUp={handleTimeUp}
        onExamComplete={handleExamComplete}
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

      {/* Фиксированная кнопка навигации с учетом safe area */}
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
    marginBottom: 16,
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
