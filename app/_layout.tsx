import ProfessionSelectionScreen from "@/components/ProfessionSelectionScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import WelcomeScreen from "@/components/WelcomeScreen";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useProfessionStore } from "./store/useProfessionStore";
import { useUserStore } from "./store/useUserStore";

export default function RootLayout() {
  const { userName } = useUserStore();
  const { selectedProfession } = useProfessionStore();
  const [currentScreen, setCurrentScreen] = useState<
    "loading" | "welcome" | "profession" | "tabs"
  >("loading");

  useEffect(() => {
    if (userName === null) {
      // Первый запуск - имя не установлено
      setCurrentScreen("welcome");
    } else if (selectedProfession === null) {
      // Имя есть, но профессия не выбрана
      setCurrentScreen("profession");
    } else {
      // И имя и профессия есть - переходим к табам
      setCurrentScreen("tabs");
    }
  }, [userName, selectedProfession]);

  if (currentScreen === "loading") {
    // Можно добавить лоадер
    return null;
  }

  // Обернем все в ThemeProvider
  const renderContent = () => {
    if (currentScreen === "welcome") {
      return <WelcomeScreen />;
    }

    if (currentScreen === "profession") {
      return <ProfessionSelectionScreen />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
  };

  return (
    <ThemeProvider>
      <SafeAreaProvider>{renderContent()}</SafeAreaProvider>
    </ThemeProvider>
  );
}
