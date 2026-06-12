import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { colors } from '../../constants/colors';
import { fontSize, spacing, borderRadius } from '../../constants/layout';
import type { DayHistory } from '../../types';

interface DayDetailCardProps {
  day: DayHistory;
}

export function DayDetailCard({ day }: DayDetailCardProps) {
  const [expanded, setExpanded] = useState(false);
  // Consider goal reached if within ±20% of target
  const reached =
    day.net_calories >= day.calorie_target * 0.8 &&
    day.net_calories <= day.calorie_target * 1.2;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>
            {format(new Date(day.date), "EEE d MMM", { locale: es })}
          </Text>
          <Text style={styles.cal}>
            {Math.round(day.net_calories)} / {day.calorie_target} kcal
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.indicator, reached ? styles.indicatorGreen : styles.indicatorRed]}>
            {reached ? '✓' : '✗'}
          </Text>
          <Text style={styles.expand}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.detail}>
          <Text style={styles.detailText}>
            Prot: {Math.round(day.protein_g)}g · Carbs: {Math.round(day.carbs_g)}g · Grasas: {Math.round(day.fat_g)}g
          </Text>
          <Text style={styles.detailText}>
            {day.meals_count} comidas · {day.exercises_count} ejercicios
          </Text>
          <View style={styles.subRow}>
            <Text style={styles.detailLabel}>Consumidas</Text>
            <Text style={styles.detailValue}>{Math.round(day.calories_consumed)} kcal</Text>
          </View>
          <View style={styles.subRow}>
            <Text style={styles.detailLabel}>Quemadas</Text>
            <Text style={styles.detailValue}>{Math.round(day.calories_burned)} kcal</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface800,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { color: colors.white, fontSize: fontSize.md, fontWeight: '600', textTransform: 'capitalize' },
  cal: { color: colors.surface100, fontSize: fontSize.sm, marginTop: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  indicator: { fontSize: 18, fontWeight: '700' },
  indicatorGreen: { color: colors.green400 },
  indicatorRed: { color: colors.red400 },
  expand: { color: colors.surface100, fontSize: fontSize.sm },
  detail: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    gap: 6,
  },
  detailText: { color: colors.surface100, fontSize: fontSize.sm },
  subRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { color: colors.surface100, fontSize: fontSize.sm },
  detailValue: { color: colors.white, fontSize: fontSize.sm, fontWeight: '600' },
});
