// components/ExamTimer.tsx (МЕНЯЕТСЯ ТОЛЬКО ЦВЕТ РАМКИ)
import { Clock } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp?: () => void;
}

const MINUTE_COLORS = [
  "#3B82F6", // 10 мин
  "#5D95F8", // 9 мин
  "#7EA9FA", // 8 мин
  "#A0BCFB", // 7 мин
  "#C1D0FD", // 6 мин
  "#E3E3FE", // 5 мин
  "#FEE2E2", // 4 мин
  "#FCA5A5", // 3 мин
  "#F87171", // 2 мин
  "#EF4444", // 1 мин
  "#DC2626", // 0 мин
];

export function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    durationMinutes * 60,
  );
  const [currentMinute, setCurrentMinute] = useState(durationMinutes);
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  // Анимация изменения цвета рамки
  useEffect(() => {
    const minutes = Math.floor(remainingSeconds / 60);

    if (minutes !== currentMinute && minutes >= 0) {
      setCurrentMinute(minutes);

      const newColorIndex = 10 - minutes;

      // Плавная анимация изменения цвета рамки
      Animated.timing(borderColorAnim, {
        toValue: 1,
        duration: 1000, // 1 секунда на переход
        useNativeDriver: false,
      }).start(() => {
        setCurrentColorIndex(newColorIndex);
        borderColorAnim.setValue(0);
      });
    }

    if (remainingSeconds <= 0 && onTimeUp) {
      onTimeUp();
    }
  }, [remainingSeconds, currentMinute]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  // Только рамка меняет цвет
  const animatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      MINUTE_COLORS[currentColorIndex],
      MINUTE_COLORS[Math.max(0, 10 - Math.floor(remainingSeconds / 60))] ||
        MINUTE_COLORS[10],
    ],
  });

  // Цвет иконки и текста НЕ меняется (остается первый цвет)
  const staticColor = MINUTE_COLORS[0];

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 3, // Толстая рамка для заметности
        borderColor: animatedBorderColor, // ТОЛЬКО РАМКА МЕНЯЕТ ЦВЕТ
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Иконка - цвет не меняется */}
      <Clock size={20} color={staticColor} />

      {/* Текст - цвет не меняется */}
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: staticColor, // Цвет не меняется
            letterSpacing: 1,
          }}
        >
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </Text>
      </View>
    </Animated.View>
  );
}
