import { useTrainingProgressStore } from "@/components/store/trainingProgress";
import { useCallback } from "react";

export function useTrainingProgress() {
  const { saveProgress, getProgress, clearProgress, hasProgress } =
    useTrainingProgressStore();

  const getSavedProgress = useCallback(
    (professionId: number) => {
      return getProgress(professionId);
    },
    [getProgress],
  );

  const hasSavedProgress = useCallback(
    (professionId: number) => {
      return hasProgress(professionId);
    },
    [hasProgress],
  );

  const saveCurrentProgress = useCallback(
    (
      professionId: number,
      questionIndex: number,
      selectedAnswers: Record<number, string>,
    ) => {
      saveProgress(professionId, questionIndex, selectedAnswers);
    },
    [saveProgress],
  );

  const clearCurrentProgress = useCallback(
    (professionId: number) => {
      clearProgress(professionId);
    },
    [clearProgress],
  );

  return {
    getSavedProgress,
    hasSavedProgress,
    saveCurrentProgress,
    clearCurrentProgress,
  };
}
