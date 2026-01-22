import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Check, X } from "lucide-react-native";
import { getProfessionById } from "../data/professions";
import {
  getQuestionsByProfessionId,
  hasQuestionsForProfession,
} from "../data/questions";
import NotImplementedScreen from "../../components/NotImplementedScreen";
import type { IQuestion } from "../types/questions";

const { width } = Dimensions.get("window");

// Оптимизированный компонент вопроса
interface QuestionItemProps {
  question: IQuestion;
  index: number;
  userAnswer?: string;
  onAnswerSelect: (questionIndex: number, answerId: string) => void;
  isCurrentQuestion: boolean;
}

const QuestionItem = React.memo(
  ({
    question,
    index,
    userAnswer,
    onAnswerSelect,
    isCurrentQuestion,
  }: QuestionItemProps) => {
    const hasAnswered = userAnswer !== undefined;

    return (
      <View style={styles.questionPage}>
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
              const isSelected = userAnswer === option.id;
              const isActuallyCorrect = option.id === question.correctAnswer;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                    hasAnswered && isActuallyCorrect && styles.correctOption,
                    hasAnswered &&
                      isSelected &&
                      !isActuallyCorrect &&
                      styles.wrongOption,
                  ]}
                  onPress={() => onAnswerSelect(index, option.id)}
                  disabled={hasAnswered}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionIndicator}>
                      <Text style={styles.optionLetter}>
                        {option.id.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.optionText}>{option.text}</Text>
                  </View>

                  {hasAnswered && (
                    <View style={styles.optionStatus}>
                      {isActuallyCorrect ? (
                        <Check size={20} color="#34C759" />
                      ) : isSelected ? (
                        <X size={20} color="#FF3B30" />
                      ) : null}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Подсказка */}
          <View style={styles.hintContainer}>
            {!hasAnswered ? (
              <Text style={styles.hintText}>
                Выберите ответ, чтобы продолжить
              </Text>
            ) : !isCurrentQuestion ? null : (
              <Text style={styles.hintText}>
                Свайп влево для следующего вопроса
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
);

export default function TrainingSessionScreen() {
  const router = useRouter();
  const { professionId } = useLocalSearchParams<{ professionId: string }>();

  const scrollViewRef = useRef<ScrollView>(null);
  const [profession, setProfession] = useState<any>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [professionId]);

  // Прокручиваем к текущему вопросу при изменении индекса
  useEffect(() => {
    if (scrollViewRef.current && questions.length > 0) {
      scrollViewRef.current.scrollTo({
        x: currentQuestionIndex * width,
        animated: true,
      });
    }
  }, [currentQuestionIndex, questions.length]);

  const loadData = async () => {
    if (!professionId) {
      router.back();
      return;
    }

    setIsLoading(true);

    const id = parseInt(professionId);
    const prof = getProfessionById(id);
    setProfession(prof);

    // Проверяем наличие вопросов
    if (!hasQuestionsForProfession(id)) {
      setIsLoading(false);
      return;
    }

    // Загружаем вопросы
    const loadedQuestions = getQuestionsByProfessionId(id);
    setQuestions(loadedQuestions);
    setIsLoading(false);
  };

  const handleScrollEnd = useCallback(
    (event: any) => {
      const page = Math.round(event.nativeEvent.contentOffset.x / width);

      // Проверяем, что ответ выбран (если переходим вперед)
      const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
      if (page > currentQuestionIndex && !hasAnswered) {
        // Откатываем назад, если не ответил
        scrollViewRef.current?.scrollTo({
          x: currentQuestionIndex * width,
          animated: true,
        });
        return;
      }

      if (page !== currentQuestionIndex) {
        setCurrentQuestionIndex(page);
      }
    },
    [currentQuestionIndex, selectedAnswers]
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

  const finishTraining = () => {
    const correctAnswers = calculateCorrectAnswers();
    router.push({
      pathname: "/training/completion",
      params: {
        correctAnswers: correctAnswers.toString(),
        totalQuestions: questions.length.toString(),
        professionName: profession?.name || "",
      },
    });
  };

  const calculateCorrectAnswers = () => {
    return questions.reduce((count, question, index) => {
      const userAnswer = selectedAnswers[index];
      return userAnswer === question.correctAnswer ? count + 1 : count;
    }, 0);
  };

  // Если вопросы в разработке
  if (!isLoading && questions.length === 0) {
    return <NotImplementedScreen />;
  }

  if (isLoading || !profession) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  // Прогресс (от 0 до 1)
  const progress = (currentQuestionIndex + 1) / questions.length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
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

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>

      {/* Горизонтальный ScrollView для свайпа между вопросами */}
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
        {questions.map((question, index) => (
          <QuestionItem
            key={question.id}
            question={question}
            index={index}
            userAnswer={selectedAnswers[index]}
            onAnswerSelect={handleAnswerSelect}
            isCurrentQuestion={index === currentQuestionIndex}
          />
        ))}
      </ScrollView>

      {/* Кнопка завершения (только для текущего вопроса если он последний) */}
      {isLastQuestion && selectedAnswers[currentQuestionIndex] && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={finishTraining}
          >
            <Text style={styles.completeButtonText}>Завершить тренировку</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 100, // Больше места для кнопки завершения
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
  correctOption: {
    borderColor: "#34C759",
    backgroundColor: "#F0FFF4",
  },
  wrongOption: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF0F0",
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
  optionLetter: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  optionText: {
    fontSize: 16,
    color: "#1C1C1E",
    flex: 1,
  },
  optionStatus: {
    marginLeft: 8,
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F8F9FA",
    padding: 20,
    paddingBottom: 30, // Safe area для нижней границы
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  completeButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
