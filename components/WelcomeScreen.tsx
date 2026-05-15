import { useTheme } from "@/components/ThemeProvider";
import { User } from "lucide-react-native";
import { useMemo, useState } from "react";
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
import { useUserStore } from "./store/useUserStore";

export default function WelcomeScreen() {
  const [name, setName] = useState("");
  const { setUserName } = useUserStore();
  const { colors } = useTheme();

  const handleChangeText = (text: string) => {
    // Просто ограничиваем длину, не фильтруем символы (имена могут быть разными)
    if (text.length <= 30) {
      setName(text);
    }
  };

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Ошибка", "Пожалуйста, введите ваше имя");
      return;
    }
    if (trimmed.length < 2) {
      Alert.alert("Ошибка", "Имя должно содержать хотя бы 2 символа");
      return;
    }
    setUserName(trimmed);
  };

  const isButtonDisabled = !name.trim() || name.trim().length < 2;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        keyboardView: { flex: 1 },
        scrollContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 20 },
        iconContainer: { alignItems: "center", marginBottom: 32 },
        iconCircle: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.primary + "20",
          justifyContent: "center",
          alignItems: "center",
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
          borderRadius: 16,
          padding: 16,
          fontSize: 18,
          marginBottom: 12,
          backgroundColor: colors.card,
          color: colors.text,
        },
        inputFocused: { borderColor: colors.primary, borderWidth: 2 },
        charCounter: { textAlign: "right", fontSize: 12, color: colors.muted, marginBottom: 24 },
        button: {
          backgroundColor: colors.primary,
          paddingVertical: 16,
          borderRadius: 16,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
        },
        buttonDisabled: { backgroundColor: colors.muted, opacity: 0.7 },
        buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
      }),
    [colors]
  );

  const [isFocused, setIsFocused] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "padding"} // для Android тоже работает
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <User size={40} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.title}>Добро пожаловать!</Text>
          <Text style={styles.subtitle}>Введите ваше имя, чтобы начать</Text>

          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            placeholder="Ваше имя"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus={false}
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Text style={styles.charCounter}>{name.length}/30</Text>

          <TouchableOpacity
            style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={isButtonDisabled}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Продолжить</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}