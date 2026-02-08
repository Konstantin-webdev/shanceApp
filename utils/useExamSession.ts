
import type { IQuestion } from "@/components/types/questions";
import { getExamQuestions } from "@/utils/getRandomQuestions";
import { useCallback, useEffect, useState } from "react";

export const useExamSession = (professionId: number) => {
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Инициализация экзамена
    useEffect(() => {
        if (!professionId) return;

        setIsLoading(true);
        try {
            // Используем новую функцию
            const examQuestions = getExamQuestions(professionId, 10);
            setQuestions(examQuestions);
            setCurrentIndex(0);
            setAnswers({});
        } catch (error) {
            console.error("Failed to load questions:", error);
        } finally {
            setIsLoading(false);
        }
    }, [professionId]);

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const isAnswered = !!answers[currentIndex];

    const handleAnswer = useCallback((answerId: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentIndex]: answerId,
        }));
    }, [currentIndex]);

    const nextQuestion = useCallback(() => {
        if (isLastQuestion || !isAnswered) return;
        setCurrentIndex(prev => prev + 1);
    }, [isLastQuestion, isAnswered]);

    const getResults = useCallback(() => {
        if (questions.length === 0) return null;

        let correctCount = 0;

        questions.forEach((question, index) => {
            const userAnswer = answers[index];
            if (userAnswer && userAnswer === question.correctAnswer) {
                correctCount++;
            }
        });

        const total = questions.length;
        const score = Math.round((correctCount / total) * 100);

        return {
            correctCount,
            total,
            score,
            passed: score >= 70,
            answers: { ...answers },
            questions: [...questions],
        };
    }, [questions, answers]);

    return {
        questions,
        currentQuestion,
        currentIndex,
        answers,
        isLoading,
        isLastQuestion,
        isAnswered,
        handleAnswer,
        nextQuestion,
        getResults,
        totalQuestions: questions.length,
    };
};