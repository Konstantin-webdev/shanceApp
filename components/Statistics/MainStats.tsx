import { useTheme } from '@/components/ThemeProvider';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MainStatsProps {
  stats: {
    totalTests: number;
    averageScore: number;
    passedTests: number;
  };
}

export function MainStats({ stats }: MainStatsProps) {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    statsCard: {
      margin: 16,
      padding: 16,
      borderRadius: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      backgroundColor: colors.card,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowColor: colors.border,
      elevation: 4,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.success,
    },
    statLabel: {
      fontSize: 12,
      marginTop: 6,
      textAlign: 'center',
      color: colors.muted,
    },
  }), [colors]);

  return (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.totalTests}</Text>
        <Text style={styles.statLabel}>Всего тестов</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.passedTests}</Text>
        <Text style={styles.statLabel}>Сдано успешно</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.averageScore.toFixed(0)}%</Text>
        <Text style={styles.statLabel}>Средний балл</Text>
      </View>
    </View>
  );
}