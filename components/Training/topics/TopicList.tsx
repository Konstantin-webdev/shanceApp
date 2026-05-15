// components/Training/topics/TopicList.tsx
import { TopicCard } from "./TopicCard";

interface TopicListProps {
  topics: Array<{
    topicKey: string;
    range: { startIndex: number; endIndex: number };
  }>;
  topicsProgress: Record<string, { answered: number; total: number }>;
  onSelectTopic: (topicKey: string) => void;
}

export function TopicList({ topics, topicsProgress, onSelectTopic }: TopicListProps) {
  return (
    <>
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
    </>
  );
}