// components/ExamHeader.tsx
import { useTheme } from "@/components/ThemeProvider";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ExamTimer from "./ExamTimer";

interface ExamHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  remainingTime: number;
  onBack: () => void;
  timerActive: boolean;
  onTimeUp: () => void;
  // onExamComplete: (timeSpent: number) => void; // <-- УДАЛИТЬ
}

export default function ExamHeader({
  currentQuestion,
  totalQuestions,
  remainingTime,
  onBack,
  timerActive,
  onTimeUp,
  // onExamComplete, // <-- УДАЛИТЬ
}: ExamHeaderProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      paddingTop: 5,
      paddingHorizontal: 7,
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
    },
    progressContainer: {
      flex: 1,
      marginHorizontal: 12,
    },
    progressText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.danger} />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText} numberOfLines={1}>
            Вопрос {currentQuestion}/{totalQuestions}
          </Text>
        </View>

        <ExamTimer
          isActive={timerActive}
          onTimeUp={onTimeUp}
          remainingTime={remainingTime}
        />
      </View>
    </View>
  );
}