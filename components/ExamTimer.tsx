// components/ExamTimer.tsx
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ExamTimerProps {
  isActive: boolean;
  onTimeUp: () => void;
  onExamComplete: (timeSpent: number) => void;
}

const EXAM_DURATION = 10 * 60; // 10 минут

export default function ExamTimer({
  isActive,
  onTimeUp,
  onExamComplete,
}: ExamTimerProps) {
  const [remainingTime, setRemainingTime] = useState(EXAM_DURATION);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();

      const tick = () => {
        const now = Date.now();
        const timePassed = Math.floor((now - startTimeRef.current) / 1000);
        const newRemaining = Math.max(0, EXAM_DURATION - timePassed);

        setRemainingTime(newRemaining);
        setElapsedTime(timePassed);

        if (newRemaining <= 0) {
          onTimeUp();
          return;
        }

        timerRef.current = setTimeout(tick, 1000);
      };

      timerRef.current = setTimeout(tick, 1000);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (elapsedTime > 0) {
        onExamComplete(elapsedTime);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive, onTimeUp, onExamComplete]);

  const progress = elapsedTime / EXAM_DURATION; // Теперь progress = прошедшее время
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  // Инвертируем: strokeDashoffset растет по мере прохождения времени
  const strokeDashoffset = circumference * progress;

  // Цвет меняется от зеленого к красному по мере убывания времени
  const getTimerColor = () => {
    const timeProgress = remainingTime / EXAM_DURATION;
    if (timeProgress > 0.66) return "#34C759"; // зеленый
    if (timeProgress > 0.33) return "#FF9500"; // оранжевый
    return "#FF3B30"; // красный
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Svg width="50" height="50" viewBox="0 0 50 50">
        {/* Зеленый фон - начальное состояние */}
        <Circle
          cx="25"
          cy="25"
          r={radius}
          stroke="#E5E5EA"
          strokeWidth="3"
          fill="none"
        />

        {/* Инвертированный прогресс: "тает" по часовой стрелке */}
        <Circle
          cx="25"
          cy="25"
          r={radius}
          stroke={getTimerColor()}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 25 25)" // Начинаем с верхней точки
        />
      </Svg>
      <Text style={styles.timeText}>{formatTime(remainingTime)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  timeText: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
  },
});
