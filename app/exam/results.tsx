// app/exam/results.tsx
import { useTheme } from "@/components/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StatusBar, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionButtons } from "@/components/Exam/ActionButtons";
import { QuestionDetails } from "@/components/Exam/QuestionDetails";
import { ResultHeader } from "@/components/Exam/ResultHeader";
import { StatsCard } from "@/components/Exam/StatsCard";

import { saveExamResult } from "@/components/data/examResults";
import { styles } from "@/components/Exam/styles";
import { parseExamResults } from "@/utils/examResultsParser";
import { SpecialistNotice } from "@/components/Exam/SpecialistNotice";

export default function ExamResultsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const rawParams = useLocalSearchParams();

  const {
    correctAnswers,
    totalQuestions,
    professionName,
    professionId,
    score,
    passed,
    timeSpent,
    questionsData,
    answersData,
    saved,
  } = parseExamResults(rawParams);

  useEffect(() => {
    const saveResult = async () => {
      if (!saved) {
        try {
          await saveExamResult({
            professionId,
            professionName,
            correctAnswers,
            totalQuestions,
            score,
            passed,
            timeSpent,
          });
        } catch (error) {
          console.error("Ошибка при сохранении результата:", error);
        }
      }
    };

    saveResult();
  }, [
    saved,
    professionId,
    professionName,
    correctAnswers,
    totalQuestions,
    score,
    passed,
    timeSpent,
  ]);

  const handleGoHome = () => router.push("/(tabs)/ExamScreen");
  const handleRetry = () => router.push("/exam/session");
  const handleViewStats = () => router.push("/(tabs)/StatsScreen");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* Заголовок с иконкой */}
            <ResultHeader passed={passed} professionName={professionName} />

            {/* Карточка со статистикой */}
            <StatsCard
              correctAnswers={correctAnswers}
              totalQuestions={totalQuestions}
              score={score}
              timeSpent={timeSpent}
              passed={passed}
            />

            {/* Детали по вопросам */}
            <QuestionDetails
              questionsData={questionsData}
              answersData={answersData}
            />
            <SpecialistNotice />

            {/* Кнопки действий */}
            <ActionButtons
              onViewStats={handleViewStats}
              onRetry={handleRetry}
              onGoHome={handleGoHome}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
