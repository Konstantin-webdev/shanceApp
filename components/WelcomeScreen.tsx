import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "./store/useUserStore";

export default function WelcomeScreen() {
  const [name, setName] = useState("");
  const { setUserName } = useUserStore();
  const { colors } = useTheme();

  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert("Ошибка", "Пожалуйста, введите ваше имя");
      return;
    }

    setUserName(name.trim());
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      backgroundColor: colors.card,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      padding: 24,
      justifyContent: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.primary,
      textAlign: "center",
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      color: colors.muted,
      textAlign: "center",
      marginBottom: 32,
    },
    input: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      marginBottom: 24,
      backgroundColor: colors.card,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    buttonDisabled: {
      backgroundColor: colors.muted,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "600",
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Добро пожаловать!</Text>
          <Text style={styles.subtitle}>
            Введите ваше имя, чтобы начать использовать приложение
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ваше имя"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
            autoFocus
            maxLength={50}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />

          <TouchableOpacity
            style={[styles.button, !name.trim() && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!name.trim()}
          >
            <Text style={styles.buttonText}>Продолжить</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
