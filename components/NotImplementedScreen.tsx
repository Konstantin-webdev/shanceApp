import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "expo-router";
import { Construction } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotImplementedScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();

  const handleGoBack = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.warning + "20", // 20% opacity
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    heading: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      color: colors.muted,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 32,
      maxWidth: 300,
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      minWidth: 200,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Контент */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Construction size={80} color={colors.warning} />
        </View>

        <Text style={styles.heading}>Скоро будет!</Text>

        <Text style={styles.description}>
          Вопросы для этой профессии находятся в разработке. Мы активно работаем
          над их добавлением.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NotImplementedScreen;
