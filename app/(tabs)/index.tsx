import { useRouter } from "expo-router";
import { useState } from "react";

import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTheme } from "@/components/ThemeProvider";

import { ProfessionInfo } from "@/components/ProfessionInfo";
import { TrainingScreenStyles } from "@/styles/training/TrainingScreen.styles";
import { Play } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TrainingScreen() {
  const router = useRouter();
  const { selectedProfession } = useProfessionStore();
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme();
  const styles = TrainingScreenStyles(colors);

  const handleStartTraining = () => {
    if (!selectedProfession) return;
    router.push({
      pathname: "/training/topics",
    });
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Тренировка</Text>
          <Text style={styles.subtitle}>
            Начните подготовку по выбранной профессии
          </Text>
        </View>

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
        </View>
      </ScrollView>
    </View>
  );
}
