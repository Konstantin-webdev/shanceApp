import { IQuestion } from "../../types/questions";
import { questionsProfession2 } from "./profession2";
import { questionsProfession20 } from "./profession20";
import { questionsProfession3 } from "./profession3";
import { questionsProfession38 } from "./profession38";
import { questionsProfession78 } from "./profession78";

export const questionsByProfession: Record<number, IQuestion[]> = {
  38: questionsProfession38,
  78: questionsProfession78,
  3: questionsProfession3,
  20: questionsProfession20,
  2: questionsProfession2,
};

export const getQuestionsByProfessionId = (
  professionId: number,
): IQuestion[] => {
  return questionsByProfession[professionId] || [];
};

export const hasQuestionsForProfession = (professionId: number): boolean => {
  return !!questionsByProfession[professionId];
};

export const getQuestionCountForProfession = (professionId: number): number => {
  return questionsByProfession[professionId]?.length || 0;
};
