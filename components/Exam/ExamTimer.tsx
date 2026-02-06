// components/ExamTimer.tsx
import { useTheme } from "@/components/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ExamTimerProps {
  remainingTime: number; // Оставшееся время в секундах
  isActive: boolean;
  onTimeUp: () => void;
}

const EXAM_DURATION = 10 * 60; // 10 минут

export default function ExamTimer({ remainingTime }: ExamTimerProps) {
  const { colors } = useTheme();

  // Прогресс: сколько времени уже прошло
  const elapsedTime = EXAM_DURATION - remainingTime;
  const progress = elapsedTime / EXAM_DURATION;

  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  // Для движения ПО часовой стрелке: strokeDashoffset уменьшается
  // Когда прогресс = 0 (время не прошло) → offset = полная окружность
  // Когда прогресс = 1 (время вышло) → offset = 0
  const strokeDashoffset = circumference - circumference * progress;

  // Цвет меняется от зеленого к красному по мере убывания времени
  const getTimerColor = () => {
    const timeProgress = remainingTime / EXAM_DURATION;
    if (timeProgress > 0.66) return colors.success; // зеленый
    if (timeProgress > 0.33) return colors.warning; // оранжевый
    return colors.danger; // красный
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Svg width="50" height="50" viewBox="0 0 50 50">
        {/* Фон круга */}
        <Circle
          cx="25"
          cy="25"
          r={radius}
          stroke={colors.border}
          strokeWidth="3"
          fill="none"
        />

        {/* Прогресс, движется ПО часовой стрелке */}
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
