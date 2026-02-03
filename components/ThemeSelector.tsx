import { useTheme } from "@/components/ThemeProvider"; // Добавьте этот импорт
import { Check, Moon, Smartphone, Sun } from "lucide-react-native";
import React from "react";
import {
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeStore } from "./store/useThemeStore";
import type { ThemeType } from "./store/useThemeStore";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  const { colors } = useTheme();

  const themeOptions: Array<{
    id: ThemeType;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      id: "light",
      label: "Светлая",
      icon: <Sun size={24} color={colors.warning} />,
      description: "Всегда светлая тема",
    },
    {
      id: "dark",
      label: "Тёмная",
      icon: <Moon size={24} color={colors.secondary} />,
      description: "Всегда тёмная тема",
    },
    {
      id: "auto",
      label: "Как в системе",
      icon: <Smartphone size={24} color={colors.success} />,
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

  const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 20,
    },
    currentTheme: {
      fontWeight: "600",
      color: colors.primary,
    },
    optionsContainer: {
      gap: 12,
    },
    optionCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    optionCardSelected: {
      backgroundColor: colors.primary + "20", // 20% opacity
      borderColor: colors.primary,
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
      color: colors.text,
      marginBottom: 2,
    },
    optionDescription: {
      fontSize: 14,
      color: colors.muted,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
    },
  });

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
                    <Check size={20} color={colors.primary} />
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

export default ThemeSelector;
