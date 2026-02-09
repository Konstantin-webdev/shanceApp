import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import QuestionItem from "@/components/QuestionItem";

import {
  getQuestionsByProfessionId,
  hasQuestionsForProfession,
} from "@/components/data/questions";
import NotImplementedScreen from "@/components/NotImplementedScreen";
import { ProgressTracker } from "@/components/Training/practice/ProgressTracker";
import { QuestionNavigation } from "@/components/Training/practice/QuestionNavigation";
import TrainingContinueModal from "@/components/Training/practice/TrainingContinueModal";
import { TrainingHeader } from "@/components/Training/practice/TrainingHeader";
import TrainingLoadingScreen from "@/components/Training/practice/TrainingLoadingScreen";
import type { IQuestion } from "@/components/types/questions";
import { useTrainingProgress } from "@/hooks/useTrainingProgress";

export default function PracticeScreen() {
  const router = useRouter();
  const { selectedProfession } = useProfessionStore();
  const { colors } = useTheme();

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [hasLoadedSavedProgress, setHasLoadedSavedProgress] = useState(false);

  const { getSavedProgress, saveCurrentProgress, clearCurrentProgress } =
    useTrainingProgress();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && selectedProfession && hasLoadedSavedProgress) {
      saveCurrentProgress(
        selectedProfession.id,
        currentQuestionIndex,
        selectedAnswers,
      );
    }
  }, [
    currentQuestionIndex,
    selectedAnswers,
    questions,
    selectedProfession,
    saveCurrentProgress,
    hasLoadedSavedProgress,
  ]);

  const loadData = async () => {
    if (!selectedProfession) {
      router.replace("/(tabs)");
      return;
    }

    setIsLoading(true);

    try {
      if (!hasQuestionsForProfession(selectedProfession.id)) {
        setIsLoading(false);
        return;
      }

      const loadedQuestions = getQuestionsByProfessionId(selectedProfession.id);
      setQuestions(loadedQuestions);

      const savedProgress = getSavedProgress(selectedProfession.id);
      if (savedProgress) {
        setCurrentQuestionIndex(savedProgress.questionIndex);
        setSelectedAnswers(savedProgress.selectedAnswers);
        setHasLoadedSavedProgress(true);

        setTimeout(() => {
          setShowContinueModal(true);
        }, 500);
      } else {
        setHasLoadedSavedProgress(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => setShowContinueModal(false);
  const handleRestart = () => {
    if (!selectedProfession) return;
    clearCurrentProgress(selectedProfession.id);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowContinueModal(false);
  };

  const handleCancel = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowContinueModal(false);
    router.back();
  };

  const handleAnswerSelect = (questionIndex: number, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const finishTraining = () => {
    if (!selectedProfession) return;

    // Считаем правильные ответы
    const correctAnswers = questions.reduce((count, question, index) => {
      const userAnswer = selectedAnswers[index];
      return userAnswer === question.correctAnswer ? count + 1 : count;
    }, 0);

    // Очищаем прогресс
    clearCurrentProgress(selectedProfession.id);

    router.push({
      pathname: "/training/completion",
      params: {
        correctAnswers: correctAnswers.toString(),
        totalQuestions: questions.length.toString(),
        professionName: selectedProfession.name,
      },
    });
  };

  if (!selectedProfession) {
    return null;
  }

  if (!isLoading && questions.length === 0) {
    return <NotImplementedScreen />;
  }

  if (isLoading) {
    return <TrainingLoadingScreen message="Загрузка вопросов..." />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = (currentQuestionIndex + 1) / questions.length;
  const hasAnswer = !!selectedAnswers[currentQuestionIndex];

  const containerStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <TrainingContinueModal
        visible={showContinueModal}
        onContinue={handleContinue}
        onRestart={handleRestart}
        onCancel={handleCancel}
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
