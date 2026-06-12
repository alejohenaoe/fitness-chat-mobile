import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, spacing } from '../../constants/layout';
import type { ExerciseLog } from '../../types';

interface ExerciseSectionProps {
  exercises: ExerciseLog[];
}

export function ExerciseSection({ exercises }: ExerciseSectionProps) {
  if (exercises.length === 0) {
    return <Text style={styles.empty}>Sin ejercicios registrados</Text>;
  }

  return (
    <View>
      {exercises.map((ex, i) => (
        <View key={ex.id ?? i} style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.name}>{ex.name}</Text>
            {ex.duration_minutes ? (
              <Text style={styles.meta}>{ex.duration_minutes} min · {ex.exercise_type ?? ''}</Text>
            ) : null}
          </View>
          <Text style={styles.cal}>{ex.calories_burned} kcal</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { color: colors.surface100, fontSize: fontSize.sm, fontStyle: 'italic' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  info: { flex: 1 },
  name: { color: colors.white, fontSize: fontSize.sm, fontWeight: '500' },
  meta: { color: colors.surface100, fontSize: fontSize.xs, marginTop: 2 },
  cal: { color: colors.surface100, fontSize: fontSize.sm },
});
