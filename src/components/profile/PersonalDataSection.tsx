import { View, Text, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { TextInput } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, spacing, borderRadius } from '../../constants/layout';

interface PersonalDataSectionProps {
  form: any;
}

export function PersonalDataSection({ form }: PersonalDataSectionProps) {
  return (
    <View>
      <NumericField form={form} name="age" label="Edad" />
      <NumericField form={form} name="weight_kg" label="Peso (kg)" />
      <NumericField form={form} name="height_cm" label="Altura (cm)" />
      <SelectField
        form={form}
        name="gender"
        label="Género"
        options={[
          { value: 'male', label: 'Masculino' },
          { value: 'female', label: 'Femenino' },
          { value: 'other', label: 'Otro' },
        ]}
      />
    </View>
  );
}

function NumericField({ form, name, label }: { form: any; name: string; label: string }) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <View style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, fieldState.error && styles.inputError]}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value?.toString()}
            keyboardType="numeric"
          />
          {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
        </View>
      )}
    />
  );
}

function SelectField({ form, name, label, options }: { form: any; name: string; label: string; options: { value: string; label: string }[] }) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.optionRow}>
            {options.map((opt) => (
              <View
                key={opt.value}
                style={[styles.optionBtn, value === opt.value && styles.optionBtnActive]}
              >
                <Text
                  style={[styles.optionText, value === opt.value && styles.optionTextActive]}
                  onPress={() => onChange(opt.value)}
                >
                  {opt.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { color: colors.surface100, fontSize: fontSize.sm, fontWeight: '500', marginBottom: 4 },
  input: {
    backgroundColor: colors.surface700,
    color: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputError: { borderColor: colors.red400 },
  errorText: { color: colors.red400, fontSize: fontSize.xs, marginTop: 2 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
