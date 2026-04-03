import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/components/ThemeProvider";

export function SpecialistNotice() {
  const { colors, isDark } = useTheme();

  const themedStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isDark ? colors.primary + "80" : colors.primary + "40",
          backgroundColor: isDark ? colors.card + "99" : colors.primary + "10",
          marginTop: 16,
          marginBottom: 8,
        },
        question: {
          fontSize: 15,
          fontWeight: "600",
          color: isDark ? colors.text : colors.primary,
          marginBottom: 8,
        },
        answer: {
          fontSize: 13,
          lineHeight: 18,
          color: colors.text,
          marginBottom: 12,
        },
        contactRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 4,
        },
        contactLabel: {
          fontSize: 13,
          color: colors.secondary,
        },
        link: {
          fontWeight: "600",
          color: colors.primary,
          textDecorationLine: "underline",
        },
        divider: {
          width: "100%",
          height: 1,
          backgroundColor: isDark ? colors.border + "60" : colors.border + "40",
          marginTop: 12,
          marginBottom: 12,
        },
        footer: {
          fontSize: 12,
          color: isDark ? colors.primary : colors.secondary,
          fontStyle: "italic",
        },
      }),
    [colors, isDark],
  );

  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.question}>Есть вопросы по билетам?</Text>
      <Text style={themedStyles.answer}>
        Все вопросы и ответы в экзамене разработаны и согласованы со
        специалистом по охране труда. Материалы регулярно обновляются в
        соответствии с действующими нормативными документами.
      </Text>
      <View style={themedStyles.divider} />
      <Text style={themedStyles.footer}>
        ✓ Официальный источник • Актуально на 2026 год
      </Text>
    </View>
  );
}
