import { useTheme } from "@/components/ThemeProvider";
import { Clock } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfessionSelector from "../components/ProfessionSelector";

export default function ProfessionSelectionScreen() {
  const { colors } = useTheme();

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
      textAlign: "center",
      fontSize: 28,
      fontWeight: "bold",
      color: colors.primary,
      paddingBlock: 16,
    },
    subtitle: {
      textAlign: "center",
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
          <ProfessionSelector />
          <View style={styles.professionInfo}>
            <View style={styles.emptySelection}>
              <Clock size={40} color={colors.muted} />
              <Text style={styles.emptyTitle}>Профессия не выбрана</Text>
              <Text style={styles.emptyText}>
                Выберите профессию из списка выше
              </Text>
            </View>
          </View>
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
