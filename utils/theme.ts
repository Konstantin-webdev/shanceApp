import { useThemeStore } from "@/app/store/useThemeStore";
import { useColorScheme } from "react-native";

export const useAppTheme = () => {
  const { theme } = useThemeStore();
  const systemTheme = useColorScheme();

  const getActiveTheme = () => {
    if (theme === "auto") {
      return systemTheme || "light";
    }
    return theme;
  };

  const isDark = getActiveTheme() === "dark";
  const isLight = getActiveTheme() === "light";
  const isAuto = theme === "auto";

  return {
    theme: getActiveTheme(),
    themePreference: theme,
    isDark,
    isLight,
    isAuto,
    colors: isDark ? darkColors : lightColors,
  };
};

// Пример цветовых схем
export const lightColors = {
  background: "#FFFFFF",
  card: "#F2F2F7",
  text: "#000000",
  textSecondary: "#8E8E93",
  primary: "#007AFF",
  border: "#C7C7CC",
  danger: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
};

export const darkColors = {
  background: "#000000",
  card: "#1C1C1E",
  text: "#FFFFFF",
  textSecondary: "#8E8E93",
  primary: "#0A84FF",
  border: "#38383A",
  danger: "#FF453A",
  success: "#30D158",
  warning: "#FF9F0A",
};
