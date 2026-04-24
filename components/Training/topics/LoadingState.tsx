import { View, Text } from "react-native";
import { useTheme } from "@/components/ThemeProvider";

export function LoadingState() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: colors.text }}>Загрузка прогресса...</Text>
    </View>
  );
}
