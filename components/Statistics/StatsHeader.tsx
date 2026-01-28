// components/StatsHeader.tsx
import type { IProfession } from "@/app/types/profession";
import { useTheme } from "@/components/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatsHeaderProps {
  userName?: string | null;
  selectedProfession?: IProfession | null;
}

export function StatsHeader({
  userName,
  selectedProfession,
}: StatsHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.success }]}>Статистика</Text>
      {userName && (
        <Text style={[styles.userName, { color: colors.muted }]}>
          Пользователь: {userName}
        </Text>
      )}
      {selectedProfession && (
        <Text style={[styles.selectedProfession, { color: colors.primary }]}>
          Профессия: {selectedProfession.name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userName: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 4,
  },
  selectedProfession: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
});
