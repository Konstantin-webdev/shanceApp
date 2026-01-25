import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../store/useUserStore';

export default function SettingsScreen() {
    const { userName, setUserName, clearUserName } = useUserStore();
    const [newName, setNewName] = useState(userName || '');
    const router = useRouter();

    const handleSaveName = () => {
        if (!newName.trim()) {
            Alert.alert('Ошибка', 'Имя не может быть пустым');
            return;
        }

        setUserName(newName.trim());
        Alert.alert('Успешно', 'Имя обновлено');
    };

    const handleClearName = () => {
        Alert.alert(
            'Сброс имени',
            'Вы уверены, что хотите сбросить имя? При следующем запуске приложение запросит его снова.',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Сбросить',
                    style: 'destructive',
                    onPress: () => {
                        clearUserName();
                        setNewName('');
                        Alert.alert('Успешно', 'Имя сброшено');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Заголовок */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft size={24} color="#007AFF" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Настройки</Text>
                    </View>

                    {/* Блок с именем пользователя */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Личные данные</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ваше имя</Text>
                            <TextInput
                                style={styles.input}
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="Введите ваше имя"
                                maxLength={50}
                                returnKeyType="done"
                            />
                            <Text style={styles.hint}>
                                Это имя будет отображаться в приветствиях
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, !newName.trim() && styles.saveButtonDisabled]}
                            onPress={handleSaveName}
                            disabled={!newName.trim()}
                        >
                            <Text style={styles.saveButtonText}>Сохранить имя</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Блок сброса */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Опасная зона</Text>
                        <Text style={styles.dangerText}>
                            Сбросив имя, вы будете перенаправлены на экран приветствия при следующем запуске
                        </Text>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClearName}
                        >
                            <Text style={styles.clearButtonText}>Сбросить имя</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Текущее имя */}
                    {userName && (
                        <View style={styles.currentNameCard}>
                            <Text style={styles.currentNameTitle}>Текущее имя:</Text>
                            <Text style={styles.currentName}>{userName}</Text>
                        </View>
                    )}

                    {/* Отступ снизу для удобства */}
                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </KeyboardAvoidingView>
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
    content: {
        padding: 20,
        paddingTop: 20, // Добавляем отступ сверху
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 8,
    },
    hint: {
        fontSize: 14,
        color: '#8E8E93',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#C7C7CC',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dangerText: {
        fontSize: 14,
        color: '#FF3B30',
        marginBottom: 16,
    },
    clearButton: {
        borderWidth: 2,
        borderColor: '#FF3B30',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
    currentNameCard: {
        backgroundColor: '#F0F7FF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    currentNameTitle: {
        fontSize: 16,
        color: '#007AFF',
        marginBottom: 8,
    },
    currentName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bottomSpacer: {
        height: 40,
    },
});