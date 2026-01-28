import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/components/ThemeProvider";

interface MainStatsProps {
  stats: {
    totalTests: number;
    averageScore: number;
    passedTests: number;
  };
}

export function MainStats({ stats }: MainStatsProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.statsCard,
        { backgroundColor: colors.card, shadowColor: colors.text },
      ]}
    >
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.success }]}>
          {stats.totalTests}
        </Text>
        <Text style={[styles.statLabel, { color: colors.muted }]}>
          Всего тестов
        </Text>
      </View>

      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.success }]}>
          {stats.passedTests}
        </Text>
        <Text style={[styles.statLabel, { color: colors.muted }]}>
          Сдано успешно
        </Text>
      </View>

      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.success }]}>
          {stats.averageScore.toFixed(0)}%
        </Text>
        <Text style={[styles.statLabel, { color: colors.muted }]}>
          Средний балл
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
});
