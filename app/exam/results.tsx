import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionButtons } from "@/components/Exam/result/ResultFooterButtons";
import { ResultHeader } from "@/components/Exam/result/ResultHeader";
import { QuestionDetails } from "@/components/Exam/result/ResultQuestionDetails";
import { StatsCard } from "@/components/Exam/result/ResultStats";
import { SpecialistNotice } from "@/components/Exam/result/SpecialistNotice";
import { styles } from "@/components/Exam/styles";
import { useExamResultStore } from "@/components/store/examResultStore";
import { saveExamResult } from "@/utils/examResultsStorage";

export default function ExamResultsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { result, clearResult } = useExamResultStore();
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (result && !hasSaved) {
      saveExamResult(result).catch((error) => {
        console.error("Ошибка при сохранении результата:", error);
      });
      setHasSaved(true);
    }
  }, [result, hasSaved]);

  const handleGoHome = () => {
    clearResult();
    router.push("/(tabs)/ExamScreen");
  };

  const handleRetry = () => {
    clearResult();
    router.push("/exam/session");
  };

  const handleViewStats = () => {
    router.push("/(tabs)/StatsScreen");
  };

  if (!result) {
    // Пока проверяем, можно показать лоадер или null
    return null;
  }

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
            <ResultHeader
              passed={result.passed}
              professionName={result.professionName}
            />

            <StatsCard
              correctAnswers={result.correctAnswers}
              totalQuestions={result.totalQuestions}
              score={result.score}
              timeSpent={result.timeSpent}
              passed={result.passed}
            />

            <QuestionDetails
              questionsData={result.questionsData}
              answersData={result.answersData}
            />

            <SpecialistNotice />

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
