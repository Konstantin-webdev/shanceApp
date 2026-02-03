import { useTheme } from "@/components/ThemeProvider";
import { Tabs } from "expo-router";
import {
  BookOpenText,
  ChartColumn,
  FileCheck,
  LucideIcon,
  Settings2,
} from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function TabIcon({
  Icon,
  focused,
  tabKey,
  size = 24,
}: {
  Icon: LucideIcon;
  focused: boolean;
  tabKey: string;
  size: number;
}) {
  const { colors } = useTheme();

  const getTabColor = () => {
    switch (tabKey) {
      case "training":
        return colors.tabTraining;
      case "exam":
        return colors.tabExam;
      case "stats":
        return colors.tabStats;
      case "settings":
        return colors.tabSettings;
      default:
        return colors.primary;
    }
  };

  const tabColor = getTabColor();
  const color = focused ? tabColor : colors.tabBarInactive;

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
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginBottom: 2,
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
    paddingTop: 2,
  },
});
