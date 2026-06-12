import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, spacing, borderRadius } from '../../constants/layout';
import type { UserProfile } from '../../types';

interface NutritionTargetsDisplayProps {
  profile: UserProfile;
}

export function NutritionTargetsDisplay({ profile }: NutritionTargetsDisplayProps) {
  return (
    <View style={styles.grid}>
      <TargetItem label="Calorías" value={`${profile.daily_calorie_target}`} unit="kcal" />
      <TargetItem label="Proteínas" value={`${profile.protein_target_g}`} unit="g" color={colors.protein} />
      <TargetItem label="Carbohidratos" value={`${profile.carbs_target_g}`} unit="g" color={colors.carbs} />
      <TargetItem label="Grasas" value={`${profile.fat_target_g}`} unit="g" color={colors.fat} />
    </View>
  );
}

function TargetItem({
  label,
  value,
  unit,
  color = colors.white,
}: {
  label: string;
  value: string;
  unit: string;
  color?: string;
}) {
  return (
    <View style={styles.item}>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    width: '47%',
    backgroundColor: colors.surface700,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  value: { fontSize: fontSize.xl, fontWeight: '700', color: colors.white },
  unit: { color: colors.surface100, fontSize: fontSize.sm },
  label: { color: colors.surface100, fontSize: fontSize.xs, marginTop: 4 },
});
