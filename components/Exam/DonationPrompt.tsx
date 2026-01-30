// app/components/DonationPrompt.tsx
import { useTheme } from "@/components/ThemeProvider";
import React from "react";
import {
    Linking,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Heart, X, Coffee, Sparkles, Gift } from "lucide-react-native";

interface DonationPromptProps {
    visible: boolean;
    onClose: () => void;
    userName?: string;
    score?: number;
}

export function DonationPrompt({
    visible,
    onClose,
    userName = "Пользователь",
    score = 0,
}: DonationPromptProps) {
    const { colors, isDark } = useTheme();

    const handleDonate = () => {
        // Здесь ваша ссылка на донат
        // Пример для ЮMoney:
        const donationUrl = "https://yoomoney.ru/to/410011XXXXXXXXX";
        // Или для CloudTips:
        // const donationUrl = "https://pay.cloudtips.ru/p/XXXXXXXXX";

        Linking.openURL(donationUrl).catch((err) => {
            console.error("Ошибка при открытии ссылки:", err);
        });
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.primary + "20",
                        },
                    ]}
                >
                    {/* Кнопка закрытия */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                        <X size={20} color={colors.muted} />
                    </TouchableOpacity>

                    {/* Заголовок с иконкой */}
                    <View style={styles.header}>
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: colors.primary + "15" },
                            ]}
                        >
                            <Heart size={40} color={colors.primary} />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Поздравляем, {userName}! 🎉
                        </Text>
                    </View>

                    {/* Основное сообщение */}
                    <View style={styles.messageContainer}>
                        <Text style={[styles.message, { color: colors.muted }]}>
                            Вы успешно сдали экзамен с результатом{" "}
                            <Text style={{ color: colors.success, fontWeight: "700" }}>
                                {score}%
                            </Text>
                            ! Приложение помогло вам подготовиться?
                        </Text>

                        <View style={styles.benefitsContainer}>
                            <View style={styles.benefitItem}>
                                <Sparkles size={16} color={colors.primary} />
                                <Text style={[styles.benefitText, { color: colors.text }]}>
                                    Каждый донат помогает улучшать приложение
                                </Text>
                            </View>
                            <View style={styles.benefitItem}>
                                <Gift size={16} color={colors.primary} />
                                <Text style={[styles.benefitText, { color: colors.text }]}>
                                    Добавлять новые вопросы и профессии
                                </Text>
                            </View>
                            <View style={styles.benefitItem}>
                                <Coffee size={16} color={colors.primary} />
                                <Text style={[styles.benefitText, { color: colors.text }]}>
                                    Поддерживать разработчика
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Кнопки */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.donateButton,
                                { backgroundColor: colors.primary },
                            ]}
                            onPress={handleDonate}
                            activeOpacity={0.8}
                        >
                            <Heart size={20} color="#FFFFFF" />
                            <Text style={styles.donateButtonText}>Поддержать проект</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.laterButton,
                                { borderColor: colors.border },
                            ]}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.laterButtonText, { color: colors.muted }]}>
                                Спасибо, может быть позже
                            </Text>
                        </TouchableOpacity>

                        <Text style={[styles.note, { color: colors.muted }]}>
                            Приложение останется полностью бесплатным
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    closeButton: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        lineHeight: 28,
    },
    messageContainer: {
        marginBottom: 24,
    },
    message: {
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 20,
    },
    benefitsContainer: {
        gap: 12,
    },
    benefitItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    benefitText: {
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
    },
    buttonsContainer: {
        gap: 12,
    },
    donateButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 10,
    },
    donateButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    laterButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
    },
    laterButtonText: {
        fontSize: 14,
    },
    note: {
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
        marginTop: 8,
    },
});