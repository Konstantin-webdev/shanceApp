import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, Clock } from 'lucide-react-native';
import ProfessionSelector from '../components/ProfessionSelector';
import { useProfessionStore } from '@/app/store/useProfessionStore';

export default function ProfessionSelectionScreen() {
    const { selectedProfession } = useProfessionStore();
    const router = useRouter();
    const [canSkip, setCanSkip] = useState(false);

    // Разрешаем пропуск через 3 секунды
    useEffect(() => {
        const timer = setTimeout(() => {
            setCanSkip(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        if (selectedProfession) {
            router.replace('/(tabs)');
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Выбор профессии</Text>
                    <Text style={styles.subtitle}>
                        Выберите профессию для персонализации обучения.
                        Это поможет подобрать подходящие вопросы.
                    </Text>
                </View>

                <View style={styles.content}>
                    {/* Компонент выбора профессии */}
                    <ProfessionSelector />

                    <View style={styles.professionInfo}>
                        {selectedProfession ? (
                            <>
                                <View style={styles.selectionCard}>
                                    <Text style={styles.selectedTitle}>Вы выбрали:</Text>
                                    <Text style={styles.professionName}>{selectedProfession.name}</Text>
                                    <Text style={styles.professionCount}>
                                        {selectedProfession.questionCount} вопросов
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.continueButton}
                                        onPress={handleContinue}
                                        activeOpacity={0.8}
                                    >
                                        <ArrowRight size={24} color="#FFFFFF" />
                                        <Text style={styles.continueButtonText}>Продолжить</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <View style={styles.emptySelection}>
                                <Clock size={40} color="#8E8E93" />
                                <Text style={styles.emptyTitle}>Профессия не выбрана</Text>
                                <Text style={styles.emptyText}>
                                    Выберите профессию из списка выше или
                                </Text>

                                {canSkip ? (
                                    <TouchableOpacity
                                        style={styles.skipButton}
                                        onPress={handleSkip}
                                        activeOpacity={0.6}
                                    >
                                        <Text style={styles.skipButtonText}>пропустить сейчас</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.skipTimer}>
                                        <Text style={styles.skipTimerText}>
                                            Можно будет пропустить через 3 секунды...
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Отступ снизу */}
                    <View style={styles.bottomSpacer} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 8,
        lineHeight: 22,
    },
    content: {
        padding: 20,
    },
    professionInfo: {
        marginTop: 20,
    },
    selectionCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        alignItems: 'center',
    },
    selectedTitle: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 8,
    },
    professionName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    professionCount: {
        fontSize: 16,
        color: '#34C759',
        marginBottom: 24,
    },
    continueButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
        width: '100%',
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    emptySelection: {
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1C1C1E',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 16,
    },
    skipButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    skipButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    skipTimer: {
        paddingVertical: 12,
    },
    skipTimerText: {
        color: '#8E8E93',
        fontSize: 14,
        fontStyle: 'italic',
    },
    bottomSpacer: {
        height: 40,
    },
});