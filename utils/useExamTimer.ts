import { useState, useEffect, useRef } from "react";

export const useExamTimer = (
    durationMinutes: number,
    onTimeUp: () => void,
) => {
    const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        // Старт таймера
        timerRef.current = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000) as unknown as number;

        // Очистка
        return () => {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
            }
        };
    }, [onTimeUp]);

    // Форматирование времени
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return {
        remainingSeconds,
        minutes,
        seconds,
        formattedTime: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    };
};