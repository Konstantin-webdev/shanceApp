// app/exam/[professionId].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
import ExamHeader from "../../components/ExamHeader";
import QuestionCard from "../../components/QuestionCard";

const EXAM_QUESTIONS_COUNT = 10;

export default function ExamSessionScreen() {
  const router = useRouter();
  const { professionId } = useLocalSearchParams<{ professionId: string }>();

  const [profession, setProfession] = useState<any>(null);
  const [allQuestions, setAllQuestions] = useState<IQuestion[]>([]);
  const [examQuestions, setExamQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number | null>(null);

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, [professionId]);

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

  // Запуск экзамена
  const startExam = () => {
    if (allQuestions.length < EXAM_QUESTIONS_COUNT) {
      Alert.alert(
        "Недостаточно вопросов",
        `Для экзамена нужно минимум ${EXAM_QUESTIONS_COUNT} вопросов, доступно ${allQuestions.length}`,
        [{ text: "OK" }]
      );
      return;
    }

    // Выбираем случайные вопросы
    const shuffled = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, EXAM_QUESTIONS_COUNT);

    setExamQuestions(shuffled);
    setExamStarted(true);
    setTimerActive(true);
    setTimeSpent(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  // Колбэк когда время истекло (10 минут)
  const handleTimeUp = useCallback(() => {
    setTimerActive(false);

    // Помечаем все неотвеченные вопросы как "не отвечено"
    const finalAnswers = { ...selectedAnswers };
    examQuestions.forEach((_, index) => {
      if (!finalAnswers[index]) {
        finalAnswers[index] = ""; // Пустая строка = не отвечен
      }
    });

    // Переходим к результатам
    showExamResults(finalAnswers);
  }, [examQuestions, selectedAnswers]);

  // Колбэк когда работник сам завершил экзамен
  const handleExamComplete = useCallback(
    (spentTime: number) => {
      setTimeSpent(spentTime);
      setTimerActive(false);

      // Показываем результаты с потраченным временем
      showExamResults(selectedAnswers, spentTime);
    },
    [selectedAnswers]
  );

  // Навигация назад
  const handleBack = () => {
    if (examStarted && timerActive) {
      Alert.alert("Выйти из экзамена?", "Весь прогресс будет потерян", [
        { text: "Отмена", style: "cancel" },
        {
          text: "Выйти",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]);
    } else {
      router.back();
    }
  };

  // Выбор ответа
  const handleAnswerSelect = (questionIndex: number, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerId,
    }));
  };

  // Показ результатов
  const showExamResults = useCallback(
    (finalAnswers: Record<number, string>, spentTime?: number) => {
      if (!examQuestions.length) return;

      const correctAnswers = examQuestions.reduce((count, question, index) => {
        const userAnswer = finalAnswers[index];
        return userAnswer === question.correctAnswer ? count + 1 : count;
      }, 0);

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
          timeSpent: spentTime ? spentTime.toString() : "600", // Если время вышло - 10 минут
          questionsData: JSON.stringify(examQuestions),
          answersData: JSON.stringify(finalAnswers),
        },
      });
    },
    [examQuestions, profession, professionId, router]
  );

  // Проверка, отвечен ли текущий вопрос
  const isCurrentQuestionAnswered = () => {
    return !!selectedAnswers[currentQuestionIndex];
  };

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (!isCurrentQuestionAnswered()) {
      Alert.alert(
        "Выберите ответ",
        "Пожалуйста, выберите вариант ответа на текущий вопрос перед переходом к следующему.",
        [{ text: "Хорошо" }]
      );
      return;
    }

    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Завершение экзамена (кнопка "Завершить")
  const handleFinishExam = () => {
    if (examQuestions.length === 0) return;

    // Проверяем, ответил ли на последний вопрос
    if (!isCurrentQuestionAnswered()) {
      Alert.alert(
        "Выберите ответ",
        "Пожалуйста, выберите вариант ответа на текущий вопрос перед завершением экзамена.",
        [{ text: "Хорошо" }]
      );
      return;
    }

    const unansweredCount = examQuestions.reduce((count, _, index) => {
      return !selectedAnswers[index] ? count + 1 : count;
    }, 0);

    let message = "Вы уверены, что хотите завершить экзамен?";
    if (unansweredCount > 0) {
      message = `У вас осталось ${unansweredCount} неотвеченных вопросов. Завершить экзамен?`;
    }

    Alert.alert("Завершить экзамен?", message, [
      { text: "Отмена", style: "cancel" },
      {
        text: "Завершить",
        onPress: () => {
          setTimerActive(false);
        },
      },
    ]);
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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <ExamHeader
          professionName={profession.name}
          onBack={() => router.back()}
          timerActive={false}
          onTimeUp={() => {}}
          onExamComplete={() => {}}
        />

        <View style={styles.examIntro}>
          <Text style={styles.examTitle}>Экзамен по профессии:</Text>
          <Text style={styles.professionName}>{profession.name}</Text>

          <View style={styles.examRules}>
            <Text style={styles.rulesTitle}>Правила экзамена:</Text>
            <Text style={styles.rule}>
              • {EXAM_QUESTIONS_COUNT} случайных вопросов
            </Text>
            <Text style={styles.rule}>• Время: 10 минут</Text>
            <Text style={styles.rule}>• Минимальный балл: 70%</Text>
            <Text style={styles.rule}>• Можно менять ответы</Text>
            <Text style={styles.rule}>
              • Обязательно отвечать на каждый вопрос
            </Text>
          </View>

          <TouchableOpacity style={styles.startExamButton} onPress={startExam}>
            <Text style={styles.startExamButtonText}>Начать экзамен</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Основной экран экзамена
  const currentQuestion = examQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;
  const isAnswered = isCurrentQuestionAnswered();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ExamHeader
        professionName={profession.name}
        onBack={handleBack}
        timerActive={timerActive}
        onTimeUp={handleTimeUp}
        onExamComplete={handleExamComplete}
      />

      {/* Вертикальный скролл для вопроса */}
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
        />

        {/* Кнопка навигации внутри ScrollView */}
        <View style={styles.navigationContainer}>
          {isLastQuestion ? (
            <TouchableOpacity
              style={[
                styles.finishButton,
                !isAnswered && styles.disabledButton,
              ]}
              onPress={handleFinishExam}
              disabled={!isAnswered}
            >
              <Text style={styles.finishButtonText}>Завершить экзамен</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, !isAnswered && styles.disabledButton]}
              onPress={handleNextQuestion}
              disabled={!isAnswered}
            >
              <Text style={styles.nextButtonText}>Следующий вопрос</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.pageIndicator}>
            Вопрос {currentQuestionIndex + 1} из {examQuestions.length}
          </Text>

          {!isAnswered && (
            <Text style={styles.hintText}>Выберите ответ для продолжения</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  examIntro: {
    flex: 1,
    padding: 24,
  },
  examTitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 8,
    textAlign: "center",
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
    marginBottom: 6,
  },
  startExamButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  startExamButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  navigationContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#C7C7CC",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  finishButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  pageIndicator: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
    fontStyle: "italic",
  },
});
