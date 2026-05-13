import { useTheme } from "@/components/ThemeProvider";
import { topicTitles } from "@/components/data/professionTopicMapping";
import { LinearGradient } from "expo-linear-gradient";
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
  const isComplete = percent === 100;
  const title = topicTitles[topicKey] || topicKey;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ marginBottom: 12 }}>
      <View style={{ borderRadius: 12, overflow: "hidden", position: "relative" }}>
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

        {/* Основная карточка — рамка зелёная если пройдена */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            borderWidth: 2,
            borderColor: isComplete ? colors.success : colors.border,
          }}
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
          </View>

          {/* Полоса прогресса */}
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

          {/* Текст прогресса: сколько пройдено из скольки */}
          <Text style={{ fontSize: 12, color: colors.muted }}>
            Пройдено: {answered} из {total} вопросов
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}