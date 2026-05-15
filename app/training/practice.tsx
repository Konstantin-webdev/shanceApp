
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTheme } from "@/components/ThemeProvider";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
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

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showContinueModal, setShowContinueModal] = useState(false);

  // Инициализация вопросов и прогресса — ТОЛЬКО когда экран в фокусе
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const init = async () => {
        if (!selectedProfession || !params.topicKey) {
          router.replace("/(tabs)");
          return;
        }

        if (!hasQuestionsForProfession(selectedProfession.id)) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const loadedQuestions = getQuestionsByProfessionAndTopic(
          selectedProfession.id,
          params.topicKey
        );
        if (!isMounted) return;
        setQuestions(loadedQuestions);

        const total = loadedQuestions.length;
        const answered = await getTopicProgress(
          selectedProfession.id,
          params.topicKey,
          total
        );

        // Если есть прогресс — предлагаем продолжить
        if (answered > 0 && answered <= total) {
          setCurrentQuestionIndex(answered - 1);
          setShowContinueModal(true);
        } else {
          setCurrentQuestionIndex(0);
          setShowContinueModal(false);
        }

        setIsLoading(false);
      };

      init();

      return () => {
        isMounted = false;
      };
    }, [selectedProfession, params.topicKey, router])
  );

  // Автосохранение прогресса (при изменении индекса)
  useEffect(() => {
    if (!selectedProfession || !params.topicKey || isLoading) return;

    const timer = setTimeout(() => {
      const answeredCount = currentQuestionIndex + 1;
      saveTopicProgress(
        selectedProfession.id,
        params.topicKey,
        answeredCount
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [currentQuestionIndex, selectedProfession, params.topicKey, isLoading]);

  // Сохранение при сворачивании приложения
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

    const correctAnswers = questions.reduce((count, question, index) => {
      const userAnswer = selectedAnswers[index];
      return userAnswer === question.correctAnswer ? count + 1 : count;
    }, 0);

    router.push({
      pathname: "/training/completion",
      params: {
        correctAnswers: correctAnswers.toString(),
        totalQuestions: questions.length.toString(),
        topicKey: params.topicKey,
      },
    });
  }, [selectedProfession, params.topicKey, questions, selectedAnswers, router]);

  // Рендер состояний
  if (!selectedProfession) {
    return <ErrorState error="Профессия не выбрана" />;
  }

  if (isLoading) {
    return <TrainingLoadingScreen message="Загрузка вопросов..." />;
  }

  if (questions.length === 0) {
    return <NotImplementedScreen />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = (currentQuestionIndex + 1) / questions.length;
  const hasAnswer = !!selectedAnswers[currentQuestionIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TrainingContinueModal
        visible={showContinueModal}
        onContinue={handleContinue}
        onRestart={handleRestart}
      />

      <TrainingHeader
        profession={selectedProfession}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />

      <ProgressTracker progress={progress} />

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