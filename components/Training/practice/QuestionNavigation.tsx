import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";

interface QuestionNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  showPrev: boolean;
  showNext: boolean;
  showFinish: boolean;
  isNextDisabled: boolean;
  isFinishDisabled: boolean;
}

export function QuestionNavigation({
  onPrev,
  onNext,
  onFinish,
  showPrev,
  showNext,
  showFinish,
  isNextDisabled,
  isFinishDisabled,
}: QuestionNavigationProps) {
  const { colors } = useTheme();

  const styles = {
    container: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      paddingTop: 16,
      paddingBottom: 20,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    buttonsContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      marginBottom: 16,
    },
    button: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center" as const,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      gap: 8,
    },
    prevButton: {
      backgroundColor: colors.border,
      marginRight: 8,
    },
    nextButton: {
      backgroundColor: colors.primary,
      marginLeft: 8,
    },
    finishButton: {
      backgroundColor: colors.success,
      marginLeft: 8,
    },
    disabledButton: {
      backgroundColor: colors.muted,
      opacity: 0.6,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600" as const,
    },
    prevButtonText: {
      color: colors.text,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        {showPrev && (
          <TouchableOpacity
            style={[styles.button, styles.prevButton]}
            onPress={onPrev}
          >
            <ArrowLeft size={18} color={colors.text} />
            <Text style={[styles.buttonText, styles.prevButtonText]}>
              Назад
            </Text>
          </TouchableOpacity>
        )}

        {showNext && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.nextButton,
              isNextDisabled && styles.disabledButton,
            ]}
            onPress={onNext}
            disabled={isNextDisabled}
          >
            <Text style={styles.buttonText}>Далее</Text>
            <ArrowRight size={18} color={"#FFFFFF"} />
          </TouchableOpacity>
        )}

        {showFinish && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.finishButton,
              isFinishDisabled && styles.disabledButton,
            ]}
            onPress={onFinish}
            disabled={isFinishDisabled}
          >
            <Text style={styles.buttonText}>Завершить тренировку</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
