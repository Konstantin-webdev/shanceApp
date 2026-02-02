import { useTheme } from "@/components/ThemeProvider";
import { useTrainingProgress } from "@/hooks/useTrainingProgress";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotImplementedScreen from "../../components/NotImplementedScreen";
import QuestionItem from "../../components/QuestionItem";
import TrainingContinueModal from "../../components/TrainingContinueModal";
import TrainingLoadingScreen from "../../components/TrainingLoadingScreen";
import { getProfessionById } from "../data/professions";
import {
  getQuestionsByProfessionId,
  hasQuestionsForProfession,
} from "../data/questions";
import type { IProfession } from "../types/profession";
import type { IQuestion } from "../types/questions";

export default function TrainingSessionScreen() {
  const router = useRouter();
  const { professionId } = useLocalSearchParams<{ professionId: string }>();
  const { colors } = useTheme();

  const [profession, setProfession] = useState<IProfession | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [hasLoadedSavedProgress, setHasLoadedSavedProgress] = useState(false);

  const { getSavedProgress, saveCurrentProgress, clearCurrentProgress } =
    useTrainingProgress(professionId);

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
      const prof = getProfessionById(id) as IProfession;
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
    router.back();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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
      color: colors.text,
    },
    progressText: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 2,
    },
    progressBarContainer: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    progressBarBackground: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    mainContainer: {
      flex: 1,
    },
    contentScroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 160, // Место для кнопок навигации
    },
    navigationContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      paddingTop: 16,
      paddingBottom: 20,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
    navButtonIcon: {
      margin: 8,
    },
    prevButton: {
      backgroundColor: colors.border,
      marginRight: 8,
    },
    nextButton: {
      backgroundColor: colors.primary,
      marginLeft: 8,
    },
    completeButton: {
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: colors.success,
      marginLeft: 8,
    },
    disabledButton: {
      backgroundColor: colors.muted,
      opacity: 0.6,
    },
    navButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    navButtonWrap: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    clearProgressLink: {
      paddingVertical: 12,
      alignItems: "center",
    },
    clearProgressText: {
      color: colors.danger,
      fontSize: 14,
    },
  });
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background, marginTop: -30 }}
    >
      <View style={styles.container}>
        <TrainingContinueModal
          visible={showContinueModal}
          onContinue={handleContinue}
          onRestart={handleRestart}
          onCancel={handleCancel}
        />

        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.primary} />
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

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>

        {/* Основной контент */}
        <View style={styles.mainContainer}>
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
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

          {/* Навигация */}
          <View style={styles.navigationContainer}>
            <View style={styles.navigationButtons}>
              {currentQuestionIndex > 0 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={handlePrevQuestion}
                >
                  <View style={styles.navButtonWrap}>
                    <ArrowLeft size={18} color={colors.text} />
                    <Text
                      style={[styles.navButtonText, { color: colors.text }]}
                    >
                      Назад
                    </Text>
                  </View>
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
                  <View style={styles.navButtonWrap}>
                    <Text style={styles.navButtonText}>Далее</Text>
                    <ArrowRight size={18} color={"#FFFFFF"} />
                  </View>
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
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
