import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../ThemeProvider';

interface SectionHeaderProps {
    title: string;
    subtitle: string;
    titleColor: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    titleColor,
}) => {
    const { colors } = useTheme();

    const styles = useMemo(() => StyleSheet.create({
        header: {
            marginTop: 8,
            backgroundColor: colors.card,
            padding: 16,
        },
        title: {
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 'bold',
            color: titleColor,
        },
        subtitle: {
            textAlign: 'center',
            fontSize: 16,
            color: colors.muted,
            marginTop: 4,
        },
    }), [colors, titleColor]);

    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};