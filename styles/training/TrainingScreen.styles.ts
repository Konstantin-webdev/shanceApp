import { StyleSheet } from "react-native";

export const TrainingScreenStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
      marginTop: -30,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      margin: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      textAlign: "center" as const,
      fontSize: 32,
      fontWeight: "bold" as const,
      color: colors.primary,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center" as const,
      color: colors.muted,
      marginTop: 8,
    },
    content: {
      padding: 20,
    },
    professionCard: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    professionTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 8,
    },
    professionName: {
      fontSize: 20,
      fontWeight: "bold" as const,
      color: colors.primary,
      marginBottom: 4,
    },
    professionStats: {
      fontSize: 15,
      color: colors.success,
      marginBottom: 8,
    },
    professionHint: {
      fontSize: 14,
      color: colors.muted,
      fontStyle: "italic" as const,
    },
    settingsButton: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: `${colors.primary}1A`, // 10% opacity в hex
      borderRadius: 8,
      alignSelf: "flex-start" as const,
    },
    settingsButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600" as const,
    },
    startButton: {
      backgroundColor: colors.primary,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingVertical: 16,
      borderRadius: 12,
      marginTop: 24,
      gap: 8,
    },
    disabledButton: {
      backgroundColor: colors.muted,
      opacity: 0.6,
    },
    startButtonText: {
      color: colors.background || "#FFFFFF",
      fontSize: 18,
      fontWeight: "600" as const,
    },
    instructions: {
      marginTop: 32,
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    instructionsTitle: {
      fontSize: 18,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 16,
    },
    instructionItem: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: 12,
    },
    instructionNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: `${colors.primary}1A`, // 10% opacity в hex
      color: colors.primary,
      textAlign: "center" as const,
      lineHeight: 28,
      fontWeight: "600" as const,
      marginRight: 12,
    },
    instructionText: {
      fontSize: 15,
      color: colors.text,
      flex: 1,
    },
    bottomSpacer: {
      height: 40,
    },
  });
