import ProfessionSelector from "@/components/ProfessionSelector";
import { StyleSheet, Text, View } from "react-native";

export default function ExamScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Экзамен</Text>
      <ProfessionSelector />
      <Text style={styles.subtitle}>Режим проверки знаний</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Особенности экзамена:</Text>
        <View style={styles.feature}>
          <Text style={styles.featureText}>• Ограничение по времени</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureText}>• Без подсказок</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureText}>• Оценка по результатам</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff3b30",
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  feature: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  featureText: {
    fontSize: 16,
    color: "#444",
  },
});
