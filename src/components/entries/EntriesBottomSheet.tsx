import { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fontSize, spacing, borderRadius } from '../../constants/layout';
import { MealEntryItem, ExerciseEntryItem } from './EntryItem';
import { useLogManager } from '../../hooks/useLogManager';
import { Spinner } from '../ui/Spinner';

interface EntriesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EntriesModal({ visible, onClose }: EntriesModalProps) {
  const { meals, exercises, isLoading, deleteMeal, deleteExercise } = useLogManager();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Registros de hoy</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color={colors.surface100} size={20} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <Spinner size="large" />
            ) : (
              <>
                <Text style={styles.sectionTitle}>🍽 Comidas</Text>
                {meals.length === 0 ? (
                  <Text style={styles.emptyText}>Sin comidas registradas</Text>
                ) : (
                  meals.map((meal: any) => (
                    <MealEntryItem key={meal.id} item={meal} onDelete={deleteMeal} />
                  ))
                )}

                <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>🏋 Ejercicios</Text>
                {exercises.length === 0 ? (
                  <Text style={styles.emptyText}>Sin ejercicios registrados</Text>
                ) : (
                  exercises.map((ex: any) => (
                    <ExerciseEntryItem key={ex.id} item={ex} onDelete={deleteExercise} />
                  ))
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface900,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: Dimensions.get('window').height * 0.85,
    paddingBottom: 34,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeBtn: {
    padding: 4,
  },
  content: { padding: spacing.md, paddingBottom: 40 },
  title: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.brand400,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.surface100,
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    paddingVertical: spacing.sm,
  },
});
