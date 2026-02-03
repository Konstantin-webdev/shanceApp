import { View, Text, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { User } from "lucide-react-native";

interface GreetingScreenProps {
  userName: string;
}

export default function GreetingScreen({ userName }: GreetingScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Анимационные значения
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Последовательная анимация
    Animated.sequence([
      // 1. Появление иконки с эффектом пружины
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // 2. Появление основного текста
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // 3. Появление подзаголовка
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Иконка пользователя */}
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            opacity: iconOpacity,
            transform: [{ scale: iconScale }],
          },
        ]}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: colors.primary }]}
        >
          <User size={64} color={colors.card} strokeWidth={2.5} />
        </View>
      </Animated.View>

      {/* Основной текст приветствия */}
      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textTranslateY }],
        }}
      >
        <Text style={[styles.greeting, { color: colors.text }]}>
          Привет,{" "}
          <Text style={[styles.userName, { color: colors.primary }]}>
            {userName}
          </Text>
          !
        </Text>
      </Animated.View>

      {/* Подзаголовок */}
      <Animated.View style={{ opacity: subtitleOpacity }}>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Добро пожаловать в приложение
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  userName: {
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
  },
});
