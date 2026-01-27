// components/ExamHeader.tsx
import { useTheme } from "@/components/ThemeProvider";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ExamTimer from "./ExamTimer";

interface ExamHeaderProps {
  professionName: string;
  onBack: () => void;
  timerActive: boolean;
  onTimeUp: () => void;
  onExamComplete: (timeSpent: number) => void;
}

export default function ExamHeader({
  professionName,
  onBack,
  timerActive,
  onTimeUp,
  onExamComplete,
}: ExamHeaderProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      paddingTop: 5,
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    professionContainer: {
      flex: 1,
      marginHorizontal: 12,
    },
    professionText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.danger} />
        </TouchableOpacity>

        <View style={styles.professionContainer}>
          <Text style={styles.professionText} numberOfLines={1}>
            {professionName}
          </Text>
        </View>

        <ExamTimer
          isActive={timerActive}
          onTimeUp={onTimeUp}
          onExamComplete={onExamComplete}
        />
      </View>
    </View>
  );
}
