import { useTheme } from "@/components/ThemeProvider";
import { TouchableOpacity, Text, View } from "react-native";

interface ExamFooterProps {
  isLastQuestion: boolean;
  isAnswered: boolean;
  isTimeUp: boolean;
  onNext: () => void;
  onFinish: () => void;
}

export const ExamFooter = ({
  isLastQuestion,
  isAnswered,
  isTimeUp,
  onNext,
  onFinish,
}: ExamFooterProps) => {
  const { colors } = useTheme();

  const buttonDisabled = !isAnswered || isTimeUp;

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: colors.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.border,
      }}
    >
      {isLastQuestion ? (
        <TouchableOpacity
          style={{
            backgroundColor: isAnswered
              ? isTimeUp
                ? colors.warning
                : colors.success
              : colors.border,
            paddingVertical: 18,
            paddingHorizontal: 24,
            borderRadius: 16,
            alignItems: "center",
            shadowColor: isAnswered ? colors.success : colors.border,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isAnswered ? 0.3 : 0,
            shadowRadius: 8,
            elevation: isAnswered ? 4 : 0,
          }}
          onPress={onFinish}
          disabled={buttonDisabled}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            {isTimeUp ? "Время вышло!" : "Завершить экзамен"}
          </Text>
          {isTimeUp && (
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: 14,
                marginTop: 4,
                opacity: 0.9,
              }}
            >
              Результаты будут сохранены
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: isAnswered ? colors.primary : colors.border,
            paddingVertical: 18,
            paddingHorizontal: 24,
            borderRadius: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 12,
            shadowColor: isAnswered ? colors.primary : colors.border,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isAnswered ? 0.3 : 0,
            shadowRadius: 8,
            elevation: isAnswered ? 4 : 0,
          }}
          onPress={onNext}
          disabled={buttonDisabled}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            Следующий вопрос
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
