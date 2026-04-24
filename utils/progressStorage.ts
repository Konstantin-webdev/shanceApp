// utils/progressStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// Функция для создания ключа
const getProgressKey = (
  professionId: number,
  topicKey: string,
  questionNumber: number,
) => {
  return `progress_${professionId}_${topicKey}_${questionNumber}`;
};

// Функция для сохранения прогресса вопроса
export const saveQuestionProgress = async (
  professionId: number,
  topicKey: string,
  questionNumber: number,
) => {
  try {
    const key = getProgressKey(professionId, topicKey, questionNumber);
    await AsyncStorage.setItem(key, "true");
    console.log(`✅ Сохранен вопрос: ${key}`);
  } catch (error) {
    console.error("Ошибка сохранения:", error);
  }
};

// Функция для проверки отвечен ли конкретный вопрос
export const isQuestionAnswered = async (
  professionId: number,
  topicKey: string,
  questionNumber: number,
): Promise<boolean> => {
  try {
    const key = getProgressKey(professionId, topicKey, questionNumber);
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error("Ошибка проверки:", error);
    return false;
  }
};

// Функция для получения количества отвеченных вопросов по теме
export const getTopicProgress = async (
  professionId: number,
  topicKey: string,
  totalQuestions: number,
): Promise<number> => {
  try {
    let answered = 0;

    // Проверяем каждый вопрос в теме
    for (let i = 1; i <= totalQuestions; i++) {
      const key = getProgressKey(professionId, topicKey, i);
      const value = await AsyncStorage.getItem(key);
      if (value !== null) answered++;
    }

    return answered;
  } catch (error) {
    console.error("Ошибка получения прогресса:", error);
    return 0;
  }
};

// Функция для получения прогресса всех тем профессии
export const getAllTopicsProgress = async (
  professionId: number,
  topics: Array<{
    topicKey: string;
    range: { startIndex: number; endIndex: number };
  }>,
): Promise<Record<string, { answered: number; total: number }>> => {
  const progress: Record<string, { answered: number; total: number }> = {};

  for (const { topicKey, range } of topics) {
    const total = range.endIndex - range.startIndex + 1;
    const answered = await getTopicProgress(professionId, topicKey, total);
    progress[topicKey] = { answered, total };
  }

  return progress;
};
