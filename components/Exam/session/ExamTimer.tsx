import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import { useTheme } from "@/components/ThemeProvider";

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export const ExamTimer = ({ durationMinutes, onTimeUp }: ExamTimerProps) => {
  const { colors } = useTheme();
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const intervalRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (!finishedRef.current) {
            finishedRef.current = true;
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Text style={{ fontSize: 18, fontWeight: "600", color: colors.primary }}>
      {formatTime(secondsLeft)}
    </Text>
  );
};
