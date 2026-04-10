import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle, Clock, XCircle } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";

interface StatsCardProps {
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
  passed: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  correctAnswers,
  totalQuestions,
  score,
  timeSpent,
  passed,
}) => {
  const { colors } = useTheme();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreLabel, { color: colors.muted }]}>
          Ваш результат
        </Text>
        <Text
          style={[
            styles.scoreValue,
            passed ? { color: colors.success } : { color: colors.danger },
          ]}
        >
          {score}%
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <CheckCircle size={24} color={colors.success} />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {correctAnswers}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            Правильно
          </Text>
        </View>

        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />

        <View style={styles.statItem}>
          <XCircle size={24} color={colors.danger} />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {totalQuestions - correctAnswers}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            Ошибок
          </Text>
        </View>

        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />

        <View style={styles.statItem}>
          <Clock size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {formatTime(timeSpent)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Время</Text>
        </View>
      </View>

      <View style={styles.passIndicator}>
        <View style={[styles.passBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.passProgress,
              { width: `${Math.min(score, 100)}%` },
              passed
                ? { backgroundColor: colors.success }
                : { backgroundColor: colors.danger },
            ]}
          />
        </View>
        <View style={styles.passThreshold}>
          <View
            style={[styles.thresholdLine, { backgroundColor: colors.primary }]}
          />
          <Text style={[styles.thresholdText, { color: colors.primary }]}>
            70% - порог
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "700",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
  },
  passIndicator: {
    marginTop: 16,
  },
  passBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  passProgress: {
    height: "100%",
    borderRadius: 3,
  },
  passThreshold: {
    marginTop: 8,
    position: "relative",
    height: 16,
  },
  thresholdLine: {
    position: "absolute",
    left: "70%",
    top: 0,
    bottom: 0,
    width: 2,
  },
  thresholdText: {
    position: "absolute",
    left: "70%",
    top: 20,
    fontSize: 10,
    transform: [{ translateX: -20 }],
  },
});
