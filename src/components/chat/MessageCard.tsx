import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, borderRadius, spacing } from '../../constants/layout';
import type { ExtractedData } from '../../types';

interface MessageCardProps {
  extractedData: ExtractedData;
}

export function MessageCard({ extractedData }: MessageCardProps) {
  const foods = extractedData.extracted_foods ?? [];
  const exercises = extractedData.extracted_exercises ?? [];

  return (
    <View style={styles.card}>
      {foods.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽 Alimentos registrados</Text>
          {foods.map((food, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.itemName}>{food.name}</Text>
              <Text style={styles.itemCal}>{food.calories_estimated} kcal</Text>
            </View>
          ))}
        </View>
      )}
      {exercises.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏋 Ejercicios registrados</Text>
          {exercises.map((ex, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.itemName}>{ex.name}</Text>
              <Text style={styles.itemCal}>
                {ex.calories_burned_estimated ?? ex.calories_burned ?? 0} kcal
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface900,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: 6,
    borderWidth: 1,
    borderColor: `${colors.brand500}40`,
    width: '100%',
  },
  section: { marginBottom: 6 },
  sectionTitle: {
    color: colors.brand400,
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  itemName: { color: colors.white, fontSize: fontSize.sm, flex: 1 },
  itemCal: { color: colors.surface100, fontSize: fontSize.sm },
});
