// hooks/useExamTime.ts
import { useRef } from "react";

export function useExamTime() {
  const startTimeRef = useRef(Date.now());

  // Получить прошедшие секунды
  const getElapsedSeconds = () => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  };

  // Форматировать время (MM:SS)
  const getFormattedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Получить оставшиеся секунды
  const getRemainingSeconds = (totalSeconds: number) => {
    const elapsed = getElapsedSeconds();
    return Math.max(totalSeconds - elapsed, 0);
  };

  return {
    getElapsedSeconds,
    getFormattedTime,
    getRemainingSeconds,
    startTime: startTimeRef.current,
  };
}
