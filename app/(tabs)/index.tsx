import { useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProfessionSelector from "../../components/ProfessionSelector";
import { useProfessionStore } from "../store/useProfessionStore";

export default function TrainingScreen() {
  const router = useRouter();
  const { selectedProfession } = useProfessionStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTraining = () => {
    if (!selectedProfession) return;

    setIsLoading(true);
    router.push({
      pathname: "/training/[professionId]",
      params: { professionId: selectedProfession.id.toString() },
    });
    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Тренировка</Text>
        <Text style={styles.subtitle}>
          Выберите профессию и начните подготовку
        </Text>
      </View>

      <View style={styles.content}>
        {/* Выбор профессии */}
        <ProfessionSelector />

        <TouchableOpacity
          style={[
            styles.startButton,
            (!selectedProfession || isLoading) && styles.disabledButton,
          ]}
          onPress={handleStartTraining}
          disabled={!selectedProfession || isLoading}
          activeOpacity={0.8}
        >
          <Play size={24} color="#FFFFFF" />
          <Text style={styles.startButtonText}>
            {isLoading ? "Загрузка..." : "Начать тренировку"}
          </Text>
        </TouchableOpacity>

        {/* Инструкция */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Как это работает:</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>Выберите профессию</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>
              Отвечайте на вопросы с подсказками
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>
              Смотрите объяснения после каждого ответа
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>4</Text>
            <Text style={styles.instructionText}>Улучшайте свои знания</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  professionInfo: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  professionName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  professionStats: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 4,
  },
  professionHint: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    fontStyle: "italic",
  },
  startButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#C7C7CC",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  instructions: {
    marginTop: 32,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0F7FF",
    color: "#007AFF",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "600",
    marginRight: 12,
  },
  instructionText: {
    fontSize: 15,
    color: "#1C1C1E",
    flex: 1,
  },
});
