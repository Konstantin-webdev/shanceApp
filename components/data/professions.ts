import { IProfession } from "../types/profession";

export const professions: IProfession[] = [
  ////Отправил Тертичному на ревью

  { id: 1, name: "Слесарь-сантехник", questionCount: 150 }, // refresh
  { id: 2, name: "Водитель автомобиля", questionCount: 150 }, // refresh
  { id: 38, name: "Электромонтер по ремонту ВЛЭП", questionCount: 150 }, // refresh
  { id: 16, name: "Электросварщик ручной сварки", questionCount: 150 }, // refresh
  {
    id: 78,
    name: "Электромонтер по ремонту электрооборудования",
    questionCount: 150,
  }, // refresh
  { id: 3, name: "Изоливщировщик-пленочник", questionCount: 150 }, // refresh

  ////Отправил Тертичному на ревью

  { id: 4, name: "Монтажник наружных трубопроводов", questionCount: 150 }, // refresh, word
  { id: 25, name: "Уборщик помещений", questionCount: 150 }, // refresh, word
  { id: 42, name: "Машинист крана автомобильного", questionCount: 150 }, //  refresh, word
  { id: 73, name: "Машинист компрессорных установок", questionCount: 150 }, // refresh, word
  { id: 29, name: "Машинист бульдозера", questionCount: 150 }, //  refresh, word
  { id: 35, name: "Машинист экскаватора", questionCount: 150 }, // refresh, word
  { id: 55, name: "Кладовщик", questionCount: 150 }, // refresh, word
  { id: 54, name: "Заведующий складом", questionCount: 145 }, //refresh, word
  { id: 32, name: "Оператор заправочных станций", questionCount: 150 }, //refresh, word
  { id: 21, name: "Стропальщик", questionCount: 150 }, // refresh, word

  /* 
  
  1. Водитель автомобиля
2. Заведующий складом
3. Изоливщировщик-пленочник
4. Кладовщик
5. Машинист бульдозера
6. Машинист компрессорных установок
7. Машинист крана автомобильного
8. Машинист экскаватора
9. Монтажник наружных трубопроводов
10. Оператор заправочных станций
11. Слесарь-сантехник
12. Стропальщик
13. Уборщик помещений
14. Электромонтер по ремонту ВЛЭП
15. Электромонтер по ремонту электрооборудования
16. Электросварщик ручной сварки
  
  { id: 4, name: "Оператор котельной", questionCount: 232 },
  { id: 20, name: "Слесарь-ремонтник", questionCount: 235 },
    { id: 3, name: "Слесарь АВР", questionCount: 237 }, 
  { id: 5, name: "Приборист", questionCount: 244 },
  { id: 58, name: "Экономист", questionCount: 57 },
  { id: 59, name: "Главный бухгалтер", questionCount: 57 },
  { id: 60, name: "Бухгалтер", questionCount: 57 },
  { id: 61, name: "Инспектор по кадрам", questionCount: 57 },
  { id: 65, name: "Медсестра", questionCount: 57 },
  { id: 66, name: "Завхоз", questionCount: 85 },
  { id: 75, name: "Слесарь по КИП и А", questionCount: 204 },
  { id: 24, name: "Инженер-программист", questionCount: 85 },
  { id: 40, name: "Кабельщик-спайщик", questionCount: 206 },

   { id: 9, name: "ПТБ Группа V", questionCount: 424 },
   { id: 1, name: "Специалист", questionCount: 609 },
  { id: 47, name: "Горничная", questionCount: 85 },
  { id: 10, name: "ПТБ Группа IV", questionCount: 356 },
  { id: 11, name: "ПТБ Группа III", questionCount: 241 },
  { id: 12, name: "ПТБ Группа II", questionCount: 83 },
  { id: 13, name: "Токарь", questionCount: 189 },
  { id: 15, name: "Рабочий ОРВУ", questionCount: 36 },
  { id: 18, name: "Маляр-штукатур", questionCount: 149 },
  { id: 19, name: "Каменщик", questionCount: 155 },
  { id: 17, name: "Лаборант хим. анализа", questionCount: 247 },
  { id: 22, name: "Плотник", questionCount: 168 },
  { id: 8, name: "Аккумуляторщик", questionCount: 185 }, 
   { id: 14, name: "Электромонтер ЭХЗ", questionCount: 237 },

  { id: 99, name: "Вспомогательная деятельность", questionCount: 49 },
  { id: 26, name: "Оператор тех. установок", questionCount: 206 },
  { id: 28, name: "Слесарь по холодильным установкам", questionCount: 175 },
  { id: 30, name: "Слесарь по авторемонту", questionCount: 219 },

 { id: 33, name: "Диспетчер АТХ", questionCount: 157 },
  { id: 34, name: "Слесарь-инструментальщик", questionCount: 201 },
  { id: 36, name: "Грузчик", questionCount: 151 },
  { id: 37, name: "Рабочий теплицы", questionCount: 156 },
  { id: 39, name: "Телеграфист", questionCount: 172 },

  { id: 98, name: "ПТБ Группа I", questionCount: 27 },
  { id: 41, name: "Электромонтер линейных сооружений", questionCount: 182 },
  { id: 45, name: "Машинист стирки", questionCount: 112 },

 { id: 56, name: "Приемосдатчик грузов", questionCount: 145 },
  { id: 57, name: "Охранник", questionCount: 127 }, 
{ id: 91, name: "ЕСУОТ и ПБ", questionCount: 276 }, */
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
