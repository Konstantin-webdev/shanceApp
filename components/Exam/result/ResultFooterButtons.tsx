import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Award, Home, RotateCcw } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";

interface ActionButtonsProps {
  onViewStats: () => void;
  onRetry: () => void;
  onGoHome: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onViewStats,
  onRetry,
  onGoHome,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.statsButton,
          { borderColor: colors.success },
        ]}
        onPress={onViewStats}
      >
        <Award size={20} color={colors.success} />
        <Text style={[styles.buttonText, { color: colors.success }]}>
          Статистика
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.retryButton,
          { backgroundColor: colors.warning },
        ]}
        onPress={onRetry}
      >
        <RotateCcw size={20} color="#FFFFFF" />
        <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>Снова</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.homeButton,
          { backgroundColor: colors.primary },
        ]}
        onPress={onGoHome}
      >
        <Home size={20} color="#FFFFFF" />
        <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
          На главную
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    minWidth: 120,
  },
  statsButton: {
    borderWidth: 1,
  },
  retryButton: {
    borderWidth: 0,
  },
  homeButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
