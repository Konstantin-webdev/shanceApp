import { useTheme } from "@/components/ThemeProvider";
import { topicTitles } from "@/components/data/professionTopicMapping";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle, ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface TopicCardProps {
  topicKey: string;
  answered: number;
  total: number;
  onPress: () => void;
}

export function TopicCard({ topicKey, answered, total, onPress }: TopicCardProps) {
  const { colors } = useTheme();
  const percent = Math.round((answered / total) * 100) || 0;
  const title = topicTitles[topicKey] || topicKey;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ marginBottom: 12 }}
    >
      <View
        style={{ borderRadius: 12, overflow: "hidden", position: "relative" }}
      >
        {/* Градиентная заливка по прогрессу */}
        <LinearGradient
          colors={[colors.primary + "40", colors.primary + "10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${percent}%`,
          }}
        />
        {/* Основная карточка (поверх градиента) */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
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
            style={{ fontSize: 12, color: colors.muted, textAlign: "right" }}
          >
            {answered} из {total} вопросов ({percent}%)
            {percent === 100 && (
              <CheckCircle size={14} color={colors.success} />
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
