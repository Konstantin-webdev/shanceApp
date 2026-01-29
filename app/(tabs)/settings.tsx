// screens/SettingsScreen.tsx
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform, // Добавьте этот импорт
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import ProfessionSelector from "@/components/ProfessionSelector";
import ThemeSelector from "@/components/ThemeSelector";
import { useProfessionStore } from "../store/useProfessionStore";
import { useUserStore } from "../store/useUserStore";
import { useTheme } from "@/components/ThemeProvider"; // Импортируем useTheme

export default function SettingsScreen() {
  const { userName, setUserName, clearUserName } = useUserStore();
  const { setSelectedProfession } = useProfessionStore();
  const [newName, setNewName] = useState(userName || "");
  const router = useRouter();

  // Используем тему
  const { colors } = useTheme();

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
            Alert.alert("Успешно", "Все данные сброшены");
          },
        },
      ],
    );
  };

  // Создаем стили с использованием цветов темы
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingTop: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    backButton: {
      marginRight: 16,
      padding: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.primary,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 8,
      backgroundColor: colors.card,
      color: colors.text,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    saveButtonDisabled: {
      backgroundColor: colors.muted,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    clearButton: {
      borderWidth: 1,
      borderColor: colors.warning,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 8,
    },
    clearButtonText: {
      color: colors.warning,
      fontSize: 16,
      fontWeight: "600",
    },
    resetAllButton: {
      borderWidth: 2,
      borderColor: colors.danger,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    resetIcon: {
      marginRight: 8,
    },
    resetAllButtonText: {
      color: colors.danger,
      fontSize: 16,
      fontWeight: "bold",
    },
    dangerText: {
      fontSize: 14,
      color: colors.danger,
      marginTop: 12,
      textAlign: "center",
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    bottomSpacer: {
      height: 40,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
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
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Настройки</Text>
          </View>

          {/* Блок с именем пользователя */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Личные данные</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ваше имя</Text>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Введите ваше имя"
                placeholderTextColor={colors.muted}
                maxLength={50}
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !newName.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSaveName}
              disabled={!newName.trim()}
            >
              <Text style={styles.saveButtonText}>Сохранить имя</Text>
            </TouchableOpacity>
          </View>

          {/* Блок выбора профессии */}
          <View style={styles.card}>
            <ProfessionSelector />
          </View>

          {/* Блок выбора темы */}
          <View style={styles.card}>
            <ThemeSelector />
          </View>

          {/* Блок сброса всех данных */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Опасная зона</Text>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearName}
            >
              <Text style={styles.clearButtonText}>Сбросить только имя</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.resetAllButton}
              onPress={handleResetAll}
            >
              <Trash2
                size={20}
                color={colors.danger}
                style={styles.resetIcon}
              />
              <Text style={styles.resetAllButtonText}>Сбросить всё</Text>
            </TouchableOpacity>

            <Text style={styles.dangerText}>
              Эта кнопка сбросит ваше имя и выбранную профессию
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
