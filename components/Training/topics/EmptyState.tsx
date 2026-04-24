import { View, Text } from "react-native";
import { BookOpen } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";

export function EmptyState() {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: "center", paddingVertical: 40 }}>
      <BookOpen size={48} color={colors.muted} />
      <Text style={{ fontSize: 16, color: colors.muted }}>Темы не найдены</Text>
    </View>
  );
}
