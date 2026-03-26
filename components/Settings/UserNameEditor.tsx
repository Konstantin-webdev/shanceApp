import React, { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View, Text } from "react-native";
import { useUserStore } from "@/components/store/useUserStore";
import { ThemeColors, useTheme } from "@/components/ThemeProvider";
import { Check, X } from "lucide-react-native";
import { createSettingsStyles } from "./styles";

export default function UserNameEditor() {
  const { userName, setUserName } = useUserStore();
  const [value, setValue] = useState(userName || "");
  const [isEditing, setIsEditing] = useState(false);

  const { colors, isDark } = useTheme();
  const styles = createSettingsStyles(colors, isDark);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      Alert.alert("Ошибка", "Имя не может быть пустым");
      return;
    }
    if (trimmed.length > 50) {
      Alert.alert("Ошибка", "Имя слишком длинное");
      return;
    }
    setUserName(trimmed);
    setIsEditing(false);
    Alert.alert("✓ Готово", "Имя обновлено");
  };

  const handleCancel = () => {
    setValue(userName || "");
    setIsEditing(false);
  };

  if (!isEditing && userName) {
    return (
      <TouchableOpacity
        style={styles.displayCard}
        onPress={() => setIsEditing(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.displayLabel}>Ваше имя</Text>
        <Text style={styles.displayName}>{userName}</Text>
        <Text style={styles.editHint}>Нажмите, чтобы изменить</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Введите имя"
        placeholderTextColor={colors.muted + "80"}
        maxLength={50}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={handleCancel}
        >
          <X size={18} color={colors.muted} />
          <Text style={styles.actionTextCancel}>Отмена</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSave}
          disabled={!value.trim()}
        >
          <Check size={18} color="#fff" />
          <Text style={styles.actionTextSave}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createUserNameEditorStyles(colors: ThemeColors) {
  throw new Error("Function not implemented.");
}
