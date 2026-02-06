import { StyleSheet } from "react-native";
import { ThemeColors } from "@/components/ThemeProvider";

export const ExamScreenStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      margin: 16,
      marginBottom: 0,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      textAlign: "center" as const,
      fontSize: 28,
      fontWeight: "bold" as const,
      color: colors.danger,
    },
    subtitle: {
      textAlign: "center" as const,
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
    },
    content: {
      padding: 20,
    },
    professionInfo: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginTop: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.danger + "20",
    },
    professionName: {
      fontSize: 18,
      fontWeight: "600" as const,
      color: colors.text,
    },
    professionStats: {
      fontSize: 14,
      color: colors.danger,
      marginTop: 4,
    },
    startButton: {
      backgroundColor: colors.danger,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingVertical: 14,
      borderRadius: 12,
      marginTop: 8,
      marginBottom: 24,
      gap: 8,
    },
    disabledButton: {
      backgroundColor: colors.muted,
    },
    startButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600" as const,
    },
    featuresCard: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    featuresTitle: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 16,
    },
    featureItem: {
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      marginBottom: 16,
    },
    featureTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    featureTitle: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 2,
    },
    featureDescription: {
      fontSize: 13,
      color: colors.muted,
    },
    rules: {
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    rulesTitle: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 10,
    },
    ruleText: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 6,
      marginLeft: 4,
    },
  });
