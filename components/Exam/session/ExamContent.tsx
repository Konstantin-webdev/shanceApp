import { useTheme } from "@/components/ThemeProvider";
import { IQuestionOption } from "@/components/types/questions";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ExamContentProps {
  questionText: string;
  options: IQuestionOption[];
  selectedAnswerId: string | null; // строка: 'a', 'b', ...
  isTimeUp: boolean;
  onAnswer: (answerId: string) => void;
}

export const ExamContent = ({
  questionText,
  options,
  selectedAnswerId,
  isTimeUp,
  onAnswer,
}: ExamContentProps) => {
  const { colors } = useTheme();


  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
      {/* Карточка вопроса */}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: 16,
          marginBottom: 16,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
          borderWidth: 2,
          borderColor: colors.primary,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.text,
            lineHeight: 24,
            textAlign: "center",
          }}
        >
          {questionText}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {options.map((answer, index) => {
          const isSelected = selectedAnswerId === answer.id;
          const letter = String.fromCharCode(65 + index); // A, B, C...
          return (
            <TouchableOpacity
              key={answer.id}
              style={{
                padding: 16,
                marginBottom: 12,
                borderRadius: 16,
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderWidth: 2,
                borderColor: isSelected ? colors.primary : colors.border,
                shadowColor: colors.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.2 : 0.05,
                shadowRadius: isSelected ? 8 : 4,
                elevation: isSelected ? 4 : 2,
              }}
              onPress={() => !isTimeUp && onAnswer(answer.id)}
              disabled={isTimeUp}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isSelected
                      ? "rgba(255, 255, 255, 0.2)"
                      : colors.background,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? "#FFFFFF" : colors.text,
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {letter}
                  </Text>
                </View>
                <Text
                  style={{
                    color: isSelected ? "#FFFFFF" : colors.text,
                    fontSize: 16,
                    lineHeight: 22,
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {answer.text}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
