import { useTheme } from "@/components/ThemeProvider";
import type { IProfession } from "@/components/types/profession";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ExamResult, formatDate, formatTime } from "../data/examResults";

interface ResultHistoryProps {
  results: ExamResult[];
  selectedProfession?: IProfession | null;
  onRefresh: () => void;
  onClearStats: () => void;
}

export function ResultHistory({
  results,
  selectedProfession,
  onClearStats,
}: ResultHistoryProps) {
  const { colors } = useTheme();

  const handleClearStats = () => {
    Alert.alert(
      "Очистить статистику",
      "Вы уверены, что хотите удалить всю статистику? Это действие нельзя отменить.",
      [
        {
          text: "Отмена",
          style: "cancel",
        },
        {
          text: "Очистить",
          style: "destructive",
          onPress: () => {
            onClearStats();
          },
        },
      ],
    );
  };

  const filteredResults = selectedProfession
    ? results.filter(
        (result) => result.professionId === selectedProfession.id.toString(),
      )
    : results;

  return (
    <View
      style={[
        styles.historyCard,
        { backgroundColor: colors.card, shadowColor: colors.text },
      ]}
    >
      <View
        style={[styles.historyHeader, { borderBottomColor: colors.border }]}
      >
        <Text style={[styles.historyTitle, { color: colors.text }]}>
          История попыток{" "}
          {selectedProfession ? `(${selectedProfession.name})` : ""}
        </Text>
      </View>

      {filteredResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            {selectedProfession
              ? `Нет результатов по профессии "${selectedProfession.name}"`
              : "Пока нет данных о пройденных тестах"}
          </Text>
          <Text style={[styles.emptyHint, { color: colors.muted }]}>
            Пройдите экзамен, чтобы увидеть статистику
          </Text>
        </View>
      ) : (
        <>
          {filteredResults.map((result) => {
            const passedColor = result.passed ? colors.success : colors.danger;
            return (
              <View
                key={result.id}
                style={[
                  styles.resultItem,
                  { borderBottomColor: colors.border },
                ]}
              >
                {/* Первая строка: Профессия и результат */}
                <View style={styles.resultRow}>
                  <Text style={[styles.resultDetail, { color: colors.muted }]}>
                    {result.userName || "Пользователь"}
                  </Text>
                  <View
                    style={[
                      styles.resultScoreBadge,
                      {
                        backgroundColor: passedColor + "20",
                      },
                    ]}
                  >
                    <Text style={[styles.resultScore, { color: passedColor }]}>
                      {result.score}%
                    </Text>
                    <Text style={[styles.resultStatus, { color: passedColor }]}>
                      {result.passed ? "Сдано" : "Не сдано"}
                    </Text>
                  </View>
                </View>

                {/* Вторая строка: Имя и дата */}
                <View style={styles.resultRow}>
                  <Text style={[styles.resultDate, { color: colors.muted }]}>
                    {formatDate(result.date)}
                  </Text>
                </View>

                {/* Третья строка: Результаты и время */}
                <View style={styles.resultRow}>
                  <Text style={[styles.resultDetail, { color: colors.muted }]}>
                    {result.correctAnswers} из {result.totalQuestions}{" "}
                    правильных
                  </Text>
                  <Text style={[styles.resultDetail, { color: colors.muted }]}>
                    Время: {formatTime(result.timeSpent)}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Кнопка очистки */}
          <View
            style={[
              styles.clearButtonContainer,
              { borderTopColor: colors.border },
            ]}
          >
            <TouchableOpacity
              onPress={handleClearStats}
              style={[
                styles.clearButton,
                {
                  backgroundColor: colors.danger + "15",
                  borderColor: colors.danger + "40",
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.clearButtonContent}>
                <Text
                  style={[styles.clearButtonText, { color: colors.danger }]}
                >
                  Очистить всю статистику
                </Text>
                <View
                  style={[
                    styles.clearButtonIcon,
                    { backgroundColor: colors.danger },
                  ]}
                />
              </View>
              <Text style={[styles.clearButtonHint, { color: colors.muted }]}>
                Удалит все результаты тестирования
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  historyCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  clearButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    alignItems: "center",
  },
  clearButton: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    minHeight: 60, // Минимальная высота для хорошей области нажатия
  },
  clearButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  clearButtonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.8,
  },
  clearButtonHint: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 13,
    textAlign: "center",
    fontStyle: "italic",
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultProfession: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  resultScoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: "auto",
  },
  resultScore: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 6,
  },
  resultStatus: {
    fontSize: 13,
    fontWeight: "500",
  },
  resultDetail: {
    fontSize: 13,
  },
  resultDate: {
    fontSize: 12,
    fontStyle: "italic",
    marginLeft: "auto",
  },
});
