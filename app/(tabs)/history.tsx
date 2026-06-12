import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../src/services/api';
import { CaloriesBarChart } from '../../src/components/history/CaloriesBarChart';
import { MacrosAreaChart } from '../../src/components/history/MacrosAreaChart';
import { DayDetailCard } from '../../src/components/history/DayDetailCard';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { Spinner } from '../../src/components/ui/Spinner';
import { colors } from '../../src/constants/colors';
import { fontSize, spacing, borderRadius } from '../../src/constants/layout';
import type { DayHistory, PeriodSummary } from '../../src/types';

type FilterPeriod = '7d' | '30d';

export default function HistoryScreen() {
  const [period, setPeriod] = useState<FilterPeriod>('7d');

  const days = period === '7d' ? 7 : 30;
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');

  const historyQuery = useQuery({
    queryKey: ['history', period],
    queryFn: async () => {
      const { data } = await api.get('/history/', { params: { start_date: startDate, end_date: endDate } });
      return data as DayHistory[];
    },
  });

  const summaryQuery = useQuery({
    queryKey: ['historySummary', period],
    queryFn: async () => {
      const { data } = await api.get('/history/summary/', { params: { start_date: startDate, end_date: endDate } });
      return data as PeriodSummary;
    },
  });

  const history = historyQuery.data ?? [];
  const summary = summaryQuery.data;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.screenTitle}>Historial</Text>

        {/* Period filter */}
        <View style={styles.filterRow}>
          {(['7d', '30d'] as FilterPeriod[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.filterBtn, period === p && styles.filterBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.filterText, period === p && styles.filterTextActive]}>
                {p === '7d' ? 'Semana' : 'Mes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {historyQuery.isLoading ? (
          <Spinner size="large" />
        ) : (
          <>
            {/* Summary cards */}
            {summary && (
              <View style={styles.summaryRow}>
                <SummaryCard label="Promedio" value={`${Math.round(summary.avg_calories)} kcal`} />
                <SummaryCard label="Días reg." value={`${summary.registered_days}/${summary.total_days}`} />
                <SummaryCard label="Racha" value={`${summary.streak_days}🔥`} />
              </View>
            )}

            {/* Calories bar chart */}
            <GlassCard style={styles.chartCard}>
              <Text style={styles.cardTitle}>Calorías diarias</Text>
              <CaloriesBarChart data={history} />
            </GlassCard>

            {/* Macros area chart */}
            <GlassCard style={styles.chartCard}>
              <Text style={styles.cardTitle}>Macronutrientes</Text>
              <MacrosAreaChart data={history} />
            </GlassCard>

            {/* Day cards */}
            <Text style={styles.sectionTitle}>Detalle por día</Text>
            {history.length === 0 ? (
              <Text style={styles.emptyText}>Sin registros</Text>
            ) : (
              [...history].reverse().map((day) => (
                <DayDetailCard key={day.date} day={day} />
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <GlassCard style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, gap: spacing.md },
  screenTitle: { color: colors.white, fontSize: fontSize.xxl, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: spacing.sm },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface800,
  },
  filterBtnActive: { backgroundColor: colors.brand500 },
  filterText: { color: colors.surface100, fontSize: fontSize.sm, fontWeight: '500' },
  filterTextActive: { color: colors.white },
  summaryRow: { flexDirection: 'row', gap: spacing.sm },
  summaryCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  summaryValue: { color: colors.white, fontSize: fontSize.lg, fontWeight: '700' },
  summaryLabel: { color: colors.surface100, fontSize: fontSize.xs, marginTop: 2 },
  chartCard: {},
  cardTitle: { color: colors.white, fontSize: fontSize.lg, fontWeight: '600', marginBottom: spacing.sm },
  sectionTitle: { color: colors.white, fontSize: fontSize.lg, fontWeight: '600' },
  emptyText: { color: colors.surface100, fontSize: fontSize.sm, fontStyle: 'italic' },
});
