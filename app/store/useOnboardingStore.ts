// store/useOnboardingStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OnboardingState {
  hasSeenGreetingInThisSession: boolean;
  appStartTime: number | null;
  setHasSeenGreetingInThisSession: (value: boolean) => void;
  setAppStartTime: (time: number) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenGreetingInThisSession: false,
      appStartTime: null,

      setHasSeenGreetingInThisSession: (value: boolean) =>
        set({ hasSeenGreetingInThisSession: value }),

      setAppStartTime: (time: number) => set({ appStartTime: time }),

      resetOnboarding: () =>
        set({ hasSeenGreetingInThisSession: false, appStartTime: null }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Не сохраняем флаг hasSeenGreetingInThisSession при persist
      partialize: (state) => ({
        appStartTime: state.appStartTime,
      }),
    },
  ),
);
