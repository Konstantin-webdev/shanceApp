import { useTheme } from "@/components/ThemeProvider";
import { EmptyState } from "@/components/Training/topics/EmptyState";
import { ErrorState } from "@/components/Training/topics/ErrorState";
import { LoadingState } from "@/components/Training/topics/LoadingState";
import { ResetProgressButton } from "@/components/Training/topics/ResetProgressButton";
import { TopicList } from "@/components/Training/topics/TopicList";
import { professionTopicMapping } from "@/components/data/professionTopicMapping";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TopicSelectionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { selectedProfession } = useProfessionStore();

  if (!selectedProfession) {
    return <ErrorState error="Профессия не выбрана" />;
  }

  const professionId = selectedProfession.id;
  const { topicsProgress, isLoading, error, refresh } = useTopicProgress(professionId);

  const topics = professionTopicMapping[professionId] || [];

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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (topics.length === 0) return <EmptyState />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView>
        <TopicList
          profession={selectedProfession}
          topics={topics}
          topicsProgress={topicsProgress}
          onSelectTopic={handleSelectTopic}
        />
        <View style={{ paddingBottom: 16 }} >
          <ResetProgressButton
            professionId={professionId}
            onResetComplete={refresh}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
