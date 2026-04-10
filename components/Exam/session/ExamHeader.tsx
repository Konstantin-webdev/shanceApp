import { useTheme } from "@/components/ThemeProvider";
import { ArrowLeft } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { ExamTimer } from "./ExamTimer";

interface ExamHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  onBackPress: () => void;
  durationMinutes: number;
  onTimeUp: () => void;
}

export const ExamHeader = ({
  currentIndex,
  totalQuestions,
  onBackPress,
  durationMinutes,
  onTimeUp,
}: ExamHeaderProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: colors.card,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap", // ← запрещаем перенос строки
        }}
      >
        {/* Кнопка назад - фиксированная ширина */}
        <TouchableOpacity
          onPress={onBackPress}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            flexShrink: 0, // ← не сжимается
          }}
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>

        {/* Таймер - занимает всё свободное место */}
        <View style={{ flex: 1, alignItems: "center", marginHorizontal: 8 }}>
          <ExamTimer durationMinutes={durationMinutes} onTimeUp={onTimeUp} />
        </View>

        {/* Счётчик вопросов - фиксированная ширина */}
        <View
          style={{
            width: 44,
            height: 44,
            justifyContent: "center",
            alignItems: "center",
            borderColor: colors.primary,
            flexShrink: 0, // ← не сжимается
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: 20,
              fontWeight: "700",
              textAlign: "center",
            }}
            numberOfLines={1} // ← не переносит текст на новую строку
            adjustsFontSizeToFit // ← уменьшает шрифт при нехватке места
          >
            {currentIndex + 1}/{totalQuestions}
          </Text>
        </View>
      </View>
    </View>
  );
};
