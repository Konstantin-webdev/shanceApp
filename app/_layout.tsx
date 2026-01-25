import { Stack } from 'expo-router';
import { useUserStore } from './store/useUserStore';
import { useProfessionStore } from './store/useProfessionStore';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from '@/components/WelcomeScreen';
import ProfessionSelectionScreen from '@/components/ProfessionSelectionScreen';

export default function RootLayout() {
  const { userName } = useUserStore();
  const { selectedProfession } = useProfessionStore();
  const [currentScreen, setCurrentScreen] = useState<'loading' | 'welcome' | 'profession' | 'tabs'>('loading');

  useEffect(() => {
    if (userName === null) {
      // Первый запуск - имя не установлено
      setCurrentScreen('welcome');
    } else if (selectedProfession === null) {
      // Имя есть, но профессия не выбрана
      setCurrentScreen('profession');
    } else {
      // И имя и профессия есть - переходим к табам
      setCurrentScreen('tabs');
    }
  }, [userName, selectedProfession]);

  if (currentScreen === 'loading') {
    // Можно добавить лоадер
    return null;
  }

  if (currentScreen === 'welcome') {
    return (
      <SafeAreaProvider>
        <WelcomeScreen />
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'profession') {
    return (
      <SafeAreaProvider>
        <ProfessionSelectionScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}