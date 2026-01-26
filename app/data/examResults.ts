import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../store/useUserStore";

export interface ExamResult {
  id: string;
  professionId: string;
  professionName: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  passed: boolean;
  date: string; // ISO string
  timeSpent: number; // в секундах
  userName: string | null;
}

const STORAGE_KEY = "@exam_results";

// Форматирование даты без date-fns
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Месяца на русском
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

// Форматирование времени
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const saveExamResult = async (
  result: Omit<ExamResult, "id" | "date" | "userName">,
): Promise<ExamResult> => {
  try {
    const { userName } = useUserStore.getState();

    const examResult: ExamResult = {
      ...result,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      userName: userName || "Пользователь",
    };

    const existingResults = await getExamResults();
    const updatedResults = [examResult, ...existingResults];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
    return examResult;
  } catch (error) {
    console.error("Error saving exam result:", error);
    throw error;
  }
};

export const getExamResults = async (): Promise<ExamResult[]> => {
  try {
    const resultsJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (!resultsJson) return [];

    const results = JSON.parse(resultsJson) as ExamResult[];

    // Сортируем по дате (новые первыми)
    return results.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error("Error getting exam results:", error);
    return [];
  }
};

export const clearExamResults = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing exam results:", error);
  }
};

export const getStatistics = async () => {
  const results = await getExamResults();

  const totalTests = results.length;
  const totalCorrect = results.reduce(
    (sum, result) => sum + result.correctAnswers,
    0,
  );
  const totalQuestions = results.reduce(
    (sum, result) => sum + result.totalQuestions,
    0,
  );
  const passedTests = results.filter((result) => result.passed).length;

  const averageScore =
    totalTests > 0
      ? results.reduce((sum, result) => sum + result.score, 0) / totalTests
      : 0;

  return {
    totalTests,
    averageScore,
    totalCorrect,
    totalQuestions,
    passedTests,
    accuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
    results,
  };
};

// Экспортируем утилиты форматирования
export { formatDate, formatTime };
