import { useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useTheme } from "@/components/ThemeProvider";
import { FEATURE_CONFIGS, RULES } from "@/constants/examStart";
import { ExamScreenStyles } from "@/styles/exam/ExamScreen.styles";

export default function ExamScreen() {
  const router = useRouter();
  const { selectedProfession } = useProfessionStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const { colors } = useTheme();
  const styles = ExamScreenStyles(colors);

  const handleStartExam = () => {
    if (isNavigating || !selectedProfession) return;
    setIsNavigating(true);
    router.push("/exam/session");
    setTimeout(() => setIsNavigating(false), 1000);
  };

  const featureItems = FEATURE_CONFIGS.map((item) => ({
    ...item,
    color: colors[item.colorKey],
  }));

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Экзамен</Text>
          <Text style={styles.subtitle}>Режим проверки знаний</Text>
        </View>

        <View style={styles.content}>
          {selectedProfession && (
            <View style={styles.professionInfo}>
              <Text style={styles.professionName}>
                {selectedProfession.name}
              </Text>
              <Text style={styles.professionStats}>
                {selectedProfession.questionCount} вопросов доступно
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.startButton,
              (!selectedProfession || isNavigating) && styles.disabledButton,
            ]}
            onPress={handleStartExam}
            disabled={!selectedProfession || isNavigating}
            activeOpacity={0.8}
          >
            <Play size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>
              {isNavigating ? "Загрузка..." : "Начать экзамен"}
            </Text>
          </TouchableOpacity>

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Особенности экзамена:</Text>

            {featureItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <View key={index} style={styles.featureItem}>
                  <Icon size={20} color={item.color} />
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>{item.title}</Text>
                    <Text style={styles.featureDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              );
            })}

            <View style={styles.rules}>
              <Text style={styles.rulesTitle}>Правила:</Text>
              {RULES.map((rule, index) => (
                <Text key={index} style={styles.ruleText}>
                  {rule}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
