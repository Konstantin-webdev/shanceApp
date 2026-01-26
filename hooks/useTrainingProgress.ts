// hooks/useTrainingProgress.ts
import { useTrainingProgressStore } from "@/app/store/trainingProgress";
import { useState, useCallback, useEffect } from "react";

export function useTrainingProgress(professionId?: string) {
  const [hasCheckedProgress, setHasCheckedProgress] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  const { saveProgress, getProgress, clearProgress, hasProgress } =
    useTrainingProgressStore();

  const checkSavedProgress = useCallback(() => {
    if (!professionId) return;

    const id = parseInt(professionId);
    if (hasProgress(id)) {
      setShowContinueModal(true);
    }

    setHasCheckedProgress(true);
  }, [professionId, hasProgress]);

  const handleContinue = useCallback(() => {
    if (!professionId) return null;

    const id = parseInt(professionId);
    return getProgress(id);
  }, [professionId, getProgress]);

  const handleRestart = useCallback(() => {
    if (!professionId) return;

    const id = parseInt(professionId);
    clearProgress(id);
  }, [professionId, clearProgress]);

  const saveCurrentProgress = useCallback(
    (questionIndex: number, selectedAnswers: Record<number, string>) => {
      if (!professionId || !hasCheckedProgress) return;

      const id = parseInt(professionId);
      saveProgress(id, questionIndex, selectedAnswers);
    },
    [professionId, hasCheckedProgress, saveProgress],
  );

  const hasSavedProgress = useCallback(() => {
    if (!professionId) return false;
    return hasProgress(parseInt(professionId));
  }, [professionId, hasProgress]);

  return {
    hasCheckedProgress,
    showContinueModal,
    setShowContinueModal,
    checkSavedProgress,
    handleContinue,
    handleRestart,
    saveCurrentProgress,
    hasSavedProgress,
    clearProgress,
  };
}
