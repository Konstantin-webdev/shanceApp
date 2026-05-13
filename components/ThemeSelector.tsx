import { useTheme } from "@/components/ThemeProvider";
import { Moon, Smartphone, Sun } from "lucide-react-native";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { ThemeType } from "./store/useThemeStore";
import { useThemeStore } from "./store/useThemeStore";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  const { colors } = useTheme();

  const options: Array<{
    id: ThemeType;
    label: string;
    Icon: React.ElementType<{ size?: number; color?: string }>; // тип с указанием пропсов
    activeColor: string;
  }> = [
      { id: "light", label: "Светлая", Icon: Sun, activeColor: colors.warning },
      { id: "dark", label: "Тёмная", Icon: Moon, activeColor: colors.secondary },
      { id: "auto", label: "Авто", Icon: Smartphone, activeColor: colors.success },
    ];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 8,
        },
        segmentedGroup: {
          flexDirection: "row",
          gap: 12,
          justifyContent: "space-between",
        },
        optionButton: {
          flex: 1,
          alignItems: "center",
          paddingVertical: 12,
          borderRadius: 16,
          borderWidth: 1.5,
          gap: 6,
        },
        optionLabel: {
          fontSize: 14,
          fontWeight: "600",
        },
      }),
    [colors]
  );

  return (
    <View style={styles.container}>
      <View style={styles.segmentedGroup}>
        {options.map((option) => {
          const isActive = theme === option.id;
          const iconColor = isActive ? option.activeColor : colors.muted;
          const bgColor = isActive ? `${option.activeColor}20` : colors.background;
          const borderColor = isActive ? option.activeColor : colors.border;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                { backgroundColor: bgColor, borderColor },
              ]}
              onPress={() => setTheme(option.id)}
              activeOpacity={0.7}
            >
              <option.Icon size={24} color={iconColor} />
              <Text
                style={[
                  styles.optionLabel,
                  { color: isActive ? option.activeColor : colors.muted },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ThemeSelector;