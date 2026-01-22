// app/components/ExamTimer.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";

interface ExamTimerProps {
  initialTime: number; // в секундах
  onTimeUp: () => void;
}

export default function ExamTimer({ initialTime, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  // Форматирование времени MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Процент оставшегося времени
  const progress = (timeLeft / initialTime) * 100;

  // Определяем цвет в зависимости от оставшегося времени
  let timerColor = "#34C759"; // зеленый
  if (timeLeft < initialTime * 0.3) timerColor = "#FF9500"; // оранжевый
  if (timeLeft < initialTime * 0.1) timerColor = "#FF3B30"; // красный

  return (
    <View style={styles.container}>
      <View style={styles.timerHeader}>
        <Clock size={20} color={timerColor} />
        <Text style={[styles.timeText, { color: timerColor }]}>
          {formatTime(timeLeft)}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor: timerColor,
            },
          ]}
        />
      </View>

      <Text style={styles.hint}>
        {timeLeft > 300 ? "Времени достаточно" : "Время заканчивается!"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  timerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeText: {
    fontSize: 28,
    fontWeight: "700",
    marginLeft: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#F2F2F7",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  hint: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
});
