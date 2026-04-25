// @/components/Training/topics/ResetProgressButton.tsx
import { useTheme } from "@/components/ThemeProvider";
import { clearProfessionProgress } from "@/utils/progressStorage";
import { Trash2 } from "lucide-react-native"; // ✅ Иконка из Lucide
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity } from "react-native";

interface ResetProgressButtonProps {
    professionId: number;
    onResetComplete?: () => void;
}

export function ResetProgressButton({
    professionId,
    onResetComplete,
}: ResetProgressButtonProps) {
    const { colors } = useTheme();
    const [isResetting, setIsResetting] = useState(false);

    const handleReset = () => {
        Alert.alert(
            "Сбросить прогресс?",
            "Все сохранённые ответы по этой профессии будут удалены. Это действие нельзя отменить.",
            [
                { text: "Отмена", style: "cancel" },
                {
                    text: "Сбросить",
                    style: "destructive",
                    onPress: async () => {
                        setIsResetting(true);
                        try {
                            await clearProfessionProgress(professionId);
                            onResetComplete?.();
                            Alert.alert("Готово", "Прогресс сброшен ✅");
                        } catch (error) {
                            Alert.alert("Ошибка", "Не удалось сбросить прогресс ❌");
                        } finally {
                            setIsResetting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <TouchableOpacity
            onPress={handleReset}
            disabled={isResetting}
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center", // ✅ Центрируем содержимое
                paddingVertical: 10,
                paddingHorizontal: 16,
                backgroundColor: colors.danger + "20",
                borderRadius: 8,
                alignSelf: "center", // ✅ Центрируем саму кнопку
                opacity: isResetting ? 0.6 : 1,
                gap: 8, // Отступ между иконкой и текстом
            }}
        >
            {isResetting ? (
                <ActivityIndicator size="small" color={colors.danger} />
            ) : (
                <Trash2 size={18} color={colors.danger} />
            )}
            <Text
                style={{
                    color: colors.danger,
                    fontSize: 14,
                    fontWeight: "600",
                }}
            >
                {isResetting ? "Сброс..." : "Сбросить прогресс"}
            </Text>
        </TouchableOpacity>
    );
}