import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Award, XCircle } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";

interface ResultHeaderProps {
  passed: boolean;
  professionName: string;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({
  passed,
  professionName,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          passed
            ? { backgroundColor: isDark ? "#1C3C1C" : "#F0FFF4" }
            : { backgroundColor: isDark ? "#3C1C1C" : "#FFF0F0" },
        ]}
      >
        {passed ? (
          <Award size={80} color={colors.success} />
        ) : (
          <XCircle size={80} color={colors.danger} />
        )}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        {passed ? "Экзамен сдан!" : "Экзамен не сдан"}
      </Text>

      <Text style={[styles.professionName, { color: colors.muted }]}>
        {professionName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  professionName: {
    fontSize: 16,
    textAlign: "center",
  },
});
