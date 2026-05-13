import { useTheme } from "@/components/ThemeProvider";
import { IProfession } from "@/components/types/profession";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { TopicCard } from "./TopicCard";

interface TopicListProps {
  profession: IProfession | null;
  topics: Array<{
    topicKey: string;
    range: { startIndex: number; endIndex: number };
  }>;
  topicsProgress: Record<string, { answered: number; total: number }>;
  onSelectTopic: (topicKey: string) => void;
}

export function TopicList({
  profession,
  topics,
  topicsProgress,
  onSelectTopic,
}: TopicListProps) {
  const { colors } = useTheme();

  const BackToHome = () => {
    router.push("/(tabs)");
  };

  return (
    <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
      {/* Кнопка "Назад" — прямоугольная */}
      <TouchableOpacity
        onPress={BackToHome}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 20,
          alignSelf: "flex-start", // чтобы кнопка не растягивалась
          gap: 8,
        }}
        activeOpacity={0.7}
      >
        <ArrowLeft size={20} color={colors.primary} />
        <Text style={{ fontSize: 16, fontWeight: "500", color: colors.primary }}>
          Назад
        </Text>
      </TouchableOpacity>

      {/* Список тем */}
      {topics.map(({ topicKey, range }) => {
        const total = range.endIndex - range.startIndex + 1;
        const progress = topicsProgress[topicKey] || { answered: 0, total };
        return (
          <TopicCard
            key={topicKey}
            topicKey={topicKey}
            answered={progress.answered}
            total={progress.total}
            onPress={() => onSelectTopic(topicKey)}
          />
        );
      })}
    </ScrollView>
  );
}