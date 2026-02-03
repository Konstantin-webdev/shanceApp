import { StyleSheet } from "react-native";
import { ThemeColors } from "../ThemeProvider";

export const createSettingsStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 30,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 32,
      paddingTop: 8,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + "20", // 20% прозрачности
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: -0.5,
    },
    sectionContainer: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 20,
      letterSpacing: -0.3,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      shadowColor: isDark ? "#000" : colors.muted, // Используем muted для светлой тени
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputGroup: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    inputContainer: {
      position: "relative",
    },
    input: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 14,
      padding: 18,
      fontSize: 17,
      backgroundColor: colors.card,
      color: colors.text,
      paddingRight: 120,
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    saveButtonInline: {
      position: "absolute",
      right: 12,
      top: 12,
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      minWidth: 100,
    },
    saveButtonInlineDisabled: {
      backgroundColor: colors.muted,
      opacity: 0.6,
    },
    saveButtonInlineText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "600",
      textAlign: "center",
    },
    buttonGroup: {
      gap: 12,
    },
    button: {
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.warning + "20", // 20% прозрачности
      borderWidth: 2,
      borderColor: colors.warning,
    },
    dangerButton: {
      backgroundColor: colors.danger + "15", // 15% прозрачности
      borderWidth: 2,
      borderColor: colors.danger,
    },
    buttonText: {
      fontSize: 17,
      fontWeight: "600",
      marginLeft: 10,
    },
    primaryButtonText: {
      color: "#FFFFFF",
    },
    secondaryButtonText: {
      color: colors.warning,
    },
    dangerButtonText: {
      color: colors.danger,
    },
    buttonIcon: {
      marginRight: 8,
    },
    warningText: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      marginTop: 16,
      lineHeight: 20,
      fontStyle: "italic",
    },
    dangerText: {
      fontSize: 14,
      color: colors.danger,
      textAlign: "center",
      marginTop: 16,
      lineHeight: 20,
      fontWeight: "500",
    },
    separator: {
      height: 1,
      backgroundColor: colors.border + "80", // 80% прозрачности
      marginVertical: 20,
    },
    bottomSpacer: {
      height: 40,
    },
    currentValue: {
      fontSize: 15,
      color: colors.muted,
      marginTop: 4,
      fontStyle: "italic",
    },
  });
