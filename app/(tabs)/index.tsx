import { useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ProfessionInfo } from "@/components/ProfessionInfo";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTheme } from "@/components/ThemeProvider";

export default function TrainingScreen() {
  const router = useRouter();
  const { selectedProfession } = useProfessionStore();
  const { colors } = useTheme();

  // Стили пересоздаются только при изменении цветов темы
  const styles = useMemo(() => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
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
      opacity: 0.6,
    },
    startButtonText: {
      color: colors.background || "#FFFFFF",
      fontSize: 18,
      fontWeight: "600",
    },
    instructions: {
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
      backgroundColor: `${colors.primary}1A`, // 10% opacity
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
  }), [colors]);

  const handleStartTraining = () => {
    if (!selectedProfession) return;
    router.push({ pathname: "/training/topics" });
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title="Тренировка"
          titleColor={colors.tabTraining}
          subtitle="Начните подготовку по выбранной профессии"
        />

        <View style={styles.content}>
          {selectedProfession && (
            <ProfessionInfo profession={selectedProfession} />
          )}

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

          <TouchableOpacity
            style={[
              styles.startButton,
              (!selectedProfession) && styles.disabledButton,
            ]}
            onPress={handleStartTraining}
            disabled={!selectedProfession}
            activeOpacity={0.8}
          >
            <Play size={24} color={colors.background || "#FFFFFF"} />
            <Text style={styles.startButtonText}>
              Начать тренировку
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}