import { create } from "zustand";
import type { ExamResultCore } from "../types/exam";

interface ExamResultStore {
  result: ExamResultCore | null;
  setResult: (result: ExamResultCore) => void;
  clearResult: () => void;
}

export const useExamResultStore = create<ExamResultStore>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),
}));
