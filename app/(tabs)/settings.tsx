// screens/SettingsScreen.tsx
import ProfessionSelector from "@/components/ProfessionSelector";
import { useTheme } from "@/components/ThemeProvider";
import ThemeSelector from "@/components/ThemeSelector";
import { useRouter } from "expo-router";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useProfessionStore } from "../store/useProfessionStore";
import { useUserStore } from "../store/useUserStore";

export default function SettingsScreen() {
  const { userName, setUserName, clearUserName } = useUserStore();
  const { setSelectedProfession } = useProfessionStore();
  const [newName, setNewName] = useState(userName || "");
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStore();

  const { colors, isDark } = useTheme();

  const handleSaveName = () => {
    if (!newName.trim()) {
      Alert.alert("Ошибка", "Имя не может быть пустым");
      return;
    }

    setUserName(newName.trim());
    Alert.alert("Успешно", "Имя обновлено");
  };

  const handleClearName = () => {
    Alert.alert(
      "Сброс имени",
      "Вы уверены, что хотите сбросить имя? При следующем запуске приложение запросит его снова.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Сбросить",
          style: "destructive",
          onPress: () => {
            clearUserName();
            setNewName("");
            Alert.alert("Успешно", "Имя сброшено");
          },
        },
      ],
    );
  };

  const handleResetAll = () => {
    Alert.alert(
      "Сброс всех данных",
      "Вы уверены, что хотите сбросить имя пользователя и выбранную профессию? Все данные будут удалены.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Сбросить всё",
          style: "destructive",
          onPress: () => {
            clearUserName();
            setNewName("");
            setSelectedProfession(null);
            resetOnboarding();
            Alert.alert("Успешно", "Все данные сброшены");
          },
        },
      ],
    );
  };

  // Обновленные стили
  const styles = StyleSheet.create({
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Заголовок */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Настройки</Text>
          </View>

          {/* Блок с именем пользователя */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Личные данные</Text>
            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ваше имя</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Введите ваше имя"
                    placeholderTextColor={colors.muted + "80"}
                    maxLength={50}
                    returnKeyType="done"
                    onSubmitEditing={handleSaveName}
                  />
                  <TouchableOpacity
                    style={[
                      styles.saveButtonInline,
                      !newName.trim() && styles.saveButtonInlineDisabled,
                    ]}
                    onPress={handleSaveName}
                    disabled={!newName.trim()}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.saveButtonInlineText}>
                      {userName ? "Обновить" : "Сохранить"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Блок выбора профессии */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Профессия</Text>
            <View style={styles.card}>
              <ProfessionSelector />
            </View>
          </View>

          {/* Блок выбора темы */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Внешний вид</Text>
            <View style={styles.card}>
              <ThemeSelector />
            </View>
          </View>

          {/* Блок сброса всех данных */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Опасная зона</Text>
            <View style={styles.card}>
              <Text style={styles.warningText}>
                Эти действия приведут к потере данных. Вы не сможете восстановить их.
              </Text>

              <View style={styles.separator} />

              <TouchableOpacity
                style={[styles.button, styles.dangerButton]}
                onPress={handleResetAll}
                activeOpacity={0.8}
              >
                <Trash2
                  size={22}
                  color={colors.danger}
                  style={styles.buttonIcon}
                />
                <Text style={[styles.buttonText, styles.dangerButtonText]}>
                  Сбросить все данные
                </Text>
              </TouchableOpacity>

              <Text style={styles.dangerText}>
                Сбросит имя, профессию и вернёт к первоначальной настройке
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}