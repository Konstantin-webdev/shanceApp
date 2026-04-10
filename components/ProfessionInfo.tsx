// components/ProfessionInfo.tsx
import { useTheme } from "@/components/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";
import { getQuestionsByProfessionId } from "./data/questions";
import type { IProfession } from "./types/profession";

interface ProfessionInfoProps {
  profession: IProfession;
}

export const ProfessionInfo = ({ profession }: ProfessionInfoProps) => {
  const { colors } = useTheme();

  const actualQuestionCount = getQuestionsByProfessionId(profession.id).length;

  const styles = StyleSheet.create({
    professionInfo: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    professionName: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 4,
    },
    professionStats: {
      fontSize: 14,
      color: colors.text,
    },
  });

  return (
    <View style={styles.professionInfo}>
      <Text style={styles.professionName}>{profession.name}</Text>
      <Text style={styles.professionStats}>
        {actualQuestionCount} вопросов доступно
      </Text>
    </View>
  );
};
