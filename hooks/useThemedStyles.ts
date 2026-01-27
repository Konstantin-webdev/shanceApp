// hooks/useThemedStyles.ts
import { useTheme } from "@/components/ThemeProvider";

export const useThemedStyles = <T>(createStyles: (colors: any) => T): T => {
  const { colors } = useTheme();
  return createStyles(colors);
};
