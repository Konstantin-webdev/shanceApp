import { View, Text, TouchableOpacity } from "react-native";
import { AlertCircle, RefreshCw } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";

interface ErrorStateProps {
  error?: Error | string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({
  error,
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  const { colors } = useTheme();

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "Произошла неизвестная ошибка";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          alignItems: "center",
          maxWidth: 300,
        }}
      >
        {/* Иконка ошибки */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.danger + "20", // 20% opacity
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <AlertCircle size={32} color={colors.danger} />
        </View>

        {/* Заголовок */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Ошибка загрузки
        </Text>

        {/* Сообщение об ошибке */}
        <Text
          style={{
            fontSize: 14,
            color: colors.muted,
            textAlign: "center",
            marginBottom: 24,
            lineHeight: 20,
          }}
        >
          {errorMessage}
        </Text>

        {/* Кнопка повтора */}
        {showRetry && onRetry && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
              gap: 8,
            }}
            onPress={onRetry}
            activeOpacity={0.7}
          >
            <RefreshCw size={18} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Попробовать снова
            </Text>
          </TouchableOpacity>
        )}

        {/* Альтернативная кнопка без retry функции */}
        {showRetry && !onRetry && (
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
              textAlign: "center",
            }}
          >
            Проверьте подключение к интернету и перезапустите приложение
          </Text>
        )}
      </View>
    </View>
  );
}
