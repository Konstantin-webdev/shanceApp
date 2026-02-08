
import { useRouter } from "expo-router";
import { ArrowLeft, Clock } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/components/ThemeProvider";
import { useProfessionStore } from "@/components/store/useProfessionStore";
import { useExamSession } from "@/utils/useExamSession";
import { useExamTimer } from "@/utils/useExamTimer";

export default function ExamSessionScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedProfession } = useProfessionStore();

    const exam = useExamSession(selectedProfession?.id || 0);

    const timer = useExamTimer(10, () => {
        const results = exam.getResults();
        if (results && selectedProfession) {
            router.replace({
                pathname: "/exam/results",
                params: {
                    correctAnswers: results.correctCount.toString(),
                    totalQuestions: results.total.toString(),
                    professionName: selectedProfession.name,
                    professionId: selectedProfession.id.toString(),
                    score: results.score.toString(),
                    passed: results.passed.toString(),
                    questionsData: JSON.stringify(results.questions),
                    answersData: JSON.stringify(results.answers),
                    saved: "false",
                    timeUp: "true",
                },
            });
        }
    });

    if (!selectedProfession) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Выберите профессию</Text>
            </View>
        );
    }

    // Загрузка
    if (exam.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Загрузка вопросов...</Text>
            </View>
        );
    }

    // Нет вопросов
    if (!exam.currentQuestion) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Нет доступных вопросов</Text>
            </View>
        );
    }

    const handleFinish = () => {
        const results = exam.getResults();
        if (results && selectedProfession) {
            const elapsedSeconds = 600 - timer.remainingSeconds;

            router.replace({
                pathname: "/exam/results",
                params: {
                    correctAnswers: results.correctCount.toString(),
                    totalQuestions: results.total.toString(),
                    professionName: selectedProfession.name,
                    professionId: selectedProfession.id.toString(),
                    score: results.score.toString(),
                    passed: results.passed.toString(),
                    timeSpent: elapsedSeconds.toString(),
                    questionsData: JSON.stringify(results.questions),
                    answersData: JSON.stringify(results.answers),
                    saved: "false",
                },
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Шапка */}
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Clock size={20} color={colors.danger} />
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                            {timer.formattedTime}
                        </Text>
                    </View>

                    <Text style={{ color: colors.text, fontSize: 16 }}>
                        {exam.currentIndex + 1}/{exam.totalQuestions}
                    </Text>
                </View>

            </View>

            {/* Вопрос */}
            <ScrollView style={{ flex: 1, padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
                    {exam.currentQuestion.text}
                </Text>

                {/* Варианты ответов */}
                {exam.currentQuestion.options.map((answer, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            padding: 16,
                            marginBottom: 12,
                            borderRadius: 12,
                            backgroundColor: exam.answers[exam.currentIndex] === answer.id
                                ? colors.primary
                                : colors.card,
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                        onPress={() => exam.handleAnswer(answer.id)}
                    >
                        <Text style={{
                            color: exam.answers[exam.currentIndex] === answer.id
                                ? '#FFFFFF'
                                : colors.text,
                        }}>
                            {answer.text}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>


            {/* Кнопка навигации */}
            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
                {exam.isLastQuestion ? (
                    <TouchableOpacity
                        style={{
                            backgroundColor: exam.isAnswered ? colors.danger : colors.border,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                        }}
                        onPress={handleFinish}
                        disabled={!exam.isAnswered}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                            Завершить экзамен
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={{
                            backgroundColor: exam.isAnswered ? colors.primary : colors.border,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                        }}
                        onPress={exam.nextQuestion}
                        disabled={!exam.isAnswered}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                            Следующий вопрос
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}