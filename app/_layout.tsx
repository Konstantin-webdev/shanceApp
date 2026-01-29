import ProfessionSelectionScreen from "@/components/ProfessionSelectionScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import WelcomeScreen from "@/components/WelcomeScreen";
import GreetingScreen from "@/components/GreetingScreen"; // Добавляем новый экран
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useProfessionStore } from "./store/useProfessionStore";
import { useUserStore } from "./store/useUserStore";

export default function RootLayout() {
  const { userName } = useUserStore();
  const { selectedProfession } = useProfessionStore();
  const [currentScreen, setCurrentScreen] = useState<
    "loading" | "welcome" | "greeting" | "profession" | "tabs"
  >("loading"); // Добавляем новый экран в состояние

  useEffect(() => {
    if (userName === null) {
      setCurrentScreen("welcome");
    } else if (selectedProfession === null) {
      setCurrentScreen("profession");
    } else {
      // Если есть и имя, и профессия, показываем экран приветствия
      setCurrentScreen("greeting");
    }
  }, [userName, selectedProfession]);

  // Эффект для таймера на экране приветствия
  useEffect(() => {
    if (currentScreen === "greeting") {
      const timer = setTimeout(() => {
        setCurrentScreen("tabs");
      }, 2700);

      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  if (currentScreen === "loading") {
    return null;
  }

  const renderContent = () => {
    if (currentScreen === "welcome") {
      return <WelcomeScreen />;
    }

    if (currentScreen === "profession") {
      return <ProfessionSelectionScreen />;
    }

    if (currentScreen === "greeting") {
      return <GreetingScreen userName={userName!} />; // userName не null на этом этапе
    }

    return <Stack screenOptions={{ headerShown: false }} />;
  };

  return (
    <ThemeProvider>
      <SafeAreaProvider>{renderContent()}</SafeAreaProvider>
    </ThemeProvider>
  );
}
