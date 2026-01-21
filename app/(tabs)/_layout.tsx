import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "#007AFF", headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Тренировка",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📚</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="exam"
        options={{
          title: "Экзамен",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📝</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Статистика",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📊</Text>
          ),
        }}
      />
    </Tabs>
  );
}
