// app/_layout.tsx
import ProfessionSelectionScreen from "@/components/ProfessionSelectionScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import WelcomeScreen from "@/components/WelcomeScreen";
import GreetingScreen from "@/components/GreetingScreen";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useProfessionStore } from "./store/useProfessionStore";
import { useUserStore } from "./store/useUserStore";
import { useOnboardingStore } from "./store/useOnboardingStore";
import { AppState } from "react-native";

// Время сессии в миллисекундах (например, 5 минут)
const SESSION_TIMEOUT = 5 * 60 * 1000;

export default function RootLayout() {
  const { userName } = useUserStore();
  const { selectedProfession } = useProfessionStore();
  const {
    hasSeenGreetingInThisSession,
    setHasSeenGreetingInThisSession,
    appStartTime,
    setAppStartTime,
  } = useOnboardingStore();

  const [currentScreen, setCurrentScreen] = useState<
    "loading" | "welcome" | "greeting" | "profession" | "tabs"
  >("loading");

  // Проверяем, является ли это началом новой сессии
  useEffect(() => {
    const now = Date.now();
    const isNewSession = !appStartTime || now - appStartTime > SESSION_TIMEOUT;

    if (isNewSession) {
      setAppStartTime(now);
      setHasSeenGreetingInThisSession(false);
    }
  }, []);

  // Слушатель изменения состояния приложения (свернуто/развернуто)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        // При сворачивании приложения не сбрасываем сессию
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (userName === null) {
      setCurrentScreen("welcome");
    } else if (selectedProfession === null) {
      setCurrentScreen("profession");
    } else if (!hasSeenGreetingInThisSession) {
      // Показываем приветствие только если в этой сессии еще не видели
      setCurrentScreen("greeting");
    } else {
      setCurrentScreen("tabs");
    }
  }, [userName, selectedProfession, hasSeenGreetingInThisSession]);

  // Эффект для таймера на экране приветствия
  useEffect(() => {
    if (currentScreen === "greeting") {
      const timer = setTimeout(() => {
        setHasSeenGreetingInThisSession(true); // Отмечаем, что в этой сессии увидели
        setCurrentScreen("tabs");
      }, 2700);

      return () => clearTimeout(timer);
    }
  }, [currentScreen, setHasSeenGreetingInThisSession]);

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
      return <GreetingScreen userName={userName!} />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
  };

  return (
    <ThemeProvider>
      <SafeAreaProvider>{renderContent()}</SafeAreaProvider>
    </ThemeProvider>
  );
}
