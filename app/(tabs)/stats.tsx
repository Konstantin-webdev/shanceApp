import { AdditionalStats } from "@/components/Statistics/AdditionalStats";
import { MainStats } from "@/components/Statistics/MainStats";
import { ResultHistory } from "@/components/Statistics/ResultHistory";
import { StatsHeader } from "@/components/Statistics/StatsHeader";
import { useTheme } from "@/components/ThemeProvider";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ExamResult, getStatistics } from "../data/examResults";
import { useProfessionStore } from "../store/useProfessionStore";
import { useUserStore } from "../store/useUserStore";

export default function StatsScreen() {
  const [results, setResults] = useState<ExamResult[]>([]);
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

  const { userName } = useUserStore();
  const { selectedProfession } = useProfessionStore();
  const { colors } = useTheme();

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
      await clearAllStatistics();
      await loadResults();
    } catch (error) {
      console.error("Ошибка при очистке статистики:", error);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text }}>Загрузка статистики...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <StatsHeader
        userName={userName}
        selectedProfession={selectedProfession}
      />

      <MainStats stats={stats} />
      <AdditionalStats stats={stats} />

      <ResultHistory
        results={results}
        selectedProfession={selectedProfession}
        onRefresh={onRefresh}
        onClearStats={handleClearStats}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
});
function clearAllStatistics() {
  throw new Error("Function not implemented.");
}
