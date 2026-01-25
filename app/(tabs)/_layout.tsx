import { Tabs } from "expo-router";
import {
  BookOpenText,
  ChartColumn,
  FileCheck,
  Settings2
} from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Цвета для каждого таба
const TAB_COLORS = {
  training: "#007AFF", // Синий для тренировки
  exam: "#FF9500",     // Оранжевый для экзамена
  stats: "#34C759",    // Зеленый для статистики
  settings: "#AF52DE", // Фиолетовый для настроек
};

// Цвета для неактивных иконок (более светлые)
const INACTIVE_COLORS = {
  training: "#B3D7FF",
  exam: "#FFE5B3",
  stats: "#D5F0DD",
  settings: "#E8D3F2",
};

// Анимированная иконка с индикатором
function AnimatedTabIcon({
  Icon,
  focused,
  tabName,
  size = 24
}: {
  Icon: any;
  focused: boolean;
  tabName: keyof typeof TAB_COLORS;
  size: number;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, {
      damping: 10,
      stiffness: 100,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = focused ? TAB_COLORS[tabName] : INACTIVE_COLORS[tabName];

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={animatedStyle}>
        <Icon size={size} color={color} />
      </Animated.View>
      {/* Индикатор активного таба */}
      {focused && (
        <View style={[
          styles.activeIndicator,
          { backgroundColor: TAB_COLORS[tabName] }
        ]} />
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Тренировка",
          tabBarIcon: ({ focused, size }) => (
            <AnimatedTabIcon
              Icon={BookOpenText}
              focused={focused}
              tabName="training"
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
            <AnimatedTabIcon
              Icon={FileCheck}
              focused={focused}
              tabName="exam"
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
            <AnimatedTabIcon
              Icon={ChartColumn}
              focused={focused}
              tabName="stats"
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
            <AnimatedTabIcon
              Icon={Settings2}
              focused={focused}
              tabName="settings"
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 90,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});