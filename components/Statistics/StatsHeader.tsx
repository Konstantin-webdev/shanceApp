// components/StatsHeader.tsx
import { useTheme } from "@/components/ThemeProvider";
import type { IProfession } from "@/components/types/profession";
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
    padding: 20,
    borderRadius: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userName: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 4,
  },
  selectedProfession: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
});
