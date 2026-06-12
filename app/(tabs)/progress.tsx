import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDailyProgress } from '../../src/hooks/useDailyProgress';
import { useAppStore } from '../../src/stores/useAppStore';
import { MacroRing } from '../../src/components/progress/MacroRing';
import { CalorieBar } from '../../src/components/progress/CalorieBar';
import { MealSection } from '../../src/components/progress/MealSection';
import { ExerciseSection } from '../../src/components/progress/ExerciseSection';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { colors } from '../../src/constants/colors';
import { fontSize, spacing } from '../../src/constants/layout';

export default function ProgressScreen() {
  const { data, isLoading, refetch, isRefetching } = useDailyProgress();
  const { dailyProgress, user } = useAppStore();
  const profile = user?.profile;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.brand400}
          />
        }
      >
        <Text style={styles.screenTitle}>Progreso de hoy</Text>
        <Text style={styles.date}>{format(new Date(), "EEEE d 'de' MMMM", { locale: es })}</Text>

        {/* Calories card */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>🔥 Calorías netas</Text>
          <CalorieBar
            consumed={dailyProgress.caloriesConsumed}
            burned={dailyProgress.caloriesBurned}
            target={dailyProgress.calorieTarget}
          />
        </GlassCard>

        {/* Macros card */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Macronutrientes</Text>
          <View style={styles.macrosRow}>
            <MacroRing
              label="Proteína"
              value={dailyProgress.proteinG}
              target={profile?.protein_target_g ?? 150}
              color={colors.protein}
            />
            <MacroRing
              label="Carbos"
              value={dailyProgress.carbsG}
              target={profile?.carbs_target_g ?? 200}
              color={colors.carbs}
            />
            <MacroRing
              label="Grasas"
              value={dailyProgress.fatG}
              target={profile?.fat_target_g ?? 65}
              color={colors.fat}
            />
          </View>
        </GlassCard>

        {/* Meals */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>🍽 Comidas de hoy</Text>
          <MealSection meals={dailyProgress.mealsLogged} />
        </GlassCard>

        {/* Exercise */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>🏋 Ejercicio hoy</Text>
          <ExerciseSection exercises={dailyProgress.exercisesLogged} />
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, gap: spacing.md },
  screenTitle: { color: colors.white, fontSize: fontSize.xxl, fontWeight: '700' },
  date: { color: colors.surface100, fontSize: fontSize.sm, textTransform: 'capitalize' },
  card: { marginTop: 0 },
  cardTitle: { color: colors.white, fontSize: fontSize.lg, fontWeight: '600', marginBottom: spacing.md },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-around' },
});
