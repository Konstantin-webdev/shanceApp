import { useProfessionStore } from "@/app/store/useProfessionStore";
import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "expo-router";
import { ArrowRight, Clock } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfessionSelector from "../components/ProfessionSelector";

export default function ProfessionSelectionScreen() {
  const { selectedProfession } = useProfessionStore();
  const { colors } = useTheme();
  const router = useRouter();
  const [canSkip, setCanSkip] = useState(false);

  // Разрешаем пропуск через 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (selectedProfession) {
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.card,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.primary,
    },
    subtitle: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
      lineHeight: 20,
    },
    content: {
      padding: 20,
    },
    professionInfo: {
      marginTop: 20,
    },
    selectionCard: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    selectedTitle: {
      fontSize: 16,
      color: colors.muted,
      marginBottom: 8,
    },
    professionName: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary,
      textAlign: "center",
      marginBottom: 8,
    },
    professionCount: {
      fontSize: 16,
      color: colors.success,
      marginBottom: 24,
    },
    continueButton: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      gap: 8,
      width: "100%",
    },
    continueButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    emptySelection: {
      backgroundColor: colors.card,
      padding: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      marginBottom: 16,
    },
    skipButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    skipButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
    skipTimer: {
      paddingVertical: 10,
    },
    skipTimerText: {
      color: colors.muted,
      fontSize: 13,
      fontStyle: "italic",
    },
    bottomSpacer: {
      height: 20,
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
          <Text style={styles.title}>Выбор профессии</Text>
          <Text style={styles.subtitle}>
            Выберите профессию для персонализации обучения. Это поможет
            подобрать подходящие вопросы.
          </Text>
        </View>

        <View style={styles.content}>
          {/* Компонент выбора профессии */}
          <ProfessionSelector />

          <View style={styles.professionInfo}>
            {selectedProfession ? (
              <>
                <View style={styles.selectionCard}>
                  <Text style={styles.selectedTitle}>Вы выбрали:</Text>
                  <Text style={styles.professionName}>
                    {selectedProfession.name}
                  </Text>
                  <Text style={styles.professionCount}>
                    {selectedProfession.questionCount} вопросов
                  </Text>

                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                  >
                    <ArrowRight size={24} color="#FFFFFF" />
                    <Text style={styles.continueButtonText}>Продолжить</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.emptySelection}>
                <Clock size={40} color={colors.muted} />
                <Text style={styles.emptyTitle}>Профессия не выбрана</Text>
                <Text style={styles.emptyText}>
                  Выберите профессию из списка выше или
                </Text>

                {canSkip ? (
                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkip}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.skipButtonText}>пропустить сейчас</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.skipTimer}>
                    <Text style={styles.skipTimerText}>
                      Можно будет пропустить через 3 секунды...
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Отступ снизу */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
