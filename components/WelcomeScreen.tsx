import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/app/store/useUserStore';

export default function WelcomeScreen() {
    const [name, setName] = useState('');
    const { setUserName } = useUserStore();
    const router = useRouter();

    const handleContinue = () => {
        if (!name.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, введите ваше имя');
            return;
        }

        setUserName(name.trim());
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Добро пожаловать!</Text>
                    <Text style={styles.subtitle}>
                        Введите ваше имя, чтобы начать использовать приложение
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ваше имя"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        maxLength={50}
                        returnKeyType="done"
                        onSubmitEditing={handleContinue}
                    />

                    <TouchableOpacity
                        style={[styles.button, !name.trim() && styles.buttonDisabled]}
                        onPress={handleContinue}
                        disabled={!name.trim()}
                    >
                        <Text style={styles.buttonText}>Продолжить</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#007AFF',
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        justifyContent: 'center',
        marginTop: 60, // Отступ от верха для красивого отображения
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        borderWidth: 2,
        borderColor: '#E5E5EA',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#C7C7CC',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});