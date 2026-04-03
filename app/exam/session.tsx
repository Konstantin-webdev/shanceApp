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

  const handleTimeUp = () => {
    setIsTimeUp(true);
    finishExam(true);
  };

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

  useEffect(() => {
    if (isTimeUp) {
      finishExam(true);
    }
  }, [isTimeUp]);

  if (!selectedProfession) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            opacity: 0.7,
          }}
        >
          Выберите профессию в настройках
        </Text>
      </View>
    );
  }

  if (exam.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            opacity: 0.7,
          }}
        >
          Загрузка вопросов...
        </Text>
      </View>
    );
  }

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
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            opacity: 0.7,
          }}
        >
          Нет доступных вопросов для этой профессии
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 8,
          backgroundColor: colors.card,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          marginBottom: 4,
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
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.background,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>

          <ExamTimer durationMinutes={10} onTimeUp={handleTimeUp} />
          <View
            style={{
              width: 44,
              height: 44,
              justifyContent: "center",
              alignItems: "center",
              borderColor: colors.primary,
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 20,
                fontWeight: "700",
              }}
            >
              {exam.currentIndex + 1}/{exam.totalQuestions}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 2,
            borderWidth: 2,
            borderColor: colors.primary,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.text,
              lineHeight: 24,
              textAlign: "center",
            }}
          >
            {exam.currentQuestion.text}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {exam.currentQuestion.options.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={{
                padding: 16,
                marginBottom: 12,
                borderRadius: 16,
                backgroundColor:
                  exam.answers[exam.currentIndex] === answer.id
                    ? colors.primary
                    : colors.card,
                borderWidth: 2,
                borderColor:
                  exam.answers[exam.currentIndex] === answer.id
                    ? colors.primary
                    : colors.border,
                shadowColor: colors.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity:
                  exam.answers[exam.currentIndex] === answer.id ? 0.2 : 0.05,
                shadowRadius:
                  exam.answers[exam.currentIndex] === answer.id ? 8 : 4,
                elevation:
                  exam.answers[exam.currentIndex] === answer.id ? 4 : 2,
              }}
              onPress={() => !isTimeUp && exam.handleAnswer(answer.id)}
              disabled={isTimeUp}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor:
                      exam.answers[exam.currentIndex] === answer.id
                        ? "rgba(255, 255, 255, 0.2)"
                        : colors.background,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Text
                    style={{
                      color:
                        exam.answers[exam.currentIndex] === answer.id
                          ? "#FFFFFF"
                          : colors.text,
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>

                <Text
                  style={{
                    color:
                      exam.answers[exam.currentIndex] === answer.id
                        ? "#FFFFFF"
                        : colors.text,
                    fontSize: 16,
                    lineHeight: 22,
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {answer.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Панель кнопок */}
      <View
        style={{
          padding: 20,
          backgroundColor: colors.card,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: colors.border,
        }}
      >
        {exam.isLastQuestion ? (
          <TouchableOpacity
            style={{
              backgroundColor: exam.isAnswered
                ? isTimeUp
                  ? colors.warning
                  : colors.success
                : colors.border,
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderRadius: 16,
              alignItems: "center",
              shadowColor: exam.isAnswered ? colors.success : colors.border,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: exam.isAnswered ? 0.3 : 0,
              shadowRadius: 8,
              elevation: exam.isAnswered ? 4 : 0,
            }}
            onPress={handleFinish}
            disabled={!exam.isAnswered || isTimeUp}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "700",
                letterSpacing: 0.5,
              }}
            >
              {isTimeUp ? "Время вышло!" : "Завершить экзамен"}
            </Text>
            {isTimeUp && (
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: 14,
                  marginTop: 4,
                  opacity: 0.9,
                }}
              >
                Результаты будут сохранены
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: exam.isAnswered ? colors.primary : colors.border,
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderRadius: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 12,
              shadowColor: exam.isAnswered ? colors.primary : colors.border,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: exam.isAnswered ? 0.3 : 0,
              shadowRadius: 8,
              elevation: exam.isAnswered ? 4 : 0,
            }}
            onPress={exam.nextQuestion}
            disabled={!exam.isAnswered || isTimeUp}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "700",
                letterSpacing: 0.5,
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
