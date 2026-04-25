// config/professionTopicMapping.ts

export type TopicRange = {
  startIndex: number; // 1-based индекс в массиве темы
  endIndex: number;   // inclusive
};

export type TopicMapping = {
  topicKey: string;
  range: TopicRange;
};

// 📊 Реальные длины массивов:
// first_aid: 44 | general: 116 | pressure: 71 | siz: 101 | opas: 197
// pogruzka: 75 | ognevye: 62 | earthworks: 87 | gasDangerous: 80
// montageOborudovaniya: 40 | valkaLesa: 67

export const professionTopicMapping: Record<number, TopicMapping[]> = {
  // ─────────────────────────────────────────────────────────────
  // ✅ Уже готовые профессии (исправлены диапазоны)
  // ─────────────────────────────────────────────────────────────

  // 1. Слесарь-сантехник (~150 вопросов)
  1: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },      // 30 из 116
    { topicKey: "pressure", range: { startIndex: 1, endIndex: 40 } },      // 40 из 71
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },           // 30 из 101
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },          // 30 из 197
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },     // 20 из 44
  ], // Итого: 150

  // 2. Водитель автомобиля (~150)
  2: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "pogruzka", range: { startIndex: 1, endIndex: 40 } },      // 40 из 75
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 3. Изолировщик-пленочник (~150)
  3: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "ognevye", range: { startIndex: 1, endIndex: 40 } },       // 40 из 62
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 4. Монтажник наружных трубопроводов (~150)
  4: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "pressure", range: { startIndex: 1, endIndex: 35 } },
    { topicKey: "pogruzka", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "siz", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "earthworks", range: { startIndex: 1, endIndex: 20 } },    // 20 из 87
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 15 } },
  ], // Итого: 150

  // ─────────────────────────────────────────────────────────────
  // 🔧 Новые профессии (диапазоны в пределах реальных массивов)
  // ─────────────────────────────────────────────────────────────

  // 16. Электросварщик ручной сварки (~150)
  16: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "ognevye", range: { startIndex: 1, endIndex: 40 } },
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 21. Стропальщик (~150)
  21: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "pogruzka", range: { startIndex: 1, endIndex: 45 } },      // 45 из 75
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 25. Уборщик помещений (~150)
  25: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "gasDangerous", range: { startIndex: 1, endIndex: 40 } },  // 40 из 80
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 29. Машинист бульдозера (~150)
  29: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "earthworks", range: { startIndex: 1, endIndex: 45 } },    // 45 из 87
    { topicKey: "pogruzka", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "siz", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 25 } },     // 25 из 44
  ], // Итого: 150

  // 32. Оператор заправочных станций (~150)
  32: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "gasDangerous", range: { startIndex: 1, endIndex: 45 } },  // 45 из 80
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 35. Машинист экскаватора (~150)
  35: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "earthworks", range: { startIndex: 1, endIndex: 45 } },
    { topicKey: "pogruzka", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "siz", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 25 } },
  ], // Итого: 150

  // 38. Электромонтер по ремонту ВЛЭП (~150)
  38: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "montageOborudovaniya", range: { startIndex: 1, endIndex: 40 } }, // 40 из 40 (все!)
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 42. Машинист крана автомобильного (~150)
  42: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "pogruzka", range: { startIndex: 1, endIndex: 45 } },
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 25 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 54. Заведующий складом (~145)
  54: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "pogruzka", range: { startIndex: 1, endIndex: 35 } },
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 145

  // 55. Кладовщик (~150)
  55: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "pogruzka", range: { startIndex: 1, endIndex: 40 } },
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 73. Машинист компрессорных установок (~150)
  73: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "pressure", range: { startIndex: 1, endIndex: 40 } },
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150

  // 78. Электромонтер по ремонту электрооборудования (~150)
  78: [
    { topicKey: "general", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "montageOborudovaniya", range: { startIndex: 1, endIndex: 40 } },
    { topicKey: "siz", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "opas", range: { startIndex: 1, endIndex: 30 } },
    { topicKey: "first_aid", range: { startIndex: 1, endIndex: 20 } },
  ], // Итого: 150
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
