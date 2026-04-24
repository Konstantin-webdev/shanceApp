// config/professionTopicMapping.ts

export type TopicRange = {
  startIndex: number; // с какого вопроса начинать (1-based)
  endIndex: number; // каким вопросом заканчивать (inclusive)
};

export type TopicMapping = {
  topicKey: string;
  range: TopicRange; // вместо questionCount
};

export const professionTopicMapping: Record<number, TopicMapping[]> = {
  // 1. Слесарь-сантехник
  1: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "pressure", range: { startIndex: 31, endIndex: 70 } },
    { topicKey: "siz", range: { startIndex: 71, endIndex: 100 } },
    { topicKey: "opas", range: { startIndex: 101, endIndex: 125 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 25 } },
  ],

  // 2. Водитель автомобиля
  2: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "pogruzka", range: { startIndex: 31, endIndex: 70 } },
    { topicKey: "siz", range: { startIndex: 71, endIndex: 100 } },
    { topicKey: "opas", range: { startIndex: 101, endIndex: 125 } },
    { topicKey: "first_aid", range: { startIndex: 126, endIndex: 150 } },
  ],

  // 3. Изолировщик-пленочник
  3: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "ognevye", range: { startIndex: 31, endIndex: 70 } },
    { topicKey: "siz", range: { startIndex: 71, endIndex: 110 } },
    { topicKey: "opas", range: { startIndex: 111, endIndex: 135 } },
    { topicKey: "first_aid", range: { startIndex: 136, endIndex: 150 } },
  ],

  // 4. Монтажник наружных трубопроводов
  4: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "pressure", range: { startIndex: 26, endIndex: 60 } },
    { topicKey: "pogruzka", range: { startIndex: 61, endIndex: 90 } },
    { topicKey: "siz", range: { startIndex: 91, endIndex: 120 } },
    { topicKey: "earthworks", range: { startIndex: 121, endIndex: 140 } },
    { topicKey: "first_aid", range: { startIndex: 141, endIndex: 150 } },
  ],

  // ... остальные профессии по аналогии
};

export const topicTitles: Record<string, string> = {
  first_aid: "Оказание первой помощи пострадавшим",
  general: "Общие вопросы охраны труда",
  earthworks: "Земляные работы",
  gasDangerous: "Газоопасные работы",
  siz: "Средства индивидуальной защиты",
  opas: "Вредные и опасные производственные факторы",
  pressure: "Работы под избыточным давлением",
  pogruzka: "Погрузочно-разгрузочные работы",
  ognevye: "Огневые работы",
};
