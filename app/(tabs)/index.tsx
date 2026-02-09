import { useRouter } from "expo-router";
import { useState } from "react";

import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTheme } from "@/components/ThemeProvider";

import { TrainingScreenStyles } from "@/styles/training/TrainingScreen.styles";
import { Play } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrainingScreen() {
  const router = useRouter();
  const { selectedProfession } = useProfessionStore();
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme();
  const styles = TrainingScreenStyles(colors);

  const handleStartTraining = () => {
    if (isLoading || !selectedProfession) return;
    setIsLoading(true);
    router.push("/training/practice");
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  };

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

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
