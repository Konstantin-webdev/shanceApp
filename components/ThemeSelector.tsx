import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Appearance,
} from "react-native";
import { Moon, Sun, Smartphone, Check } from "lucide-react-native";
import { ThemeType, useThemeStore } from "@/app/store/useThemeStore";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  const themeOptions: Array<{
    id: ThemeType;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      id: "light",
      label: "Светлая",
      icon: <Sun size={24} color="#FF9500" />,
      description: "Всегда светлая тема",
    },
    {
      id: "dark",
      label: "Тёмная",
      icon: <Moon size={24} color="#5856D6" />,
      description: "Всегда тёмная тема",
    },
    {
      id: "auto",
      label: "Как в системе",
      icon: <Smartphone size={24} color="#34C759" />,
      description: "Следует за настройками телефона",
    },
  ];

  const getSystemTheme = () => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === "dark" ? "dark" : "light";
  };

  const getActiveTheme = () => {
    if (theme === "auto") {
      return getSystemTheme();
    }
    return theme;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Тема приложения</Text>
      <Text style={styles.subtitle}>
        Текущая тема:{" "}
        <Text style={styles.currentTheme}>
          {theme === "auto"
            ? `Как в системе (${getSystemTheme() === "dark" ? "тёмная" : "светлая"})`
            : theme === "dark"
              ? "Тёмная"
              : "Светлая"}
        </Text>
      </Text>

      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => {
          const isSelected = theme === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
                { borderColor: isSelected ? "#007AFF" : "#E5E5EA" },
              ]}
              onPress={() => setTheme(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  {option.icon}
                  <View style={styles.optionTexts}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <View style={styles.checkmark}>
                    <Check size={20} color="#007AFF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 20,
  },
  currentTheme: {
    fontWeight: "600",
    color: "#007AFF",
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  optionCardSelected: {
    backgroundColor: "#F0F7FF",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionTexts: {
    marginLeft: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: "#8E8E93",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E6F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ThemeSelector;
