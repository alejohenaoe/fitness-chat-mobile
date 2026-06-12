import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fontSize, borderRadius, spacing } from '../../constants/layout';
import type { MealLog, ExerciseLog } from '../../types';

interface EntryItemMealProps {
  item: MealLog;
  onDelete: (id: number) => void;
}

interface EntryItemExerciseProps {
  item: ExerciseLog;
  onDelete: (id: number) => void;
}

export function MealEntryItem({ item, onDelete }: EntryItemMealProps) {
  return (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.meal_type ?? 'comida'} · {item.calories} kcal
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => item.id && onDelete(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Trash2 color={colors.red400} size={18} />
      </TouchableOpacity>
    </View>
  );
}

export function ExerciseEntryItem({ item, onDelete }: EntryItemExerciseProps) {
  return (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.exercise_type ?? 'ejercicio'} · {item.calories_burned} kcal
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => item.id && onDelete(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Trash2 color={colors.red400} size={18} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  info: { flex: 1 },
  name: { color: colors.white, fontSize: fontSize.md, fontWeight: '500' },
  meta: { color: colors.surface100, fontSize: fontSize.sm, marginTop: 2 },
  deleteBtn: { padding: 4 },
});
