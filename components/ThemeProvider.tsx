import { useThemeStore } from "@/app/store/useThemeStore";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useThemeStore();
  const systemTheme = useColorScheme();

  useEffect(() => {
    // Здесь можно добавить логику для применения темы
    // Например, изменение StatusBar, использование react-native-paper ThemeProvider и т.д.

    console.log("Current theme:", theme);
    console.log("System theme:", systemTheme);

    // Определяем активную тему
    const activeTheme = theme === "auto" ? systemTheme || "light" : theme;

    console.log("Active theme to apply:", activeTheme);

    // Здесь можно применить тему к различным библиотекам:
    // - React Navigation
    // - React Native Paper
    // - Или вашу собственную систему тем
  }, [theme, systemTheme]);

  // Пока просто возвращаем детей
  // В реальном приложении здесь будет обертка с контекстом темы
  return <>{children}</>;
};
