import { useRouter } from "expo-router";
import { AlertCircle, Award, Clock, Play } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfessionStore } from "../store/useProfessionStore";

export default function ExamScreen() {
  const router = useRouter();
  const { selectedProfession } = useProfessionStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartExam = () => {
    if (!selectedProfession) return;

    setIsLoading(true);
    router.push({
      pathname: "/exam/[professionId]",
      params: { professionId: selectedProfession.id.toString() },
    });
    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Экзамен</Text>
        <Text style={styles.subtitle}>Режим проверки знаний</Text>
      </View>

      <View style={styles.content}>

        {/* Информация о профессии (если выбрана) */}
        {selectedProfession && (
          <View style={styles.professionInfo}>
            <Text style={styles.professionName}>{selectedProfession.name}</Text>
            <Text style={styles.professionStats}>
              {selectedProfession.questionCount} вопросов доступно
            </Text>
          </View>
        )}

        {/* Кнопка начала экзамена */}
        <TouchableOpacity
          style={[
            styles.startButton,
            (!selectedProfession || isLoading) && styles.disabledButton,
          ]}
          onPress={handleStartExam}
          disabled={!selectedProfession || isLoading}
          activeOpacity={0.8}
        >
          <Play size={24} color="#FFFFFF" />
          <Text style={styles.startButtonText}>
            {isLoading ? "Загрузка..." : "Начать экзамен"}
          </Text>
        </TouchableOpacity>

        {/* Карточка с особенностями экзамена */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Особенности экзамена:</Text>

          <View style={styles.featureItem}>
            <Clock size={20} color="#FF3B30" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Ограничение по времени</Text>
              <Text style={styles.featureDescription}>
                20 минут на 10 вопросов
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <AlertCircle size={20} color="#FF9500" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Без подсказок</Text>
              <Text style={styles.featureDescription}>
                Проверка реальных знаний
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Award size={20} color="#007AFF" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Сертификат</Text>
              <Text style={styles.featureDescription}>
                Результат сохраняется в истории
              </Text>
            </View>
          </View>

          <View style={styles.rules}>
            <Text style={styles.rulesTitle}>Правила:</Text>
            <Text style={styles.ruleText}>• 10 случайных вопросов</Text>
            <Text style={styles.ruleText}>• Таймер 20 минут</Text>
            <Text style={styles.ruleText}>
              • Нет возможности исправить ответ
            </Text>
            <Text style={styles.ruleText}>• Минимальный балл: 70%</Text>
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
    color: "#FF3B30",
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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE5E5",
  },
  professionName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  professionStats: {
    fontSize: 14,
    color: "#FF3B30",
    marginTop: 4,
  },
  startButton: {
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 30,
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
  featuresCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE5E5",
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: "#8E8E93",
  },
  rules: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 8,
    marginLeft: 4,
  },
});
