import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, spacing } from '../../constants/layout';
import type { MealLog } from '../../types';

interface MealSectionProps {
  meals: MealLog[];
}

export function MealSection({ meals }: MealSectionProps) {
  if (meals.length === 0) {
    return <Text style={styles.empty}>Sin comidas registradas</Text>;
  }

  // Group by meal_type
  const grouped: Record<string, MealLog[]> = {};
  for (const meal of meals) {
    const type = meal.meal_type ?? 'Otro';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(meal);
  }

  return (
    <View>
      {Object.entries(grouped).map(([type, items]) => (
        <View key={type} style={styles.group}>
          <Text style={styles.groupTitle}>{type}</Text>
          {items.map((meal, i) => (
            <View key={meal.id ?? i} style={styles.row}>
              <Text style={styles.name}>{meal.name}</Text>
              <Text style={styles.cal}>{meal.calories} kcal</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { color: colors.surface100, fontSize: fontSize.sm, fontStyle: 'italic' },
  group: { marginBottom: spacing.sm },
  groupTitle: {
    color: colors.brand400,
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  name: { color: colors.white, fontSize: fontSize.sm, flex: 1 },
  cal: { color: colors.surface100, fontSize: fontSize.sm },
});
