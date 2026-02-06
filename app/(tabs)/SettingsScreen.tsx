import ProfessionSelector from "@/components/ProfessionSelector";
import { createSettingsStyles } from "@/components/Settings/styles";
import { useOnboardingStore } from "@/components/store/useOnboardingStore";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useUserStore } from "@/components/store/useUserStore";
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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { userName, setUserName, clearUserName } = useUserStore();
  const { setSelectedProfession } = useProfessionStore();
  const [newName, setNewName] = useState(userName || "");
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStore();

  const { colors, isDark } = useTheme();
  const styles = createSettingsStyles(colors, isDark);

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
                Эти действия приведут к потере данных. Вы не сможете
                восстановить их.
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
