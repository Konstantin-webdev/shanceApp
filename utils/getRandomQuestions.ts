// utils/getExamQuestions.ts
import { getQuestionsByProfessionId } from "@/components/data/questions";
import type { IQuestion } from "@/components/types/questions";

// Функция для добавления подсказок (просто добавляем точку с запятой)
const addHintToAnswer = (text: string, shouldAddHint: boolean): string => {
    if (!shouldAddHint) {
        return text;
    }

    // Просто добавляем точку с запятой в конец
    // Но сначала убираем уже существующую точку с запятой в конце
    const trimmed = text.trim();

    // Если уже заканчивается на точку с запятой, не добавляем еще одну
    if (trimmed.endsWith(';')) {
        return text;
    }

    // Проверяем последний символ
    const lastChar = trimmed[trimmed.length - 1];

    // Если последний символ - знак препинания (кроме точки с запятой)
    if (/[.,!?:]/.test(lastChar)) {
        // Заменяем его на точку с запятой
        return trimmed.slice(0, -1) + ';';
    }

    // Иначе просто добавляем точку с запятой
    // Но добавляем не впритык, а с пробелом или без?
    // Лучше без пробела - менее заметно
    return trimmed + ';';
};

// Функция для добавления подсказок ко всем вопросам
const addHintsToQuestions = (
    questions: IQuestion[],
    shouldAddHint: boolean
): IQuestion[] => {
    if (!shouldAddHint) {
        return questions;
    }

    return questions.map(question => ({
        ...question,
        options: question.options.map(option => ({
            ...option,
            text: addHintToAnswer(
                option.text,
                option.id === question.correctAnswer
            ),
        })),
    }));
};

// Основная функция (без изменений)
export const getExamQuestions = (
    professionId: number,
    count: number = 10,
): IQuestion[] => {
    const allQuestions = getQuestionsByProfessionId(professionId);

    if (allQuestions.length === 0) {
        return [];
    }

    // Проверяем, нужны ли подсказки
    const shouldAddHint = professionId === 38 || professionId === 78;

    // 1. Берем нужное количество случайных вопросов
    const selectedQuestions = allQuestions.length <= count
        ? [...allQuestions].sort(() => Math.random() - 0.5)
        : getRandomQuestions(allQuestions, count);

    // 2. Добавляем подсказки если нужно
    const questionsWithHints = addHintsToQuestions(selectedQuestions, shouldAddHint);

    return questionsWithHints;
};

// Вспомогательная функция для выбора случайных вопросов
const getRandomQuestions = (questions: IQuestion[], count: number): IQuestion[] => {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
};