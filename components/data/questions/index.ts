import { IQuestion } from "../../types/questions";
import { questionsProfession16 } from "./profession16";
import { questionsProfession2 } from "./profession2";
import { questionsProfession20 } from "./profession20";
import { questionsProfession21 } from "./profession21";
import { questionsProfession25 } from "./profession25";
import { questionsProfession29 } from "./profession29";
import { questionsProfession3 } from "./profession3";
import { questionsProfession32 } from "./profession32";
import { questionsProfession35 } from "./profession35";
import { questionsProfession38 } from "./profession38";
import { questionsProfession42 } from "./profession42";
import { questionsProfession54 } from "./profession54";
import { questionsProfession55 } from "./profession55";
import { questionsProfession73 } from "./profession73";
import { questionsProfession78 } from "./profession78";

export const questionsByProfession: Record<number, IQuestion[]> = {
  38: questionsProfession38,
  78: questionsProfession78,
  3: questionsProfession3,
  20: questionsProfession20,
  2: questionsProfession2,
  16: questionsProfession16,
  25: questionsProfession25,
  42: questionsProfession42,
  35: questionsProfession35,
  73: questionsProfession73,
  29: questionsProfession29,
  55: questionsProfession55,
  54: questionsProfession54,
  32: questionsProfession32,
  21: questionsProfession21,
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
