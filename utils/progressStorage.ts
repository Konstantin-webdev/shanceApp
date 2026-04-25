// @/utils/progressStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROGRESS_PREFIX = "training_progress_";

// 🔑 Уникальный ключ: профессия + тема
const getProgressKey = (professionId: number | string, topicKey: string) => {
  return `${PROGRESS_PREFIX}${String(professionId)}_${topicKey}`;
};

/**
 * Сохраняет прогресс: индекс последнего отвеченного вопроса
 * @param answeredCount - количество отвеченных вопросов (1-based)
 */
export const saveTopicProgress = async (
  professionId: number | string,
  topicKey: string,
  answeredCount: number
) => {
  try {
    const key = getProgressKey(professionId, topicKey);
    await AsyncStorage.setItem(key, answeredCount.toString());
  } catch (error) {
    console.error("❌ Ошибка сохранения прогресса:", error);
  }
};

/**
 * Получает количество отвеченных вопросов по теме
 * @returns число от 0 до total
 */
export const getTopicProgress = async (
  professionId: number | string,
  topicKey: string,
  total: number
): Promise<number> => {
  try {
    const key = getProgressKey(professionId, topicKey);
    const value = await AsyncStorage.getItem(key);
    if (!value) return 0;

    const answered = parseInt(value, 10);
    // Защита от некорректных данных
    return isNaN(answered) ? 0 : Math.min(answered, total);
  } catch (error) {
    console.error("❌ Ошибка чтения прогресса:", error);
    return 0;
  }
};

/**
 * Получает прогресс по всем темам профессии
 */
export const getAllTopicsProgress = async (
  professionId: number | string,
  topics: Array<{
    topicKey: string;
    range: { startIndex: number; endIndex: number };
  }>
): Promise<Record<string, { answered: number; total: number }>> => {
  const result: Record<string, { answered: number; total: number }> = {};

  for (const { topicKey, range } of topics) {
    const total = range.endIndex - range.startIndex + 1;
    const answered = await getTopicProgress(professionId, topicKey, total);
    result[topicKey] = { answered, total };
  }

  return result;
};

/**
 * Очищает прогресс по теме (при перезапуске тренировки)
 */
export const clearTopicProgress = async (
  professionId: number | string,
  topicKey: string
) => {
  try {
    const key = getProgressKey(professionId, topicKey);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("❌ Ошибка очистки прогресса:", error);
  }
};

export const clearProfessionProgress = async (
  professionId: number | string
): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const prefix = `${PROGRESS_PREFIX}${String(professionId)}_`;
    const professionKeys = keys.filter((key) => key.startsWith(prefix));

    if (professionKeys.length > 0) {
      await AsyncStorage.multiRemove(professionKeys);
      console.log(`🗑️ Удалено прогресса для профессии ${professionId}: ${professionKeys.length} записей`);
    }
  } catch (error) {
    console.error("❌ Ошибка при очистке прогресса профессии:", error);
  }
};