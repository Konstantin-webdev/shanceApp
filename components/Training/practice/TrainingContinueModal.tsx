import { useTheme } from "@/components/ThemeProvider";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TrainingContinueModalProps {
  visible: boolean;
  onContinue: () => void;
  onRestart: () => void;
  onCancel: () => void;
}

export default function TrainingContinueModal({
  visible,
  onContinue,
  onRestart,
  onCancel,
}: TrainingContinueModalProps) {
  const { colors } = useTheme();

  if (!visible) return null;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: "90%",
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    modalText: {
      fontSize: 16,
      color: colors.muted,
      marginBottom: 24,
      textAlign: "center",
      lineHeight: 22,
    },
    modalButton: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 12,
    },
    continueButton: {
      backgroundColor: colors.primary,
    },
    restartButton: {
      backgroundColor: colors.danger,
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    continueButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    restartButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: 16,
    },
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Продолжить тренировку?</Text>
          <Text style={styles.modalText}>
            У вас есть сохраненный прогресс. Хотите продолжить с того же места
            или начать заново?
          </Text>

          <TouchableOpacity
            style={[styles.modalButton, styles.continueButton]}
            onPress={onContinue}
          >
            <Text style={styles.continueButtonText}>Продолжить</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.restartButton]}
            onPress={onRestart}
          >
            <Text style={styles.restartButtonText}>Начать заново</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
