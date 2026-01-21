import ProfessionSelector from "@/components/ProfessionSelector";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TrainingScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Тренировка</Text>
        <ProfessionSelector />
        <Text style={styles.subtitle}>Здесь будут вопросы для тренировки</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Выберите профессию → начнется тренировка
          </Text>
          <Text style={styles.hint}>Режим с подсказками и объяснениями</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
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
  cardText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  hint: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});
