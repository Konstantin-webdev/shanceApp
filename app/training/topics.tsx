
import { useTheme } from "@/components/ThemeProvider";
import { EmptyState } from "@/components/Training/topics/EmptyState";
import { ErrorState } from "@/components/Training/topics/ErrorState";
import { LoadingState } from "@/components/Training/topics/LoadingState";
import { OverallProgressCircle } from "@/components/Training/topics/OverallProgressCircle";
import { ResetProgressButton } from "@/components/Training/topics/ResetProgressButton";
import { TopicList } from "@/components/Training/topics/TopicList";
import { professionTopicMapping } from "@/components/data/professionTopicMapping";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TopicSelectionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { selectedProfession } = useProfessionStore();
  const professionId = selectedProfession?.id;
  const { topicsProgress, isLoading, error, refresh } = useTopicProgress(professionId);
  const topics = professionId ? professionTopicMapping[professionId] : [];

  // Вычисляем общий прогресс
  const overall = useMemo(() => {
    let totalQuestions = 0;
    let totalAnswered = 0;

    for (const { topicKey, range } of topics) {
      const totalInTopic = range.endIndex - range.startIndex + 1;
      totalQuestions += totalInTopic;
      const progress = topicsProgress[topicKey];
      if (progress) {
        totalAnswered += progress.answered;
      }
    }
    return { answered: totalAnswered, total: totalQuestions };
  }, [topics, topicsProgress]);

  const handleSelectTopic = (topicKey: string) => {
    router.push({
      pathname: "/training/practice",
      params: { topicKey },
    });
  };

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (!selectedProfession) {
    return <ErrorState error="Профессия не выбрана" />;
  }
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (topics.length === 0) return <EmptyState />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          {/* Верхняя панель с кнопкой назад и круговым прогрессом */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                gap: 8,
              }}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={colors.primary} />
              <Text style={{ fontSize: 16, fontWeight: "500", color: colors.primary }}>Назад</Text>
            </TouchableOpacity>

            {/* Круговой индикатор общего прогресса */}
            <OverallProgressCircle answered={overall.answered} total={overall.total} size={70} strokeWidth={6} />
          </View>

          {/* Список тем (уже без кнопки "Назад") */}
          <TopicList topics={topics} topicsProgress={topicsProgress} onSelectTopic={handleSelectTopic} />

          {/* Кнопка сброса прогресса */}
          {professionId && (
            <ResetProgressButton professionId={professionId} onResetComplete={refresh} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}