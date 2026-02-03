import { useTheme } from "@/components/ThemeProvider";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { IQuestion } from "./types/questions";

interface QuestionCardProps {
  question: IQuestion;
  selectedAnswer: string | undefined;
  onAnswerSelect: (answerId: string) => void;
  questionNumber: number;
  totalQuestions: number;
  showCorrectAnswers?: boolean;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
  showCorrectAnswers = false,
}: QuestionCardProps) {
  const { colors } = useTheme();

  const isCorrectAnswer = (answerId: string) => {
    return answerId === question.correctAnswer;
  };

  // Функция для незаметного изменения правильных ответов
  const formatCorrectAnswerText = (text: string) => {
    if (!text || text.length === 0) {
      return text;
    }

    const trimmedText = text.trim();

    // Если последний символ - точка, заменяем ее на точку с запятой
    if (trimmedText.endsWith(".")) {
      return trimmedText.slice(0, -1) + ";";
    }

    // Если в конце нет точки, просто добавляем точку с запятой
    // Но это уже будет заметно, так что лучше оставить как есть
    return text;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 7,
    },
    questionHeader: {
      marginBottom: 7,
    },
    questionNumber: {
      fontSize: 14,
      color: colors.muted,
    },
    questionCard: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
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
      marginBottom: 7,
    },
    optionButton: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedOption: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10", // 10% opacity
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
    selectedOptionIndicator: {
      backgroundColor: colors.primary,
    },
    optionLetter: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    selectedOptionLetter: {
      color: "#FFFFFF",
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    selectedOptionText: {
      color: colors.primary,
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = isCorrectAnswer(option.id);

          const displayText =
            showCorrectAnswers && isCorrect
              ? formatCorrectAnswerText(option.text)
              : option.text;

          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionButton, isSelected && styles.selectedOption]}
              onPress={() => onAnswerSelect(option.id)}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.optionIndicator,
                    isSelected && styles.selectedOptionIndicator,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLetter,
                      isSelected && styles.selectedOptionLetter,
                    ]}
                  >
                    {option.id.toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {displayText}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
