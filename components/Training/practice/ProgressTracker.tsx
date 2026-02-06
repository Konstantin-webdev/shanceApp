// ProgressTracker.tsx
import { useTheme } from "@/components/ThemeProvider";
import { StyleSheet, View } from "react-native";

interface ProgressTrackerProps {
  progress: number;
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    progressBarBackground: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: "hidden" as const,
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
        />
      </View>
    </View>
  );
}
