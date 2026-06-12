import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { colors } from '../../constants/colors';
import { fontSize, spacing, borderRadius } from '../../constants/layout';

const GOALS = [
  { value: 'weight_loss', label: 'Perder peso' },
  { value: 'muscle_gain', label: 'Ganar músculo' },
  { value: 'body_recomposition', label: 'Recomposición' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'athletic_performance', label: 'Rendimiento' },
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentario' },
  { value: 'light', label: 'Ligero' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'active', label: 'Activo' },
  { value: 'very_active', label: 'Muy activo' },
];

interface FitnessGoalSectionProps {
  form: any;
}

export function FitnessGoalSection({ form }: FitnessGoalSectionProps) {
  return (
    <View>
      <SelectScrollField form={form} name="goal" label="Objetivo fitness" options={GOALS} />
      <SelectScrollField form={form} name="activity_level" label="Nivel de actividad" options={ACTIVITY_LEVELS} />
    </View>
  );
}

function SelectScrollField({ form, name, label, options }: { form: any; name: string; label: string; options: { value: string; label: string }[] }) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.optionRow}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, value === opt.value && styles.optionBtnActive]}
                  onPress={() => onChange(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, value === opt.value && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { color: colors.surface100, fontSize: fontSize.sm, fontWeight: '500', marginBottom: 8 },
  optionRow: { flexDirection: 'row', gap: spacing.sm },
  optionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface700,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionBtnActive: { backgroundColor: colors.brand500, borderColor: colors.brand500 },
  optionText: { color: colors.surface100, fontSize: fontSize.sm },
  optionTextActive: { color: colors.white, fontWeight: '600' },
});
