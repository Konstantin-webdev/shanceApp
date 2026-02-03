import { useTrainingProgressStore } from "@/components/store/trainingProgress";
import { useCallback } from "react";

export function useTrainingProgress(professionId?: string) {
  const { saveProgress, getProgress, clearProgress, hasProgress } =
    useTrainingProgressStore();

  // Получить сохраненный прогресс
  const getSavedProgress = useCallback(() => {
    if (!professionId) return null;
    return getProgress(parseInt(professionId));
  }, [professionId, getProgress]);

  // Проверить есть ли сохраненный прогресс
  const hasSavedProgress = useCallback(() => {
    if (!professionId) return false;
    return hasProgress(parseInt(professionId));
  }, [professionId, hasProgress]);

  // Сохранить текущий прогресс
  const saveCurrentProgress = useCallback(
    (questionIndex: number, selectedAnswers: Record<number, string>) => {
      if (!professionId) return;
      saveProgress(parseInt(professionId), questionIndex, selectedAnswers);
    },
    [professionId, saveProgress],
  );

  // Очистить прогресс
  const clearCurrentProgress = useCallback(() => {
    if (!professionId) return;
    clearProgress(parseInt(professionId));
  }, [professionId, clearProgress]);

  return {
    getSavedProgress,
    hasSavedProgress,
    saveCurrentProgress,
    clearCurrentProgress,
  };
}
