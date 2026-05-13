import { ThemeColors } from "@/components/ThemeProvider";
import { StyleSheet } from "react-native";

export const SectionHeaderStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        header: {
            backgroundColor: colors.card,
            padding: 20,
            borderRadius: 12,
            margin: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        title: {
            textAlign: "center" as const,
            fontSize: 32,
            fontWeight: "bold" as const,
            color: colors.danger,
        },
        subtitle: {
            textAlign: "center" as const,
            fontSize: 16,
            color: colors.muted,
            marginTop: 4,
        }
    });
