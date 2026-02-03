import React, { createContext, useContext, useEffect } from "react";
import { Platform, StatusBar, useColorScheme } from "react-native";
import { useThemeStore } from "./store/useThemeStore";

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

  tabTraining: string;
  tabExam: string;
  tabStats: string;
  tabSettings: string;
};

// Светлая тема - нейтральные приглушенные цвета
const lightColors: ThemeColors = {
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#1C1C1E",
  border: "#E5E5EA",
  primary: "#3B82F6", // Синий основной
  secondary: "#8B5CF6", // Фиолетовый
  danger: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  muted: "#9CA3AF", // Серый вместо яркого

  tabBar: "#FFFFFF",
  tabBarActive: "#3B82F6", // Синий для активного состояния
  tabBarInactive: "#9CA3AF",

  // Цвета для табов - спокойные нейтральные
  tabTraining: "#3B82F6", // Приглушенный синий - обучение
  tabExam: "#8B5CF6", // Фиолетовый - экзамен
  tabStats: "#10B981", // Зеленый - статистика
  tabSettings: "#6B7280", // Серый - настройки
};

// Тёмная тема - более светлые версии тех же цветов
const darkColors: ThemeColors = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  border: "#2C2C2E",
  primary: "#60A5FA", // Светлее на 20%
  secondary: "#A78BFA", // Светлее на 20%
  danger: "#F87171",
  warning: "#FBBF24",
  success: "#34D399",
  muted: "#9CA3AF",

  tabBar: "#1C1C1E",
  tabBarActive: "#60A5FA",
  tabBarInactive: "#9CA3AF",

  // Темная версия цветов табов
  tabTraining: "#60A5FA", // Синий
  tabExam: "#A78BFA", // Фиолетовый
  tabStats: "#34D399", // Зеленый
  tabSettings: "#9CA3AF", // Серый
};

// Тип контекста
type ThemeContextType = {
  theme: "light" | "dark";
  themePreference: "light" | "dark" | "auto";
  colors: ThemeColors;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const { theme: themePreference } = useThemeStore();

  const currentTheme =
    themePreference === "auto" ? systemTheme || "light" : themePreference;
  const isDark = currentTheme === "dark";
  const colors = isDark ? darkColors : lightColors;

  // ТОЛЬКО настройка StatusBar - упрощаем
  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.background);
      StatusBar.setTranslucent(false);
    }
    StatusBar.setBarStyle(isDark ? "light-content" : "dark-content");
  }, [isDark, colors.background]);

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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
