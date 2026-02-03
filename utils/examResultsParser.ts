// utils/examResultsParser.ts
import { UnknownOutputParams } from "expo-router";

export interface ParsedExamResults {
  correctAnswers: number;
  totalQuestions: number;
  professionName: string;
  professionId: string;
  score: number;
  passed: boolean;
  timeSpent: number;
  questionsData: any[];
  answersData: Record<number, string>;
  saved: boolean;
}

// Хелпер для безопасного извлечения строкового параметра
const getStringParam = (params: UnknownOutputParams, key: string): string => {
  const value = params[key];
  if (Array.isArray(value)) {
    return value[0] || "";
  }
  return value || "";
};

export const parseExamResults = (
  params: UnknownOutputParams,
): ParsedExamResults => {
  const parseNumber = (value: string, defaultValue = 0) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const parseJSON = <T>(value: string, defaultValue: T): T => {
    try {
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      console.warn("Failed to parse JSON:", value);
      return defaultValue;
    }
  };

  const correctAnswersStr = getStringParam(params, "correctAnswers");
  const totalQuestionsStr = getStringParam(params, "totalQuestions");
  const professionNameStr = getStringParam(params, "professionName");
  const professionIdStr = getStringParam(params, "professionId");
  const scoreStr = getStringParam(params, "score");
  const passedStr = getStringParam(params, "passed");
  const timeSpentStr = getStringParam(params, "timeSpent");
  const questionsDataStr = getStringParam(params, "questionsData");
  const answersDataStr = getStringParam(params, "answersData");
  const savedStr = getStringParam(params, "saved");

  return {
    correctAnswers: parseNumber(correctAnswersStr),
    totalQuestions: parseNumber(totalQuestionsStr),
    professionName: professionNameStr,
    professionId: professionIdStr,
    score: parseNumber(scoreStr),
    passed: passedStr === "true",
    timeSpent: parseNumber(timeSpentStr),
    questionsData: parseJSON(questionsDataStr, []),
    answersData: parseJSON(answersDataStr, {}),
    saved: savedStr === "true",
  };
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
