
import { AlertCircle, Award, Clock } from "lucide-react-native";

export const FEATURE_CONFIGS = [
  {
    icon: Clock,
    colorKey: "danger" as const,
    title: "Ограничение по времени",
    description: "10 минут на 10 вопросов (не тормози!)",
  },
  {
    icon: AlertCircle,
    colorKey: "warning" as const,
    title: "Без подсказок",
    description: "Проверка реальных знаний",
  },
  {
    icon: Award,
    colorKey: "primary" as const,
    title: "Сертификат",
    description: "Результат сохраняется в истории и грамоту получишь",
  },
];

export const RULES = [
  "• 10 случайных вопросов",
  "• Таймер 10 минут",
  "• Нет возможности исправить ответ",
  "• Минимальный балл: 70%",
];