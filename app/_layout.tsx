import GreetingScreen from "@/components/GreetingScreen";
import ProfessionSelectionScreen from "@/components/ProfessionSelectionScreen";
import { useOnboardingStore } from "@/components/store/useOnboardingStore";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useUserStore } from "@/components/store/useUserStore";
import { ThemeProvider } from "@/components/ThemeProvider";
import WelcomeScreen from "@/components/WelcomeScreen";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

  useEffect(() => {
    const now = Date.now();
    const isNewSession = !appStartTime || now - appStartTime > SESSION_TIMEOUT;

    if (isNewSession) {
      setAppStartTime(now);
      setHasSeenGreetingInThisSession(false);
    }
  }, []);

  useEffect(() => {
    if (userName === undefined || selectedProfession === undefined) {
      return;
    }

    if (userName === null) {
      setCurrentScreen("welcome");
    } else if (selectedProfession === null) {
      setCurrentScreen("profession");
    } else if (!hasSeenGreetingInThisSession) {
      setCurrentScreen("greeting");
    } else {
      setCurrentScreen("tabs");
    }
  }, [userName, selectedProfession, hasSeenGreetingInThisSession]);

  useEffect(() => {
    if (currentScreen === "greeting") {
      const timer = setTimeout(() => {
        setHasSeenGreetingInThisSession(true);
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
