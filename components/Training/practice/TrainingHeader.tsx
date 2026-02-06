import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "expo-router";
import type { IProfession } from "@/components/types/profession";

interface TrainingHeaderProps {
  profession: IProfession;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export function TrainingHeader({
  profession,
  currentQuestionIndex,
  totalQuestions,
}: TrainingHeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = {
    container: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
    },
    infoContainer: {
      flex: 1,
      marginHorizontal: 12,
    },
    professionName: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
    },
    progressText: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 2,
    },
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color={colors.primary} />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.professionName} numberOfLines={1}>
          {profession.name}
        </Text>
        <Text style={styles.progressText}>
          Вопрос {currentQuestionIndex + 1} из {totalQuestions}
        </Text>
      </View>
    </View>
  );
}
