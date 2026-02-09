// components/ExamTimer.tsx (САМЫЙ ПРОСТОЙ)
import { useTheme } from "@/components/ThemeProvider";
import { Clock } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp?: () => void;
}

export function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
  const { colors } = useTheme();
  const [startTime] = useState(Date.now()); // Время начала
  const [currentTime, setCurrentTime] = useState(Date.now()); // Текущее время

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now()); // Просто обновляем текущее время
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Вычисляем оставшееся время
  const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
  const remainingSeconds = Math.max(durationMinutes * 60 - elapsedSeconds, 0);

  // Проверяем время
  useEffect(() => {
    if (remainingSeconds <= 0 && onTimeUp) {
      onTimeUp();
    }
  }, [remainingSeconds, onTimeUp]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeColor = remainingSeconds < 60 ? colors.danger : colors.text;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Clock size={20} color={timeColor} />
      <Text style={{ fontSize: 18, fontWeight: "600", color: timeColor }}>
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </Text>
    </View>
  );
}
