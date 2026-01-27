import { useTheme } from "@/components/ThemeProvider"; // Добавьте импорт
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ExamResult,
  formatDate,
  formatTime,
  getStatistics,
} from "../data/examResults";
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
  const { colors } = useTheme(); // Получаем цвета темы

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
      {/* Заголовок с именем пользователя */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.success }]}>
          Статистика
        </Text>
        {userName && (
          <Text style={[styles.userName, { color: colors.muted }]}>
            Пользователь: {userName}
          </Text>
        )}
        {selectedProfession && (
          <Text style={[styles.selectedProfession, { color: colors.primary }]}>
            Профессия: {selectedProfession.name}
          </Text>
        )}
      </View>

      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Ваши результаты обучения
      </Text>

      {/* Основная статистика */}
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

      {/* Дополнительная статистика */}
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

      {/* История попыток */}
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
          {filteredResults.length > 0 && (
            <TouchableOpacity onPress={onRefresh}>
              <Text style={[styles.refreshText, { color: colors.primary }]}>
                Обновить
              </Text>
            </TouchableOpacity>
          )}
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
          filteredResults.map((result) => {
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
                  <Text
                    style={[styles.resultProfession, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {result.professionName}
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
                  <Text style={[styles.resultDetail, { color: colors.muted }]}>
                    {result.userName || "Пользователь"}
                  </Text>
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
          })
        )}
      </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userName: {
    fontSize: 14,
    marginBottom: 4,
  },
  selectedProfession: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
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
  refreshText: {
    fontSize: 14,
    fontWeight: "500",
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
  },
});
