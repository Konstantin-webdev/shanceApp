import { IQuestion } from "./questions";

export interface ExamResultCore {
  correctAnswers: number;
  totalQuestions: number;
  professionId: number;
  professionName: string;
  score: number;
  passed: boolean;
  timeSpent: number;
  questionsData: IQuestion[];
  answersData: Record<number, string>;
  timeUp: boolean;
}

export interface PersistedExamResult extends ExamResultCore {
  id: number;
  date: string;
  userName: string | null;
}
