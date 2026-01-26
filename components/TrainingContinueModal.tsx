// components/TrainingContinueModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

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
  if (!visible) return null;

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

          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#8E8E93",
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
    backgroundColor: "#007AFF",
  },
  restartButton: {
    backgroundColor: "#FF3B30",
  },
  cancelButton: {
    backgroundColor: "#E5E5EA",
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
    color: "#1C1C1E",
    fontSize: 16,
  },
});
