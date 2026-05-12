// constants/professionsList.ts
import { professionTopicMapping } from "@/components/data/professionTopicMapping";

// Список профессий: id и название (вручную, т.к. маппинг содержит только id)
export const professionsList = [
    { id: 1, name: "Слесарь-сантехник" },
    { id: 2, name: "Водитель автомобиля" },
    { id: 3, name: "Изолировщик-пленочник" },
    { id: 4, name: "Монтажник наружных трубопроводов" },
    { id: 16, name: "Электросварщик ручной сварки" },
    { id: 21, name: "Стропальщик" },
    { id: 25, name: "Уборщик помещений" },
    { id: 29, name: "Машинист бульдозера" },
    { id: 32, name: "Оператор заправочных станций" },
    { id: 35, name: "Машинист экскаватора" },
    { id: 38, name: "Электромонтер по ремонту ВЛЭП" },
    { id: 42, name: "Машинист крана автомобильного" },
    { id: 54, name: "Заведующий складом" },
    { id: 55, name: "Кладовщик" },
    { id: 73, name: "Машинист компрессорных установок" },
    { id: 78, name: "Электромонтер по ремонту электрооборудования" },
];

// Функция получения количества вопросов для профессии
export const getQuestionCountForProfession = (professionId: number): number => {
    const topics = professionTopicMapping[professionId];
    if (!topics) return 0;
    return topics.reduce((total, { range }) => {
        return total + (range.endIndex - range.startIndex + 1);
    }, 0);
};