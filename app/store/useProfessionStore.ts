import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Используем тот же интерфейс, что и в professions.ts
interface Profession {
  id: number;
  name: string;
  questionCount: number;
}

interface ProfessionStore {
  selectedProfession: Profession | null;
  setSelectedProfession: (profession: Profession | null) => void;
  clearProfession: () => void;
}

export const useProfessionStore = create<ProfessionStore>()(
  persist(
    (set) => ({
      selectedProfession: null,
      setSelectedProfession: (profession) =>
        set({ selectedProfession: profession }),
      clearProfession: () => set({ selectedProfession: null }),
    }),
    {
      name: "profession-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
