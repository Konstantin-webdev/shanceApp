// components/ThemeProvider.tsx
import { useThemeStore } from "@/app/store/useThemeStore";
import React, { createContext, useContext, useEffect } from "react";
import { Platform, StatusBar, useColorScheme } from "react-native";

// Определяем типы цветов
export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  border: string;
  primary: string;
  secondary: string;
  danger: string;
  warning: string;
  success: string;
  muted: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
};

// Светлая тема
const lightColors: ThemeColors = {
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#1C1C1E",
  border: "#E5E5EA",
  primary: "#007AFF",
  secondary: "#5856D6",
  danger: "#FF3B30",
  warning: "#FF9500",
  success: "#34C759",
  muted: "#8E8E93",
  tabBar: "#FFFFFF",
  tabBarActive: "#007AFF",
  tabBarInactive: "#8E8E93",
};

// Тёмная тема
const darkColors: ThemeColors = {
  background: "#000000",
  card: "#1C1C1E",
  text: "#FFFFFF",
  border: "#2C2C2E",
  primary: "#0A84FF",
  secondary: "#5E5CE6",
  danger: "#FF453A",
  warning: "#FF9F0A",
  success: "#30D158",
  muted: "#98989D",
  tabBar: "#1C1C1E",
  tabBarActive: "#0A84FF",
  tabBarInactive: "#98989D",
};

// Тип контекста
type ThemeContextType = {
  theme: "light" | "dark";
  themePreference: "light" | "dark" | "auto";
  colors: ThemeColors;
  isDark: boolean;
};

// Создаем контекст
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const { theme: themePreference } = useThemeStore();

  // Определяем текущую тему
  const currentTheme =
    themePreference === "auto" ? systemTheme || "light" : themePreference;

  const isDark = currentTheme === "dark";
  const colors = isDark ? darkColors : lightColors;

  // Применяем тему к статус-бару
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? "light-content" : "dark-content", true);

    // Для Android
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.background);
      StatusBar.setTranslucent(false);
    }
  }, [isDark, colors.background]);

  // Значение контекста
  const contextValue: ThemeContextType = {
    theme: currentTheme,
    themePreference,
    colors,
    isDark,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для использования темы
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
