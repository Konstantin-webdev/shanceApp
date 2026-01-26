import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { IQuestion } from "../app/types/questions";

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

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>
          Вопрос {questionNumber} из {totalQuestions}
        </Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = isCorrectAnswer(option.id);

          // Форматируем текст только для правильных ответов в режиме обучения
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  questionHeader: {
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    color: "#8E8E93",
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
  selectedOptionIndicator: {
    backgroundColor: "#007AFF",
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  selectedOptionLetter: {
    color: "#FFFFFF",
  },
  optionText: {
    fontSize: 16,
    color: "#1C1C1E",
    flex: 1,
  },
  selectedOptionText: {
    color: "#007AFF",
    fontWeight: "500",
  },
});
