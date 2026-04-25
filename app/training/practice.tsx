import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTheme } from "@/components/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { hasQuestionsForProfession } from "@/components/data/questions";
import { getQuestionsByProfessionAndTopic } from "@/components/data/questionsByTopic";
import NotImplementedScreen from "@/components/NotImplementedScreen";
import QuestionItem from "@/components/QuestionItem";
import { ProgressTracker } from "@/components/Training/practice/ProgressTracker";
import { QuestionNavigation } from "@/components/Training/practice/QuestionNavigation";
import TrainingContinueModal from "@/components/Training/practice/TrainingContinueModal";
import { TrainingHeader } from "@/components/Training/practice/TrainingHeader";
import TrainingLoadingScreen from "@/components/Training/practice/TrainingLoadingScreen";
import { ErrorState } from "@/components/Training/topics/ErrorState";
import type { IQuestion } from "@/components/types/questions";
import {
  clearTopicProgress,
  getTopicProgress,
  saveTopicProgress,
} from "@/utils/progressStorage";

export default function PracticeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ topicKey: string }>();
  const { colors } = useTheme();
  const { selectedProfession } = useProfessionStore();

  // ─────────────────────────────────────────────────────────────
  // Состояния
  // ─────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showContinueModal, setShowContinueModal] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // Инициализация: загрузка вопросов + прогресса
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      if (!selectedProfession || !params.topicKey) {
        router.replace("/(tabs)");
        return;
      }

      if (!hasQuestionsForProfession(selectedProfession.id)) {
        setIsLoading(false);
        return;
      }

      const loadedQuestions = getQuestionsByProfessionAndTopic(
        selectedProfession.id,
        params.topicKey
      );
      setQuestions(loadedQuestions);

      // 🔹 Загружаем сохранённый прогресс для этой темы
      const total = loadedQuestions.length;
      const answered = await getTopicProgress(
        selectedProfession.id,
        params.topicKey,
        total
      );

      // Если есть прогресс — предлагаем продолжить с последнего вопроса
      // Индекс = answered - 1 (потому что 1 вопрос = индекс 0)
      if (answered > 0 && answered <= total) {
        setCurrentQuestionIndex(answered - 1);
        setTimeout(() => setShowContinueModal(true), 300);
      }

      setIsLoading(false);
    };
    init();
  }, [selectedProfession, params.topicKey, router]);

  // ─────────────────────────────────────────────────────────────
  // Автосохранение прогресса (debounce 500ms)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedProfession || !params.topicKey || isLoading) return;

    const timer = setTimeout(() => {
      // 🔹 Сохраняем: индекс + 1 = количество отвеченных вопросов
      const answeredCount = currentQuestionIndex + 1;
      saveTopicProgress(
        selectedProfession.id,
        params.topicKey,
        answeredCount
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [currentQuestionIndex, selectedProfession, params.topicKey, isLoading]);

  // ─────────────────────────────────────────────────────────────
  // Сохранение при сворачивании приложения
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedProfession || !params.topicKey) return;

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background" || state === "inactive") {
        const answeredCount = currentQuestionIndex + 1;
        saveTopicProgress(
          selectedProfession.id,
          params.topicKey,
          answeredCount
        );
      }
    });

    return () => subscription.remove();
  }, [selectedProfession, params.topicKey, currentQuestionIndex]);

  // ─────────────────────────────────────────────────────────────
  // Обработчики (useCallback для оптимизации)
  // ─────────────────────────────────────────────────────────────
  const handleContinue = useCallback(() => {
    setShowContinueModal(false);
  }, []);

  const handleRestart = useCallback(() => {
    if (!selectedProfession || !params.topicKey) return;
    clearTopicProgress(selectedProfession.id, params.topicKey);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowContinueModal(false);
  }, [selectedProfession, params.topicKey]);

  const handleAnswerSelect = useCallback((questionIndex: number, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerId,
    }));
  }, []);

  const handleNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev + 1);
  }, []);

  const handlePrevQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev - 1);
  }, []);

  const finishTraining = useCallback(() => {
    if (!selectedProfession || !params.topicKey) return;

    // Подсчёт правильных ответов
    const correctAnswers = questions.reduce((count, question, index) => {
      const userAnswer = selectedAnswers[index];
      return userAnswer === question.correctAnswer ? count + 1 : count;
    }, 0);

    // 🔹 Очищаем прогресс после успешного завершения
    clearTopicProgress(selectedProfession.id, params.topicKey);

    router.push({
      pathname: "/training/completion",
      params: {
        correctAnswers: correctAnswers.toString(),
        totalQuestions: questions.length.toString(),
        topicKey: params.topicKey, // можно использовать для статистики
      },
    });
  }, [selectedProfession, params.topicKey, questions, selectedAnswers, router]);

  // ─────────────────────────────────────────────────────────────
  // Рендер состояний загрузки / ошибок
  // ─────────────────────────────────────────────────────────────
  if (!selectedProfession) {
    return <ErrorState error="Профессия не выбрана" />;
  }

  if (isLoading) {
    return <TrainingLoadingScreen message="Загрузка вопросов..." />;
  }

  if (questions.length === 0) {
    return <NotImplementedScreen />;
  }

  // ─────────────────────────────────────────────────────────────
  // Основные данные для рендера
  // ─────────────────────────────────────────────────────────────
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = (currentQuestionIndex + 1) / questions.length;
  const hasAnswer = !!selectedAnswers[currentQuestionIndex];

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Модальное окно "Продолжить / Начать заново" */}
      <TrainingContinueModal
        visible={showContinueModal}
        onContinue={handleContinue}
        onRestart={handleRestart}
      />

      {/* Шапка с названием профессии и темы */}
      <TrainingHeader
        profession={selectedProfession}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />

      {/* Полоса прогресса */}
      <ProgressTracker progress={progress} />

      {/* Контент: вопрос + навигация */}
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {currentQuestion && (
            <QuestionItem
              question={currentQuestion}
              index={currentQuestionIndex}
              userAnswer={selectedAnswers[currentQuestionIndex]}
              onAnswerSelect={handleAnswerSelect}
              isCurrentQuestion={true}
            />
          )}
        </ScrollView>

        {/* Кнопки навигации */}
        <QuestionNavigation
          onPrev={handlePrevQuestion}
          onNext={handleNextQuestion}
          onFinish={finishTraining}
          showPrev={currentQuestionIndex > 0}
          showNext={!isLastQuestion}
          showFinish={isLastQuestion}
          isNextDisabled={!hasAnswer}
          isFinishDisabled={!hasAnswer}
        />
      </View>
    </SafeAreaView>
  );
}