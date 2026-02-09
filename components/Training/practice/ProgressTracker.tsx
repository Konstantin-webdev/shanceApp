import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface ProgressTrackerProps {
  progress: number;
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const { colors } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(animatedColor, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [progress]);

  // Интерполяция цвета от красного к зеленому через желтый
  const backgroundColor = animatedColor.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      colors.danger, // 0% - красный
      colors.warning, // 50% - желтый
      colors.success, // 100% - зеленый
    ],
  });

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    progressBarBackground: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden" as const,
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: widthInterpolated,
              backgroundColor: backgroundColor,
            },
          ]}
        />
      </View>
    </View>
  );
}
