import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { AdditionalStats } from "@/components/Statistics/AdditionalStats";
import { MainStats } from "@/components/Statistics/MainStats";
import { ResultHistory } from "@/components/Statistics/ResultHistory";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTheme } from "@/components/ThemeProvider";
import type { PersistedExamResult } from "@/components/types/exam";
import { clearExamResults, getStatistics } from "@/utils/examResultsStorage";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

export default function StatsScreen() {
  const [results, setResults] = useState<PersistedExamResult[]>([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    passedTests: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { selectedProfession } = useProfessionStore();
  const { colors } = useTheme();

  // Стили внутри компонента с useMemo
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        },
        contentContainer: {
          paddingBottom: 40,
        },
        loadingText: {
          color: colors.text,
        },
      }),
    [colors]
  );

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    const { results: examResults, ...statistics } = await getStatistics();
    setResults(examResults);
    setStats(statistics);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResults();
    setRefreshing(false);
  };

  const handleClearStats = async () => {
    try {
      await clearExamResults();
      setResults([]);
      setStats({
        totalTests: 0,
        averageScore: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        passedTests: 0,
        accuracy: 0,
      });
      Alert.alert("Успех", "Вся статистика была очищена");
    } catch (error) {
      console.error("Ошибка при очистке статистики:", error);
      Alert.alert("Ошибка", "Не удалось очистить статистику");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка статистики...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        title="Статистика"
        titleColor={colors.tabStats}
        subtitle="Результаты прохождения экзаменов"
      />

      <MainStats stats={stats} />
      <AdditionalStats stats={stats} />

      <ResultHistory
        results={results}
        selectedProfession={selectedProfession}
        onClearStats={handleClearStats}
      />
    </ScrollView>
  );
}