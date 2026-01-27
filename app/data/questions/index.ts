import { IQuestion } from "../../types/questions";
import { questionsProfession20 } from "./profession20";
import { questionsProfession3 } from "./profession3";
import { questionsProfession38 } from "./profession38";
import { questionsProfession78 } from "./profession78";

// Структура данных: ID профессии -> массив вопросов
export const questionsByProfession: Record<number, IQuestion[]> = {
  38: questionsProfession38,
  78: questionsProfession78,
  3: questionsProfession3,
  20: questionsProfession20,
};

/**
 * Получить вопросы для профессии
 * @param professionId ID профессии
 * @returns Массив вопросов или пустой массив
 */
export const getQuestionsByProfessionId = (
  professionId: number,
): IQuestion[] => {
  return questionsByProfession[professionId] || [];
};

/**
 * Проверить наличие вопросов для профессии
 * @param professionId ID профессии
 * @returns true если вопросы есть
 */
export const hasQuestionsForProfession = (professionId: number): boolean => {
  return !!questionsByProfession[professionId];
};

/**
 * Получить количество вопросов для профессии
 * @param professionId ID профессии
 * @returns Количество вопросов (0 если нет)
 */
export const getQuestionCountForProfession = (professionId: number): number => {
  return questionsByProfession[professionId]?.length || 0;
};
