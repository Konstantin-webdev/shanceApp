// screens/TrainingScreen.tsx
import { useTheme } from "@/components/ThemeProvider"; // Добавьте этот импорт
import { useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfessionStore } from "../store/useProfessionStore";
import { useUserStore } from "../store/useUserStore";

export default function TrainingScreen() {
  const router = useRouter();
  const { selectedProfession } = useProfessionStore();
  const { userName } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const { colors } = useTheme();

  useEffect(() => {
    if (userName) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [userName]);

  const handleStartTraining = () => {
    if (!selectedProfession) {
      alert("Пожалуйста, выберите профессию в настройках");
      return;
    }

    setIsLoading(true);
    router.push({
      pathname: "/training/[professionId]",
      params: { professionId: selectedProfession.id.toString() },
    });
    setIsLoading(false);
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
      marginTop: -30,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      margin: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      textAlign: "center",
      fontSize: 32,
      fontWeight: "bold",
      color: colors.primary,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      color: colors.muted,
      marginTop: 8,
    },
    content: {
      padding: 20,
    },
    professionCard: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    professionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    professionName: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 4,
    },
    professionStats: {
      fontSize: 15,
      color: colors.success,
      marginBottom: 8,
    },
    professionHint: {
      fontSize: 14,
      color: colors.muted,
      fontStyle: "italic",
    },
    settingsButton: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.primary + "10", // 10% opacity
      borderRadius: 8,
      alignSelf: "flex-start",
    },
    settingsButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
    startButton: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 12,
      marginTop: 24,
      gap: 8,
    },
    disabledButton: {
      backgroundColor: colors.muted,
    },
    startButtonText: {
      color: colors.background || "#FFFFFF",
      fontSize: 18,
      fontWeight: "600",
    },
    instructions: {
      marginTop: 32,
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    instructionsTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
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
      backgroundColor: colors.primary + "10", // 10% opacity
      color: colors.primary,
      textAlign: "center",
      lineHeight: 28,
      fontWeight: "600",
      marginRight: 12,
    },
    instructionText: {
      fontSize: 15,
      color: colors.text,
      flex: 1,
    },
    bottomSpacer: {
      height: 40,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Тренировка</Text>
          <Text style={styles.subtitle}>
            Начните подготовку по выбранной профессии
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.professionCard}>
            {selectedProfession ? (
              <>
                <Text style={styles.professionTitle}>Текущая профессия:</Text>
                <Text style={styles.professionName}>
                  {selectedProfession.name}
                </Text>
                <Text style={styles.professionStats}>
                  {selectedProfession.questionCount} вопросов для изучения
                </Text>
                <Text style={styles.professionHint}>
                  Чтобы изменить профессию, перейдите в настройки
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.professionTitle}>Профессия не выбрана</Text>
                <Text style={styles.professionHint}>
                  Выберите профессию в настройках, чтобы начать обучение
                </Text>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => router.push("/(tabs)/settings")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.settingsButtonText}>
                    Перейти в настройки
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.startButton,
              (!selectedProfession || isLoading) && styles.disabledButton,
            ]}
            onPress={handleStartTraining}
            disabled={!selectedProfession || isLoading}
            activeOpacity={0.8}
          >
            <Play size={24} color={colors.background || "#FFFFFF"} />
            <Text style={styles.startButtonText}>
              {isLoading ? "Загрузка..." : "Начать тренировку"}
            </Text>
          </TouchableOpacity>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>Как это работает:</Text>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>
                Выберите профессию в настройках
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>
                Отвечайте на вопросы с подсказками
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>Улучшайте свои знания</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>4</Text>
              <Text style={styles.instructionText}>
                Сохраняет свой прогресс
              </Text>
            </View>
          </View>

          {/* Отступ снизу */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
