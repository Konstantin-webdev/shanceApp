import { StyleSheet, Text, View } from "react-native";

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Статистика</Text>
      <Text style={styles.subtitle}>Ваши результаты обучения</Text>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Пройдено тестов</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>0%</Text>
          <Text style={styles.statLabel}>Средний результат</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Правильных ответов</Text>
        </View>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>История попыток:</Text>
        <Text style={styles.emptyText}>Пока нет данных</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#34c759",
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
  },
  statsCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#34c759",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  historyCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
});
