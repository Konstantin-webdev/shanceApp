// app/exam/session.tsx
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExamTimer } from "@/components/Exam/ExamTimer";
import { useTheme } from "@/components/ThemeProvider";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useExamTime } from "@/hooks/useExamTime";
import { useExamSession } from "@/utils/useExamSession";

export default function ExamSessionScreen() {
  const [isFinishing, setIsFinishing] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();
  const { selectedProfession } = useProfessionStore();
  const [isTimeUp, setIsTimeUp] = useState(false);

  const exam = useExamSession(selectedProfession?.id || 0);
  const examTime = useExamTime();

  // Обработчик истечения времени
  const handleTimeUp = () => {
    setIsTimeUp(true);
    finishExam(true);
  };

  // Функция завершения экзамена
  const finishExam = (timeUp: boolean = false) => {
    const results = exam.getResults();
    if (!results || !selectedProfession) return;

    const elapsedSeconds = examTime.getElapsedSeconds();

    router.replace({
      pathname: "/exam/results",
      params: {
        correctAnswers: results.correctCount.toString(),
        totalQuestions: results.total.toString(),
        professionName: selectedProfession.name,
        professionId: selectedProfession.id.toString(),
        score: results.score.toString(),
        passed: results.passed.toString(),
        timeSpent: elapsedSeconds.toString(),
        questionsData: JSON.stringify(results.questions),
        answersData: JSON.stringify(results.answers),
        saved: "false",
        timeUp: timeUp ? "true" : "false",
      },
    });
  };

  const handleFinish = () => {
    if (exam.isAnswered && !isFinishing) {
      setIsFinishing(true);
      finishExam(false);
    }
  };

  // Если время вышло - сразу завершаем
  useEffect(() => {
    if (isTimeUp) {
      finishExam(true);
    }
  }, [isTimeUp]);

  // Проверка профессии
  if (!selectedProfession) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text }}>
          Выберите профессию в настройках
        </Text>
      </View>
    );
  }

  // Загрузка
  if (exam.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text }}>Загрузка вопросов...</Text>
      </View>
    );
  }

  // Нет вопросов
  if (!exam.currentQuestion) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text }}>
          Нет доступных вопросов для этой профессии
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Шапка */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.card,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/ExamScreen")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Таймер */}
          <ExamTimer durationMinutes={10} onTimeUp={handleTimeUp} />

          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
              minWidth: 60,
              textAlign: "right",
            }}
          >
            {exam.currentIndex + 1}/{exam.totalQuestions}
          </Text>
        </View>
      </View>

      {/* Вопрос */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 24,
            lineHeight: 24,
          }}
        >
          {exam.currentQuestion.text}
        </Text>

        {/* Варианты ответов */}
        {exam.currentQuestion.options.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={{
              padding: 16,
              marginBottom: 12,
              borderRadius: 12,
              backgroundColor:
                exam.answers[exam.currentIndex] === answer.id
                  ? colors.primary
                  : colors.card,
              borderWidth: 1,
              borderColor:
                exam.answers[exam.currentIndex] === answer.id
                  ? colors.primary
                  : colors.border,
            }}
            onPress={() => !isTimeUp && exam.handleAnswer(answer.id)}
            disabled={isTimeUp}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color:
                  exam.answers[exam.currentIndex] === answer.id
                    ? "#FFFFFF"
                    : colors.text,
                fontSize: 16,
                lineHeight: 22,
              }}
            >
              {answer.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Кнопка навигации */}
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
        }}
      >
        {exam.isLastQuestion ? (
          <TouchableOpacity
            style={{
              backgroundColor: exam.isAnswered ? colors.success : colors.border,
              padding: 18,
              borderRadius: 12,
              alignItems: "center",
              opacity: exam.isAnswered ? 1 : 0.6,
            }}
            onPress={handleFinish}
            disabled={!exam.isAnswered}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Завершить экзамен
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: exam.isAnswered ? colors.primary : colors.border,
              padding: 18,
              borderRadius: 12,
              alignItems: "center",
              opacity: exam.isAnswered ? 1 : 0.6,
            }}
            onPress={exam.nextQuestion}
            disabled={!exam.isAnswered}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Следующий вопрос
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
