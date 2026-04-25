// components/data/questionsByTopic.ts
import { IQuestion } from "@/components/types/questions";
import { EARTHWORKS_questions } from "./olimpoks/earthworks";
import { FIRST_AID_questions } from "./olimpoks/first_aid";
import { GAS_DANGEROUS_questions } from "./olimpoks/gasDangerous";
import { GENERAL_questions } from "./olimpoks/general";
import { MontageOborudovaniya_questions } from "./olimpoks/montageOborudovaniya";
import { OGNEVYE_questions } from "./olimpoks/ognevye";
import { OPAS_questions } from "./olimpoks/opas";
import { POGRUZKA_questions } from "./olimpoks/pogruzka";
import { PRESSURE_questions } from "./olimpoks/pressure";
import { SIZ_questions } from "./olimpoks/siz";
import { ValkaLesa_questions } from "./olimpoks/valkaLesa";

// Все вопросы по темам
export const questionsByTopic: Record<string, IQuestion[]> = {
  first_aid: FIRST_AID_questions,
  general: GENERAL_questions,
  pressure: PRESSURE_questions,
  siz: SIZ_questions,
  opas: OPAS_questions,
  pogruzka: POGRUZKA_questions,
  ognevye: OGNEVYE_questions,
  earthworks: EARTHWORKS_questions,
  gasDangerous: GAS_DANGEROUS_questions,
  montageOborudovaniya: MontageOborudovaniya_questions,
  valkaLesa: ValkaLesa_questions,
};

// Функция получения вопросов по профессии и теме с учетом диапазона
export const getQuestionsByProfessionAndTopic = (
  professionId: number,
  topicKey: string,
): IQuestion[] => {
  // Импортируем professionTopicMapping динамически, чтобы избежать циклических зависимостей
  const {
    professionTopicMapping,
  } = require("@/components/data/professionTopicMapping");

  // Находим маппинг для профессии
  const topicMapping = professionTopicMapping[professionId]?.find(
    (mapping: any) => mapping.topicKey === topicKey,
  );

  if (!topicMapping) return [];

  // Получаем все вопросы по теме
  const allTopicQuestions = questionsByTopic[topicKey];
  if (!allTopicQuestions) return [];

  // Выбираем нужный диапазон (индексы в JS 0-based)
  const { startIndex, endIndex } = topicMapping.range;
  return allTopicQuestions.slice(startIndex - 1, endIndex);
};
