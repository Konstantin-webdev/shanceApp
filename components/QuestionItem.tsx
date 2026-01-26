// components/QuestionItem.tsx
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
  const hasAnswered = userAnswer !== undefined;

  // Определяем, правильный ли был ответ пользователя
  const isUserAnswerCorrect = userAnswer === question.correctAnswer;

  return (
    <View style={styles.container}>
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = userAnswer === option.id;
          const isActuallyCorrect = option.id === question.correctAnswer;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOption,
                hasAnswered && isActuallyCorrect && styles.correctOption,
                hasAnswered &&
                  isSelected &&
                  !isActuallyCorrect &&
                  styles.wrongOption,
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
              </View>

              {hasAnswered && (
                <View style={styles.optionStatus}>
                  {isActuallyCorrect ? (
                    <Check size={20} color="#34C759" />
                  ) : isSelected ? (
                    <X size={20} color="#FF3B30" />
                  ) : null}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.hintContainer}>
        {!hasAnswered ? (
          <Text style={styles.hintText}>Выберите ответ, чтобы продолжить</Text>
        ) : (
          <Text style={styles.hintText}>
            {isUserAnswerCorrect
              ? "Правильно!"
              : "Неправильно. Попробуйте следующий вопрос"}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1C1C1E",
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F7FF",
  },
  correctOption: {
    borderColor: "#34C759",
    backgroundColor: "#F0FFF4",
  },
  wrongOption: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF0F0",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  optionText: {
    fontSize: 16,
    color: "#1C1C1E",
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
    color: "#8E8E93",
    textAlign: "center",
  },
});
