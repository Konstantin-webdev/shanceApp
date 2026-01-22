import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IProfession } from "../types/profession";

interface ProfessionStore {
  selectedProfession: IProfession | null;
  setSelectedProfession: (profession: IProfession | null) => void;
}

export const useProfessionStore = create<ProfessionStore>()(
  persist(
    (set) => ({
      selectedProfession: null,
      setSelectedProfession: (profession) =>
        set({ selectedProfession: profession }),
    }),
    {
      name: "profession-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
