// components/QuestionItem.tsx
import { useTheme } from "@/components/ThemeProvider";
import { Check, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { IQuestion } from "../app/types/questions";

interface QuestionItemProps {
  question: IQuestion;
  index: number;
  userAnswer?: string;
  onAnswerSelect: (questionIndex: number, answerId: string) => void;
  isCurrentQuestion: boolean;
}

export default function QuestionItem({
  question,
  index,
  userAnswer,
  onAnswerSelect,
  isCurrentQuestion,
}: QuestionItemProps) {
  const { colors } = useTheme();
  const hasAnswered = userAnswer !== undefined;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16, // Добавляем отступы по бокам
      paddingTop: 16,
    },
    questionCard: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1, // Фиксированная ширина границы
      borderColor: colors.border,
    },
    questionText: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.text,
      lineHeight: 24,
    },
    optionsContainer: {
      gap: 12,
      marginBottom: 20,
    },
    optionButton: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1, // Фиксированная ширина границы!
      borderColor: colors.border,
    },
    selectedOption: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    correctOption: {
      borderColor: colors.success,
      backgroundColor: colors.success + "10",
    },
    wrongOption: {
      borderColor: colors.danger,
      backgroundColor: colors.danger + "10",
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionIndicator: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    optionLetter: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    optionStatus: {
      marginLeft: 8,
    },
    hintContainer: {
      marginTop: 20,
      alignItems: "center",
      marginBottom: 20,
    },
    hintText: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = userAnswer === option.id;
          const isActuallyCorrect = option.id === question.correctAnswer;
          const isWrongSelected = isSelected && !isActuallyCorrect;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOption,
                hasAnswered && isActuallyCorrect && styles.correctOption,
                hasAnswered && isWrongSelected && styles.wrongOption,
              ]}
              onPress={() => onAnswerSelect(index, option.id)}
              disabled={hasAnswered}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIndicator}>
                  <Text style={styles.optionLetter}>
                    {option.id.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.optionText}>{option.text}</Text>

                {hasAnswered && (
                  <View style={styles.optionStatus}>
                    {isActuallyCorrect ? (
                      <Check size={20} color={colors.success} />
                    ) : isSelected ? (
                      <X size={20} color={colors.danger} />
                    ) : null}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
