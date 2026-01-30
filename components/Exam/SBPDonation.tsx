// app/components/SBPDonation.tsx
import { useTheme } from "@/components/ThemeProvider";
import * as Clipboard from 'expo-clipboard';
import React, { useState } from "react";
import {
    Alert,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Banknote, Smartphone } from "lucide-react-native";

interface SBPDonationProps {
    phoneNumber: string;
}

export function SBPDonation({ phoneNumber }: SBPDonationProps) {
    const { colors } = useTheme();

    const openSberbank = async () => {
        try {
            // Пробуем несколько схем
            const schemes = [
                `sberpay://?action=transfer&phone=${phoneNumber.replace('+', '')}`,
                `sberbankonline://payments/services/phone?phone=${phoneNumber.replace('+', '')}`,
                `sberbank://transfer?phone=${phoneNumber.replace('+', '')}`,
            ];

            for (const url of schemes) {
                try {
                    const canOpen = await Linking.canOpenURL(url);
                    if (canOpen) {
                        await Linking.openURL(url);
                        return;
                    }
                } catch (e) {
                    continue;
                }
            }

            // Если не открылось
            Alert.alert(
                "Не удалось открыть Сбербанк",
                "Попробуйте:\n1. Открыть Сбербанк вручную\n2. Выбрать перевод по номеру\n3. Ввести номер вручную"
            );

        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const openGazprombank = async () => {
        try {
            const url = `gazprombank://transfer/to/phone/${phoneNumber.replace('+', '')}`;
            const canOpen = await Linking.canOpenURL(url);

            if (canOpen) {
                await Linking.openURL(url);
            } else {
                Alert.alert(
                    "Не удалось открыть Газпромбанк",
                    "Попробуйте открыть приложение вручную"
                );
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                Поддержать разработчика
            </Text>

            <Text style={[styles.subtitle, { color: colors.muted }]}>
                Номер: {phoneNumber}
            </Text>

            <View style={styles.buttonsRow}>
                <TouchableOpacity
                    style={[styles.bankButton, { backgroundColor: '#21A038' }]} // Зеленый Сбер
                    onPress={openSberbank}
                    activeOpacity={0.7}
                >
                    <Smartphone size={20} color="#FFFFFF" />
                    <Text style={styles.bankButtonText}>Сбербанк</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.bankButton, { backgroundColor: '#004B87' }]} // Синий Газпром
                    onPress={openGazprombank}
                    activeOpacity={0.7}
                >
                    <Smartphone size={20} color="#FFFFFF" />
                    <Text style={styles.bankButtonText}>Газпромбанк</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.note, { color: colors.muted }]}>
                Любая сумма поможет развитию приложения
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 16,
    },
    buttonsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    bankButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        gap: 8,
    },
    bankButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    note: {
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
    },
});