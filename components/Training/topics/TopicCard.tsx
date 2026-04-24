import { TouchableOpacity, View, Text } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";

interface TopicCardProps {
  title: string;
  answered: number;
  total: number;
  onPress: () => void;
}

export function TopicCard({ title, answered, total, onPress }: TopicCardProps) {
  const { colors } = useTheme();
  const percent = Math.round((answered / total) * 100) || 0;

  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
            flex: 1,
          }}
        >
          {title}
        </Text>
        <ChevronRight size={20} color={colors.muted} />
      </View>

      <View
        style={{
          height: 8,
          backgroundColor: colors.border,
          borderRadius: 4,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <View
          style={{
            height: "100%",
            backgroundColor: colors.primary,
            borderRadius: 4,
            width: `${percent}%`,
          }}
        />
      </View>

      <Text
        style={{
          fontSize: 12,
          color: colors.muted,
          textAlign: "right",
        }}
      >
        {answered} из {total} вопросов ({percent}%)
        {percent === 100 && " ✅"}
      </Text>
    </TouchableOpacity>
  );
}
