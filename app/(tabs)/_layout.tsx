// app/tabs/_layout.tsx
import { useTheme } from "@/components/ThemeProvider";
import { Tabs } from "expo-router";
import {
  BookOpenText,
  ChartColumn,
  FileCheck,
  Settings2,
} from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Простая иконка с индикатором
function TabIcon({
  Icon,
  focused,
  tabKey,
  size = 24,
}: {
  Icon: any;
  focused: boolean;
  tabKey: string;
  size: number;
}) {
  const { colors } = useTheme();

  // Цвета для активных иконок
  const getActiveColor = () => {
    switch (tabKey) {
      case "training":
        return colors.primary;
      case "exam":
        return colors.warning;
      case "stats":
        return colors.success;
      case "settings":
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  const activeColor = getActiveColor();
  const color = focused ? activeColor : colors.muted;

  return (
    <View style={styles.iconContainer}>
      <Icon size={size} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            height: 60, // Уменьшаем высоту
            paddingBottom: 5, // Уменьшаем нижний паддинг
            paddingTop: 5, // Уменьшаем верхний паддинг
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginBottom: 2, // Уменьшаем отступ
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Тренировка",
            tabBarIcon: ({ focused, size }) => (
              <TabIcon
                Icon={BookOpenText}
                focused={focused}
                tabKey="training"
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="exam"
          options={{
            title: "Экзамен",
            tabBarIcon: ({ focused, size }) => (
              <TabIcon
                Icon={FileCheck}
                focused={focused}
                tabKey="exam"
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: "Статистика",
            tabBarIcon: ({ focused, size }) => (
              <TabIcon
                Icon={ChartColumn}
                focused={focused}
                tabKey="stats"
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Настройки",
            tabBarIcon: ({ focused, size }) => (
              <TabIcon
                Icon={Settings2}
                focused={focused}
                tabKey="settings"
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingTop: 2, // Добавляем небольшой отступ сверху
  },
  activeIndicator: {
    position: "absolute",
    bottom: -6, // Поднимаем индикатор
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
