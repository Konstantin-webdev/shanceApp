import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/components/ThemeProvider";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { professionTopicMapping } from "@/components/data/professionTopicMapping";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { LoadingState } from "@/components/Training/topics/LoadingState";
import { ErrorState } from "@/components/Training/topics/ErrorState";
import { EmptyState } from "@/components/Training/topics/EmptyState";
import { TopicList } from "@/components/Training/topics/TopicList";

export default function TopicSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ professionId: string }>();
  const { colors } = useTheme();
  const { selectedProfession } = useProfessionStore();

  if (!selectedProfession) {
    return <ErrorState error="Профессия не выбрана" />;
  }

  const professionId = selectedProfession.id;
  const { topicsProgress, isLoading, error } = useTopicProgress(professionId);

  const topics = professionTopicMapping[professionId] || [];

  const handleSelectTopic = (topicKey: string) => {
    router.push({
      pathname: "/training/practice",
      params: { topicKey },
    });
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />; // Можно добавить
  if (topics.length === 0) return <EmptyState />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopicList
        profession={selectedProfession}
        topics={topics}
        topicsProgress={topicsProgress}
        onSelectTopic={handleSelectTopic}
      />
    </SafeAreaView>
  );
}
