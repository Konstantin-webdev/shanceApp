import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Construction } from "lucide-react-native";

const NotImplementedScreen = () => {
  const router = useRouter();

  const handleGoBack = () => {
    // Возвращаемся на экран выбора профессии
    // В вашей структуре это скорее всего корень табов или training
    router.push("../components/NotImplementedScreen");
    // ИЛИ если это модальное окно:
    // router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>В разработке</Text>
      </View>

      {/* Контент */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Construction size={80} color="#FF9500" />
        </View>

        <Text style={styles.heading}>Скоро будет!</Text>

        <Text style={styles.description}>
          Вопросы для этой профессии находятся в разработке. Мы активно работаем
          над их добавлением.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Выбрать другую профессию</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
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
    backgroundColor: "#FFF4E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 300,
  },
  button: {
    backgroundColor: "#007AFF",
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

export default NotImplementedScreen;
