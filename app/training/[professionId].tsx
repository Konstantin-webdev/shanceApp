// app/training/[professionId].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import NotImplementedScreen from "../../components/NotImplementedScreen";
import TrainingContinueModal from "../../components/TrainingContinueModal";
import TrainingLoadingScreen from "../../components/TrainingLoadingScreen";
import QuestionItem from "../../components/QuestionItem";
import { getProfessionById } from "../data/professions";
import {
  getQuestionsByProfessionId,
  hasQuestionsForProfession,
} from "../data/questions";
import type { IQuestion } from "../types/questions";
import { useTrainingProgress } from "@/hooks/useTrainingProgress";

// ... (TrainingHeader и ProgressBar остаются такими же) ...

export default function TrainingSessionScreen() {
  const router = useRouter();
  const { professionId } = useLocalSearchParams<{ professionId: string }>();

  const [profession, setProfession] = useState<any>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [hasLoadedSavedProgress, setHasLoadedSavedProgress] = useState(false);

  const {
    getSavedProgress,
    hasSavedProgress,
    saveCurrentProgress,
    clearCurrentProgress,
  } = useTrainingProgress(professionId);

  useEffect(() => {
    loadData();
  }, [professionId]);

  // Автосохранение прогресса
  useEffect(() => {
    if (questions.length > 0 && professionId && hasLoadedSavedProgress) {
      saveCurrentProgress(currentQuestionIndex, selectedAnswers);
    }
  }, [
    currentQuestionIndex,
    selectedAnswers,
    questions,
    professionId,
    saveCurrentProgress,
    hasLoadedSavedProgress,
  ]);

  const loadData = async () => {
    if (!professionId) {
      router.back();
      return;
    }

    setIsLoading(true);

    try {
      const id = parseInt(professionId);
      const prof = getProfessionById(id);
      setProfession(prof);

      if (!hasQuestionsForProfession(id)) {
        setIsLoading(false);
        return;
      }

      const loadedQuestions = getQuestionsByProfessionId(id);
      setQuestions(loadedQuestions);

      // Сразу проверяем и загружаем сохраненный прогресс
      const savedProgress = getSavedProgress();
      if (savedProgress) {
        // Устанавливаем сохраненные значения
        setCurrentQuestionIndex(savedProgress.questionIndex);
        setSelectedAnswers(savedProgress.selectedAnswers);
        setHasLoadedSavedProgress(true);

        // Показываем модалку через задержку
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

  // Обработчики для модалки
  const handleContinue = () => {
    // Просто закрываем модалку, прогресс уже загружен
    setShowContinueModal(false);
  };

  const handleRestart = () => {
    clearCurrentProgress();
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowContinueModal(false);
  };

  const handleCancel = () => {
    // Если отмена - возвращаемся к начальным значениям
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowContinueModal(false);
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
    if (!professionId) return;

    const correctAnswers = questions.reduce((count, question, index) => {
      const userAnswer = selectedAnswers[index];
      return userAnswer === question.correctAnswer ? count + 1 : count;
    }, 0);

    // Очищаем прогресс после завершения
    clearCurrentProgress();

    router.push({
      pathname: "/training/completion",
      params: {
        correctAnswers: correctAnswers.toString(),
        totalQuestions: questions.length.toString(),
        professionName: profession?.name || "",
      },
    });
  };

  const handleBack = () => {
    Alert.alert(
      "Выйти из тренировки?",
      "Ваш прогресс будет сохранен автоматически",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Выйти",
          onPress: () => router.back(),
        },
      ],
    );
  };

  const handleClearProgress = () => {
    Alert.alert("Начать заново?", "Весь текущий прогресс будет сброшен", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Начать заново",
        style: "destructive",
        onPress: () => {
          clearCurrentProgress();
          setCurrentQuestionIndex(0);
          setSelectedAnswers({});
          Alert.alert("Прогресс сброшен", "Можете начать заново");
        },
      },
    ]);
  };

  if (!isLoading && questions.length === 0) {
    return <NotImplementedScreen />;
  }

  if (isLoading || !profession) {
    return <TrainingLoadingScreen message="Загрузка вопросов..." />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = (currentQuestionIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TrainingContinueModal
        visible={showContinueModal}
        onContinue={handleContinue}
        onRestart={handleRestart}
        onCancel={handleCancel}
      />

      {/* Заголовок */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.professionName} numberOfLines={1}>
            {profession.name}
          </Text>
          <Text style={styles.progressText}>
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </Text>
        </View>
      </View>

      {/* Прогресс бар */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>

      {/* Основной контент */}
      <ScrollView style={styles.contentScroll}>
        {currentQuestion && (
          <QuestionItem
            question={currentQuestion}
            index={currentQuestionIndex}
            userAnswer={selectedAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            isCurrentQuestion={true}
          />
        )}

        {/* Навигация */}
        <View style={styles.navigationContainer}>
          <View style={styles.navigationButtons}>
            {currentQuestionIndex > 0 && (
              <TouchableOpacity
                style={[styles.navButton, styles.prevButton]}
                onPress={handlePrevQuestion}
              >
                <Text style={styles.navButtonText}>← Назад</Text>
              </TouchableOpacity>
            )}

            {!isLastQuestion ? (
              <TouchableOpacity
                style={[
                  styles.navButton,
                  styles.nextButton,
                  !selectedAnswers[currentQuestionIndex] &&
                    styles.disabledButton,
                ]}
                onPress={handleNextQuestion}
                disabled={!selectedAnswers[currentQuestionIndex]}
              >
                <Text style={styles.navButtonText}>Далее →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.navButton,
                  styles.completeButton,
                  !selectedAnswers[currentQuestionIndex] &&
                    styles.disabledButton,
                ]}
                onPress={finishTraining}
                disabled={!selectedAnswers[currentQuestionIndex]}
              >
                <Text style={styles.navButtonText}>Завершить тренировку</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Кнопка очистки прогресса */}
          <TouchableOpacity
            style={styles.clearProgressLink}
            onPress={handleClearProgress}
          >
            <Text style={styles.clearProgressText}>
              Начать тренировку заново
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  professionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  progressText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
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
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  contentScroll: {
    flex: 1,
    padding: 20,
  },
  navigationContainer: {
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  prevButton: {
    backgroundColor: "#E5E5EA",
    marginRight: 8,
  },
  nextButton: {
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: "#34C759",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#C7C7CC",
    opacity: 0.6,
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  clearProgressLink: {
    paddingVertical: 12,
    alignItems: "center",
  },
  clearProgressText: {
    color: "#FF3B30",
    fontSize: 14,
  },
});
