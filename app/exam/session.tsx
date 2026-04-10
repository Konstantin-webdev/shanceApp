import { ExamContent } from "@/components/Exam/session/ExamContent";
import { ExamFooter } from "@/components/Exam/session/ExamFooter";
import { ExamHeader } from "@/components/Exam/session/ExamHeader";
import { useTheme } from "@/components/ThemeProvider";
import { useExamResultStore } from "@/components/store/examResultStore";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useExamSession } from "@/utils/useExamSession";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExamSessionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { selectedProfession } = useProfessionStore();
  const setResult = useExamResultStore((state) => state.setResult);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const startTimeRef = useRef(Date.now());

  const exam = useExamSession(selectedProfession?.id || 0);

  const finishExam = (timeUp = false) => {
    if (isFinishing) return;
    setIsFinishing(true);

    const results = exam.getResults();
    if (!results || !selectedProfession) return;

    const elapsedSeconds = Math.floor(
      (Date.now() - startTimeRef.current) / 1000,
    );
    setResult({
      correctAnswers: results.correctCount,
      totalQuestions: results.total,
      professionName: selectedProfession.name,
      professionId: selectedProfession.id,
      score: results.score,
      passed: results.passed,
      timeSpent: elapsedSeconds,
      questionsData: results.questions,
      answersData: results.answers,
      timeUp,
    });

    router.replace("/exam/results");
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    finishExam(true);
  };

  const handleFinish = () => {
    if (exam.isAnswered && !isFinishing) finishExam(false);
  };

  const handleNext = () => exam.nextQuestion();
  const handleAnswer = (answerId: string) => exam.handleAnswer(answerId);

  if (!exam.currentQuestion) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16, opacity: 0.7 }}>
          Нет доступных вопросов для этой профессии
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ExamHeader
        currentIndex={exam.currentIndex}
        totalQuestions={exam.totalQuestions}
        onBackPress={() => router.replace("/(tabs)/ExamScreen")}
        durationMinutes={10}
        onTimeUp={handleTimeUp}
      />

      <ExamContent
        questionText={exam.currentQuestion.text}
        options={exam.currentQuestion.options}
        selectedAnswerId={exam.answers[exam.currentIndex]}
        isTimeUp={isTimeUp}
        onAnswer={handleAnswer}
      />

      <ExamFooter
        isLastQuestion={exam.isLastQuestion}
        isAnswered={exam.isAnswered}
        isTimeUp={isTimeUp}
        onNext={handleNext}
        onFinish={handleFinish}
      />
    </SafeAreaView>
  );
}
