import { IProfession } from "../types/profession";

export const professions: IProfession[] = [
  { id: 38, name: "Электромонтер по ремонту ВЛЭП", questionCount: 201 }, //done
  {
    id: 78,
    name: "Электромонтер по ремонту электрооборудования",
    questionCount: 216,
  }, //done
  { id: 2, name: "Водитель", questionCount: 370 },
  { id: 20, name: "Слесарь-ремонтник", questionCount: 235 }, //done
  { id: 3, name: "Слесарь АВР", questionCount: 237 }, //done
  { id: 14, name: "Электромонтер ЭХЗ", questionCount: 237 },
  { id: 16, name: "Электрогазосварщик", questionCount: 295 },
  { id: 47, name: "Горничная", questionCount: 85 },
  { id: 25, name: "Уборщик", questionCount: 85 },
  { id: 42, name: "Крановщик", questionCount: 210 },
  { id: 35, name: "Машинист экскаватора", questionCount: 180 },
  { id: 29, name: "Бульдозерист", questionCount: 152 },
  { id: 73, name: "Машинист компрессорных установок", questionCount: 245 },
  { id: 1, name: "Специалист", questionCount: 609 },
  { id: 4, name: "Оператор котельной", questionCount: 232 },
  { id: 5, name: "Приборист", questionCount: 244 },
  { id: 9, name: "ПТБ Группа V", questionCount: 424 },
  { id: 10, name: "ПТБ Группа IV", questionCount: 356 },
  { id: 11, name: "ПТБ Группа III", questionCount: 241 },
  { id: 12, name: "ПТБ Группа II", questionCount: 83 },
  { id: 13, name: "Токарь", questionCount: 189 },
  { id: 15, name: "Рабочий ОРВУ", questionCount: 36 },
  { id: 18, name: "Маляр-штукатур", questionCount: 149 },
  { id: 19, name: "Каменщик", questionCount: 155 },
  { id: 21, name: "Стропальщик", questionCount: 236 },
  { id: 17, name: "Лаборант хим. анализа", questionCount: 247 },
  { id: 22, name: "Плотник", questionCount: 168 },
  { id: 8, name: "Аккумуляторщик", questionCount: 185 },
  { id: 24, name: "Инженер-программист", questionCount: 85 },
  { id: 99, name: "Вспомогательная деятельность", questionCount: 49 },
  { id: 26, name: "Оператор тех. установок", questionCount: 206 },
  { id: 28, name: "Слесарь по холодильным установкам", questionCount: 175 },
  { id: 30, name: "Слесарь по авторемонту", questionCount: 219 },
  { id: 32, name: "Оператор АЗС", questionCount: 96 },
  { id: 33, name: "Диспетчер АТХ", questionCount: 157 },
  { id: 34, name: "Слесарь-инструментальщик", questionCount: 201 },
  { id: 36, name: "Грузчик", questionCount: 151 },
  { id: 37, name: "Рабочий теплицы", questionCount: 156 },
  { id: 39, name: "Телеграфист", questionCount: 172 },
  { id: 40, name: "Кабельщик-спайщик", questionCount: 206 },
  { id: 98, name: "ПТБ Группа I", questionCount: 27 },
  { id: 41, name: "Электромонтер линейных сооружений", questionCount: 182 },
  { id: 45, name: "Машинист стирки", questionCount: 112 },
  { id: 54, name: "Зав. складом", questionCount: 145 },
  { id: 55, name: "Кладовщик", questionCount: 85 },
  { id: 56, name: "Приемосдатчик грузов", questionCount: 145 },
  { id: 57, name: "Охранник", questionCount: 127 },
  { id: 58, name: "Экономист", questionCount: 57 },
  { id: 59, name: "Главный бухгалтер", questionCount: 57 },
  { id: 60, name: "Бухгалтер", questionCount: 57 },
  { id: 61, name: "Инспектор по кадрам", questionCount: 57 },
  { id: 65, name: "Медсестра", questionCount: 57 },
  { id: 66, name: "Завхоз", questionCount: 85 },
  { id: 75, name: "Слесарь по КИП и А", questionCount: 204 },
  { id: 91, name: "ЕСУОТ и ПБ", questionCount: 276 },
];

export const searchProfessions = (searchText: string): IProfession[] => {
  if (!searchText.trim()) return professions;

  const lowerSearch = searchText.toLowerCase();
  return professions.filter((profession) =>
    profession.name.toLowerCase().includes(lowerSearch),
  );
};

export const getProfessionById = (id: number): IProfession | undefined => {
  return professions.find((profession) => profession.id === id);
};
