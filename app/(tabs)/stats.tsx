import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  getExamResults,
  getStatistics,
  ExamResult,
  formatDate,
  formatTime,
} from "../data/examResults";
import { useUserStore } from "../store/useUserStore";
import { useProfessionStore } from "../store/useProfessionStore";

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

  // Фильтрация по выбранной профессии
  const filteredResults = selectedProfession
    ? results.filter(
        (result) => result.professionId === selectedProfession.id.toString(),
      )
    : results;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка статистики...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Заголовок с именем пользователя */}
      <View style={styles.header}>
        <Text style={styles.title}>Статистика</Text>
        {userName && (
          <Text style={styles.userName}>Пользователь: {userName}</Text>
        )}
        {selectedProfession && (
          <Text style={styles.selectedProfession}>
            Профессия: {selectedProfession.name}
          </Text>
        )}
      </View>

      <Text style={styles.subtitle}>Ваши результаты обучения</Text>

      {/* Основная статистика */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalTests}</Text>
          <Text style={styles.statLabel}>Всего тестов</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.passedTests}</Text>
          <Text style={styles.statLabel}>Сдано успешно</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.averageScore.toFixed(0)}%</Text>
          <Text style={styles.statLabel}>Средний балл</Text>
        </View>
      </View>

      {/* Дополнительная статистика */}
      <View style={styles.additionalStats}>
        <View style={styles.additionalStatItem}>
          <Text style={styles.additionalStatValue}>{stats.totalCorrect}</Text>
          <Text style={styles.additionalStatLabel}>Правильных ответов</Text>
        </View>
        <View style={styles.additionalStatItem}>
          <Text style={styles.additionalStatValue}>
            {stats.accuracy.toFixed(1)}%
          </Text>
          <Text style={styles.additionalStatLabel}>Точность</Text>
        </View>
        <View style={styles.additionalStatItem}>
          <Text style={styles.additionalStatValue}>{stats.totalQuestions}</Text>
          <Text style={styles.additionalStatLabel}>Всего вопросов</Text>
        </View>
      </View>

      {/* История попыток */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>
            История попыток{" "}
            {selectedProfession ? `(${selectedProfession.name})` : ""}
          </Text>
          {filteredResults.length > 0 && (
            <TouchableOpacity onPress={onRefresh}>
              <Text style={styles.refreshText}>Обновить</Text>
            </TouchableOpacity>
          )}
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
          filteredResults.map((result) => (
            <View key={result.id} style={styles.resultItem}>
              {/* Первая строка: Профессия и результат */}
              <View style={styles.resultRow}>
                <Text style={styles.resultProfession} numberOfLines={1}>
                  {result.professionName}
                </Text>
                <View
                  style={[
                    styles.resultScoreBadge,
                    {
                      backgroundColor: result.passed
                        ? "#34C75920"
                        : "#FF3B3020",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.resultScore,
                      { color: result.passed ? "#34C759" : "#FF3B30" },
                    ]}
                  >
                    {result.score}%
                  </Text>
                  <Text
                    style={[
                      styles.resultStatus,
                      { color: result.passed ? "#34C759" : "#FF3B30" },
                    ]}
                  >
                    {result.passed ? "Сдано" : "Не сдано"}
                  </Text>
                </View>
              </View>

              {/* Вторая строка: Имя и дата */}
              <View style={styles.resultRow}>
                <Text style={styles.resultDetail}>
                  {result.userName || "Пользователь"}
                </Text>
                <Text style={styles.resultDate}>{formatDate(result.date)}</Text>
              </View>

              {/* Третья строка: Результаты и время */}
              <View style={styles.resultRow}>
                <Text style={styles.resultDetail}>
                  {result.correctAnswers} из {result.totalQuestions} правильных
                </Text>
                <Text style={styles.resultDetail}>
                  Время: {formatTime(result.timeSpent)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#34c759",
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  selectedProfession: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    shadowColor: "#000",
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#34c759",
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },
  additionalStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  additionalStatItem: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  additionalStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  additionalStatLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  historyCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  refreshText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyHint: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultProfession: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    flex: 1,
    marginRight: 10,
  },
  resultScoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultScore: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 6,
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  resultDetail: {
    fontSize: 14,
    color: "#8E8E93",
  },
  resultDate: {
    fontSize: 13,
    color: "#8E8E93",
    fontStyle: "italic",
  },
});
