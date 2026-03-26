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
    },

    header: {
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 24,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: isDark ? "#000" : colors.muted,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: 34,
      fontWeight: "800",
      textAlign: "center",
      color: colors.text,
      letterSpacing: -0.8,
    },
    titleSubtitle: {
      fontSize: 16,
      color: colors.muted,
      textAlign: "center",
      marginTop: 4,
      fontWeight: "400",
    },

    sectionContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 14,
      letterSpacing: -0.3,
      paddingLeft: 4,
    },

    // 🔥 Универсальный стиль карточки
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: isDark ? "#000" : colors.muted,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },

    // Поля ввода
    inputGroup: {
      marginBottom: 24,
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
      letterSpacing: -0.2,
    },
    inputContainer: {
      position: "relative",
    },
    input: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 18,
      fontSize: 17,
      backgroundColor: colors.background,
      color: colors.text,
      paddingRight: 120,
    },
    inputFocused: {
      borderColor: colors.primary,
    },

    // Кнопка сохранения в строке
    saveButtonInline: {
      position: "absolute",
      right: 12,
      top: 12,
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      minWidth: 90,
    },
    saveButtonInlineDisabled: {
      backgroundColor: colors.muted,
      opacity: 0.6,
    },
    saveButtonInlineText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },

    // Кнопки
    buttonGroup: {
      gap: 12,
    },
    button: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.warning + "20",
      borderWidth: 2,
      borderColor: colors.warning,
    },
    dangerButton: {
      backgroundColor: colors.danger + "15",
      borderWidth: 2,
      borderColor: colors.danger,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
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
      marginRight: 4,
    },

    // Тексты предупреждений
    warningText: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      marginTop: 8,
      lineHeight: 20,
      fontStyle: "italic",
    },
    dangerText: {
      fontSize: 14,
      color: colors.danger,
      textAlign: "center",
      marginTop: 12,
      lineHeight: 20,
      fontWeight: "500",
    },
    separator: {
      height: 1,
      backgroundColor: colors.border + "80",
      marginVertical: 20,
    },
    bottomSpacer: {
      height: 40,
    },

    // Отображение имени (когда не в режиме редактирования)
    displayCard: {
      // 🔥 Никаких пунктиров — только сплошная рамка как у всех
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: isDark ? "#000" : colors.muted,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    displayLabel: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 6,
    },
    displayName: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    editHint: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: "500",
      marginTop: 4,
    },

    // Действия: кнопки сохранить/отмена
    actions: {
      marginTop: 16,
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      minWidth: 95,
      justifyContent: "center",
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.muted + "20",
    },
    actionTextSave: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 15,
    },
    actionTextCancel: {
      color: colors.text,
      fontWeight: "500",
      fontSize: 15,
    },

    currentValue: {
      fontSize: 15,
      color: colors.muted,
      marginTop: 4,
      fontStyle: "italic",
    },
  });
