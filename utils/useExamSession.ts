// @/utils/useExamSession.ts
import type { IQuestion } from "@/components/types/questions";
import { questionsByTopic } from "@/components/data/questionsByTopic";
import { professionTopicMapping } from "@/components/data/professionTopicMapping";
import { useCallback, useEffect, useState } from "react";

export const useExamSession = (professionId: number) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 🔀 Фишер-Йейтс для перемешивания
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 📦 Сбор вопросов для экзамена из всех тем профессии
  const getExamQuestions = useCallback((profId: number, count: number): IQuestion[] => {
    const topics = professionTopicMapping[profId];
    if (!topics) return [];

    const pool: IQuestion[] = [];

    for (const { topicKey, range } of topics) {
      const topicQuestions = questionsByTopic[topicKey];
      if (!topicQuestions?.length) continue;

      // 🔹 Применяем диапазон (1-based → 0-based) с защитой
      const start = Math.max(0, range.startIndex - 1);
      const end = Math.min(topicQuestions.length, range.endIndex);

      pool.push(...topicQuestions.slice(start, end));
    }

    // 🔹 Перемешиваем и берём нужное количество
    return shuffleArray(pool).slice(0, count);
  }, []);

  // Инициализация экзамена
  useEffect(() => {
    if (!professionId) return;

    setIsLoading(true);
    try {
      const examQuestions = getExamQuestions(professionId, 10).map((question) => ({
        ...question,
        options: shuffleArray(question.options), // 👈 перемешиваем варианты ответов
      }));
      setQuestions(examQuestions);
      setCurrentIndex(0);
      setAnswers({});
    } catch (error) {
      console.error("Failed to load exam questions:", error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [professionId, getExamQuestions]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isAnswered = !!answers[currentIndex];

  const handleAnswer = useCallback((answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: answerId,
    }));
  }, [currentIndex]);

  const nextQuestion = useCallback(() => {
    if (isLastQuestion || !isAnswered) return;
    setCurrentIndex((prev) => prev + 1);
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