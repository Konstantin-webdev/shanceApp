import { ScrollView } from "react-native";
import { TopicCard } from "./TopicCard";
import { ProfessionInfo } from "@/components/ProfessionInfo";
import { IProfession } from "@/components/types/profession";

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
  return (
    <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
      {profession && <ProfessionInfo profession={profession} />}

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
