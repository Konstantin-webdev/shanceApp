import { useEffect, useState, useCallback } from "react";
import { getAllTopicsProgress } from "@/utils/progressStorage";
import { professionTopicMapping } from "@/components/data/professionTopicMapping";

type TopicProgress = {
  topicKey: string;
  answered: number;
  total: number;
};

export function useTopicProgress(professionId: number) {
  const [topicsProgress, setTopicsProgress] = useState<Record<string, TopicProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // ✅ Триггер для обновления

  // ✅ Функция загрузки — вынесена отдельно для повторного вызова
  const loadProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const topics = professionTopicMapping[professionId] || [];

      if (topics.length === 0) {
        setTopicsProgress({});
        return;
      }

      const allProgress = await getAllTopicsProgress(professionId, topics);

      const progressMap: Record<string, TopicProgress> = {};
      for (const { topicKey } of topics) {
        const topic = topics.find((t) => t.topicKey === topicKey);
        const total = topic
          ? topic.range.endIndex - topic.range.startIndex + 1
          : 0;

        progressMap[topicKey] = allProgress[topicKey]
          ? { topicKey, answered: allProgress[topicKey].answered, total }
          : { topicKey, answered: 0, total };
      }

      setTopicsProgress(progressMap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [professionId]);

  // ✅ Загружаем при монтировании И при изменении refreshKey
  useEffect(() => {
    loadProgress();
  }, [loadProgress, refreshKey]);

  // ✅ Функция для принудительного обновления
  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return { topicsProgress, isLoading, error, refresh }; // ✅ Возвращаем refresh
}