import { Trash2 } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ProfessionSelector from "@/components/ProfessionSelector";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import UserNameEditor from "@/components/Settings/UserNameEditor";
import { useOnboardingStore } from "@/components/store/useOnboardingStore";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useUserStore } from "@/components/store/useUserStore";
import { useTheme } from "@/components/ThemeProvider";
import ThemeSelector from "@/components/ThemeSelector";

export default function SettingsScreen() {
  const { clearUserName } = useUserStore();
  const { setSelectedProfession } = useProfessionStore();
  const { resetOnboarding } = useOnboardingStore();
  const { colors, isDark } = useTheme();

  // Все стили внутри компонента с useMemo
  const styles = useMemo(
    () =>
      StyleSheet.create({

        container: {
          backgroundColor: colors.background,
        },
        inner: {
          paddingHorizontal: 16,
          flex: 1,
          flexDirection: "column",
          gap: 16,
          marginBlock: 16,
        },
        sectionTitle: {
          fontSize: 20,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 14,
          letterSpacing: -0.3,
          paddingLeft: 4,
        },
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
        separator: {
          height: 1,
          backgroundColor: colors.border + "80",
          marginVertical: 20,
        },
        button: {
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
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
        dangerButtonText: {
          color: colors.danger,
        },
        buttonIcon: {
          marginRight: 4,
        },
        dangerText: {
          fontSize: 14,
          color: colors.danger,
          textAlign: "center",
          marginTop: 12,
          lineHeight: 20,
          fontWeight: "500",
        },

      }),
    [colors, isDark]
  );

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
            setSelectedProfession(null);
            resetOnboarding();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <SectionHeader
        title="Настройки"
        titleColor={colors.tabSettings}
        subtitle="Управление профилем и приложением"
      />
      <View style={styles.inner}>
        <UserNameEditor />

        <View style={styles.card}>
          <ProfessionSelector />
        </View>

        <View style={styles.card}>
          <ThemeSelector />
        </View>

        <View style={styles.card}>
          <View style={styles.separator} />
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleResetAll}
            activeOpacity={0.8}
          >
            <Trash2 size={22} color={colors.danger} style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.dangerButtonText]}>
              Сбросить все данные
            </Text>
          </TouchableOpacity>
          <Text style={styles.dangerText}>
            Сбросит имя, профессию и вернёт к первоначальной настройке
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}