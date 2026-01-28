import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/components/ThemeProvider";

interface AdditionalStatsProps {
  stats: {
    totalCorrect: number;
    totalQuestions: number;
    accuracy: number;
  };
}

export function AdditionalStats({ stats }: AdditionalStatsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.additionalStats}>
      <View
        style={[
          styles.additionalStatItem,
          { backgroundColor: colors.card, shadowColor: colors.text },
        ]}
      >
        <Text style={[styles.additionalStatValue, { color: colors.primary }]}>
          {stats.totalCorrect}
        </Text>
        <Text style={[styles.additionalStatLabel, { color: colors.muted }]}>
          Правильных ответов
        </Text>
      </View>
      <View
        style={[
          styles.additionalStatItem,
          { backgroundColor: colors.card, shadowColor: colors.text },
        ]}
      >
        <Text style={[styles.additionalStatValue, { color: colors.primary }]}>
          {stats.accuracy.toFixed(1)}%
        </Text>
        <Text style={[styles.additionalStatLabel, { color: colors.muted }]}>
          Точность
        </Text>
      </View>
      <View
        style={[
          styles.additionalStatItem,
          { backgroundColor: colors.card, shadowColor: colors.text },
        ]}
      >
        <Text style={[styles.additionalStatValue, { color: colors.primary }]}>
          {stats.totalQuestions}
        </Text>
        <Text style={[styles.additionalStatLabel, { color: colors.muted }]}>
          Всего вопросов
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  additionalStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  additionalStatItem: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  additionalStatValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  additionalStatLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
});
