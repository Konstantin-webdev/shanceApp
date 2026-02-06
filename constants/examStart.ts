import { useTheme } from "@/components/ThemeProvider";
import { AlertCircle, Award, Clock } from "lucide-react-native";
const { colors } = useTheme();

export const featureItems = [
  {
    icon: Clock,
    color: colors.danger,
    title: "Ограничение по времени",
    description: "10 минут на 10 вопросов (не тормози!)",
  },
  {
    icon: AlertCircle,
    color: colors.warning,
    title: "Без подсказок",
    description: "Проверка реальных знаний",
  },
  {
    icon: Award,
    color: colors.primary,
    title: "Сертификат",
    description: "Результат сохраняется в истории и грамоту получишь",
  },
];

export const rules = [
  "• 10 случайных вопросов",
  "• Таймер 10 минут",
  "• Нет возможности исправить ответ",
  "• Минимальный балл: 70%",
];
