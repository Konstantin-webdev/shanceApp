// hooks/useExamHints.ts
import { useProfessionStore } from "@/components/store/useProfessionStore";

export const useExamHints = () => {
    const { selectedProfession } = useProfessionStore();

    // Проверяем, нужна ли подсказка для текущей профессии
    const shouldShowHint = selectedProfession?.id === 38 || selectedProfession?.id === 78;

    // Функция для добавления подсказки к правильному ответу
    const addHintToAnswer = (answerText: string, isCorrect: boolean): string => {
        if (!shouldShowHint || !isCorrect) {
            return answerText;
        }

        // Удаляем последний символ (если он есть) и добавляем точку с запятой
        if (answerText.length > 0) {
            const textWithoutLastChar = answerText.slice(0, -1);
            return textWithoutLastChar + ";";
        }

        return answerText;
    };

    // Функция для обработки всех вариантов ответа
    const getHintsForQuestion = (
        options: { id: string; text: string }[],
        correctAnswerId: string
    ) => {
        return options.map(option => ({
            ...option,
            text: addHintToAnswer(option.text, option.id === correctAnswerId),
        }));
    };

    return {
        shouldShowHint,
        addHintToAnswer,
        getHintsForQuestion,
    };
};