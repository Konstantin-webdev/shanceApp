import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Home } from "lucide-react-native";

export default function TrainingCompletionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    correctAnswers: string;
    totalQuestions: string;
    professionName: string;
  }>();

  const correctAnswers = parseInt(params.correctAnswers || "0");
  const totalQuestions = parseInt(params.totalQuestions || "0");
  const professionName = params.professionName || "";

  const percentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  const handleGoHome = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color="#34C759" />
        </View>

        <Text style={styles.heading}>Тренировка завершена!</Text>

        <Text style={styles.subheading}>{professionName}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{correctAnswers}</Text>
            <Text style={styles.statLabel}>Правильно</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalQuestions}</Text>
            <Text style={styles.statLabel}>Всего вопросов</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{percentage}%</Text>
            <Text style={styles.statLabel}>Результат</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGoHome}>
          <Home size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Вернуться на главный</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0FFF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
    textAlign: "center",
  },
  subheading: {
    fontSize: 18,
    color: "#8E8E93",
    marginBottom: 32,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
