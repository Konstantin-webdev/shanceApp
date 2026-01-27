// hooks/useTheme.ts
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useThemeStore } from "@/app/store/useThemeStore";
import { ThemeType } from "@/app/store/useThemeStore";

export const useTheme = () => {
  const systemTheme = useColorScheme();
  const { theme } = useThemeStore();

  const getCurrentTheme = (): "light" | "dark" => {
    if (theme === "auto") {
      return systemTheme || "light";
    }
    return theme;
  };

  const currentTheme = getCurrentTheme();

  // Здесь можно возвращать цвета для текущей темы
  const colors = {
    light: {
      background: "#F8F9FA",
      card: "#FFFFFF",
      text: "#1C1C1E",
      border: "#E5E5EA",
      primary: "#007AFF",
      // добавьте другие цвета
    },
    dark: {
      background: "#000000",
      card: "#1C1C1E",
      text: "#FFFFFF",
      border: "#2C2C2E",
      primary: "#0A84FF",
      // добавьте другие цвета
    },
  };

  return {
    theme: currentTheme,
    colors: colors[currentTheme],
    themePreference: theme, // 'light' | 'dark' | 'auto'
  };
};
