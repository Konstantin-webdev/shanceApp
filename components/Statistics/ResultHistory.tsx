import { useTheme } from "@/components/ThemeProvider";
import type { PersistedExamResult } from "@/components/types/exam";
import { formatDate, formatTime } from "@/utils/examResultsStorage";
import React, { useMemo } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ResultHistoryProps {
  results: PersistedExamResult[];
  selectedProfession?: { id: number; name: string } | null;
  onClearStats: () => void;
}

export function ResultHistory({
  results,
  selectedProfession,
  onClearStats,
}: ResultHistoryProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderRadius: 16,
          marginHorizontal: 20,
          marginBottom: 30,
          overflow: "hidden",
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        title: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          flex: 1,
        },
        emptyContainer: {
          padding: 32,
          alignItems: "center",
        },
        emptyText: {
          fontSize: 14,
          color: colors.muted,
          textAlign: "center",
          marginBottom: 8,
        },
        emptyHint: {
          fontSize: 13,
          color: colors.muted,
          textAlign: "center",
          fontStyle: "italic",
        },
        resultItem: {
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        row: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        },
        userName: {
          fontSize: 14,
          fontWeight: "500",
          color: colors.text,
        },
        scoreBadge: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 20,
          gap: 6,
        },
        scoreText: {
          fontSize: 14,
          fontWeight: "bold",
        },
        statusText: {
          fontSize: 12,
          fontWeight: "500",
        },
        detailText: {
          fontSize: 12,
          color: colors.muted,
        },
        clearContainer: {
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          alignItems: "center",
        },
        clearButton: {
          width: "100%",
          paddingVertical: 14,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: "center",
          backgroundColor: colors.danger + "15",
          borderColor: colors.danger + "40",
        },
        clearButtonText: {
          fontSize: 15,
          fontWeight: "600",
          color: colors.danger,
        },
        clearHint: {
          fontSize: 12,
          color: colors.muted,
          textAlign: "center",
          marginTop: 6,
          fontStyle: "italic",
        },
      }),
    [colors]
  );

  const handleClear = () => {
    Alert.alert(
      "Очистить статистику",
      "Вы уверены, что хотите удалить всю статистику? Это действие нельзя отменить.",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Очистить", style: "destructive", onPress: onClearStats },
      ]
    );
  };

  const filteredResults = selectedProfession
    ? results.filter((r) => r.professionId === selectedProfession.id)
    : results;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          История попыток{" "}
          {selectedProfession ? `(${selectedProfession.name})` : ""}
        </Text>
      </View>

      {filteredResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedProfession
              ? `Нет результатов по профессии "${selectedProfession.name}"`
              : "Пока нет данных о пройденных тестах"}
          </Text>
          <Text style={styles.emptyHint}>
            Пройдите экзамен, чтобы увидеть статистику
          </Text>
        </View>
      ) : (
        <>
          {filteredResults.map((result) => {
            const passedColor = result.passed ? colors.success : colors.danger;
            return (
              <View key={result.id} style={styles.resultItem}>
                {/* Строка: имя пользователя и результат */}
                <View style={styles.row}>
                  <Text style={styles.userName}>
                    {result.userName || "Пользователь"}
                  </Text>
                  <View
                    style={[
                      styles.scoreBadge,
                      { backgroundColor: passedColor + "20" },
                    ]}
                  >
                    <Text style={[styles.scoreText, { color: passedColor }]}>
                      {result.score}%
                    </Text>
                    <Text style={[styles.statusText, { color: passedColor }]}>
                      {result.passed ? "Сдано" : "Не сдано"}
                    </Text>
                  </View>
                </View>

                {/* Строка: дата */}
                <View style={styles.row}>
                  <Text style={styles.detailText}>
                    {formatDate(result.date)}
                  </Text>
                </View>

                {/* Строка: правильные ответы / время */}
                <View style={styles.row}>
                  <Text style={styles.detailText}>
                    {result.correctAnswers} из {result.totalQuestions} правильных
                  </Text>
                  <Text style={styles.detailText}>
                    Время: {formatTime(result.timeSpent)}
                  </Text>
                </View>
              </View>
            );
          })}

          <View style={styles.clearContainer}>
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>Очистить всю статистику</Text>
              <Text style={styles.clearHint}>
                Удалит все результаты тестирования
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}