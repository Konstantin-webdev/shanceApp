import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TrainingProgressState {
  progress: Record<
    number,
    {
      questionIndex: number;
      selectedAnswers: Record<number, string>;
      timestamp: number;
    }
  >;

  saveProgress: (
    professionId: number,
    questionIndex: number,
    selectedAnswers: Record<number, string>,
  ) => void;
  getProgress: (professionId: number) => {
    questionIndex: number;
    selectedAnswers: Record<number, string>;
  } | null;
  clearProgress: (professionId: number) => void;
  hasProgress: (professionId: number) => boolean;
}

export const useTrainingProgressStore = create<TrainingProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      saveProgress: (professionId, questionIndex, selectedAnswers) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [professionId]: {
              questionIndex,
              selectedAnswers,
              timestamp: Date.now(),
            },
          },
        }));
      },

      getProgress: (professionId) => {
        const state = get();
        return state.progress[professionId] || null;
      },

      clearProgress: (professionId) => {
        set((state) => {
          const newProgress = { ...state.progress };
          delete newProgress[professionId];
          return { progress: newProgress };
        });
      },

      hasProgress: (professionId) => {
        const state = get();
        return !!state.progress[professionId];
      },
    }),
    {
      name: "training-progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
