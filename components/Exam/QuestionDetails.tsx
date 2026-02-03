import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/components/ThemeProvider";

interface QuestionData {
  id: string;
  text: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  professionId: number;
}

interface QuestionDetailsProps {
  questionsData: QuestionData[];
  answersData: Record<number, string>;
}

export const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  questionsData,
  answersData,
}) => {
  const { colors, isDark } = useTheme();

  if (questionsData.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Детали по вопросам:
      </Text>

      <View style={styles.questionsList}>
        {questionsData.map((question, index) => {
          const userAnswer = answersData[index];
          const isCorrect = userAnswer === question.correctAnswer;
          const correctOption = question.options.find(
            (opt) => opt.id === question.correctAnswer,
          );
          const userOption = question.options.find(
            (opt) => opt.id === userAnswer,
          );

          return (
            <QuestionItem
              key={question.id}
              index={index}
              question={question}
              isCorrect={isCorrect}
              userOption={userOption}
              correctOption={correctOption}
              isDark={isDark}
              colors={colors}
            />
          );
        })}
      </View>
    </View>
  );
};

interface QuestionItemProps {
  index: number;
  question: QuestionData;
  isCorrect: boolean;
  userOption?: { id: string; text: string };
  correctOption?: { id: string; text: string };
  isDark: boolean;
  colors: any;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  index,
  question,
  isCorrect,
  userOption,
  correctOption,
  isDark,
  colors,
}) => (
  <View
    style={[
      styles.questionItem,
      {
        backgroundColor: isDark ? "#2C2C2E" : "#F8F9FA",
        borderColor: colors.border,
      },
    ]}
  >
    <View style={styles.questionItemHeader}>
      <Text style={[styles.questionNumber, { color: colors.primary }]}>
        Вопрос {index + 1}
      </Text>
      <View
        style={[
          styles.questionStatus,
          isCorrect
            ? { backgroundColor: `${colors.success}20` }
            : { backgroundColor: `${colors.danger}20` },
        ]}
      >
        <Text
          style={[
            styles.questionStatusText,
            isCorrect ? { color: colors.success } : { color: colors.danger },
          ]}
        >
          {isCorrect ? "✓" : "✗"}
        </Text>
      </View>
    </View>

    <View style={styles.questionContent}>
      <Text style={[styles.questionText, { color: colors.text }]}>
        {question.text}
      </Text>
    </View>

    <View style={styles.answersContainer}>
      <View style={styles.answerRow}>
        <Text style={[styles.answerLabel, { color: colors.muted }]}>
          Ваш ответ:
        </Text>
        <View style={styles.answerTextContainer}>
          <Text
            style={[
              styles.answerText,
              isCorrect ? { color: colors.success } : { color: colors.danger },
            ]}
          >
            {userOption?.text || "Не ответил"}
          </Text>
        </View>
      </View>

      {!isCorrect && correctOption && (
        <View style={styles.answerRow}>
          <Text style={[styles.answerLabel, { color: colors.muted }]}>
            Правильный:
          </Text>
          <View style={styles.answerTextContainer}>
            <Text style={[styles.correctAnswerText, { color: colors.success }]}>
              {correctOption.text}
            </Text>
          </View>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  questionsList: {
    gap: 12,
  },
  questionItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  questionItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  questionStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  questionStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  questionContent: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  answersContainer: {
    gap: 8,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  answerLabel: {
    fontSize: 12,
    minWidth: 80,
    marginTop: 2,
  },
  answerTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  answerText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    flexWrap: "wrap",
  },
  correctAnswerText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    flexWrap: "wrap",
  },
});
