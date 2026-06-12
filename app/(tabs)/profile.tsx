import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../src/stores/useAppStore';
import { useProfile } from '../../src/hooks/useProfile';
import { PersonalDataSection } from '../../src/components/profile/PersonalDataSection';
import { FitnessGoalSection } from '../../src/components/profile/FitnessGoalSection';
import { NutritionTargetsDisplay } from '../../src/components/profile/NutritionTargetsDisplay';
import { DeleteAccountModal } from '../../src/components/profile/DeleteAccountModal';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { Spinner } from '../../src/components/ui/Spinner';
import api from '../../src/services/api';
import { colors } from '../../src/constants/colors';
import { fontSize, spacing, borderRadius } from '../../src/constants/layout';

const profileSchema = z.object({
  age: z.coerce.number().min(10).max(120),
  weight_kg: z.coerce.number().min(20).max(500),
  height_cm: z.coerce.number().min(50).max(300),
  gender: z.string().min(1),
  goal: z.string().min(1),
  activity_level: z.string().min(1),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
  const { user, logout } = useAppStore();
  const { profile, stats, isLoading, updateProfile, isUpdating } = useProfile();
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema) as any,
    values: profile
      ? {
          age: profile.age,
          weight_kg: profile.weight_kg,
          height_cm: profile.height_cm,
          gender: profile.gender,
          goal: profile.goal,
          activity_level: profile.activity_level,
        }
      : undefined,
  });

  const onSave = async (values: ProfileForm) => {
    try {
      await updateProfile(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // Error handled inside hook
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch {}
    await logout();
  };

  const handleDeleteAccount = async (password: string) => {
    await api.delete('/auth/delete-account/', { data: { password } });
    await logout();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.screenTitle}>Perfil</Text>

        {/* User info */}
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.first_name?.[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.first_name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsRow}>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statValue}>{stats.streak_days ?? 0}🔥</Text>
              <Text style={styles.statLabel}>Racha</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statValue}>{Math.round(stats.avg_calories_7d ?? 0)}</Text>
              <Text style={styles.statLabel}>kcal/día (7d)</Text>
            </GlassCard>
          </View>
        )}

        {/* Personal data */}
        <GlassCard>
          <Text style={styles.sectionTitle}>Datos personales</Text>
          <PersonalDataSection form={form} />
        </GlassCard>

        {/* Fitness goal + activity level */}
        <GlassCard>
          <Text style={styles.sectionTitle}>Objetivo fitness</Text>
          <FitnessGoalSection form={form} />
        </GlassCard>

        {/* Nutrition targets (read-only) */}
        {profile && (
          <GlassCard>
            <Text style={styles.sectionTitle}>Objetivos nutricionales</Text>
            <NutritionTargetsDisplay profile={profile} />
          </GlassCard>
        )}

        {/* Save button */}
        {saved && <Text style={styles.savedText}>✓ Cambios guardados</Text>}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={form.handleSubmit(onSave as any)}
          disabled={isUpdating}
          activeOpacity={0.8}
        >
          {isUpdating ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Delete account */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => setShowDeleteModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteText}>Eliminar cuenta</Text>
        </TouchableOpacity>
      </ScrollView>

      <DeleteAccountModal
        visible={showDeleteModal}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, gap: spacing.md, paddingBottom: 40 },
  screenTitle: { color: colors.white, fontSize: fontSize.xxl, fontWeight: '700' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.brand500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontSize: fontSize.xl, fontWeight: '700' },
  userName: { color: colors.white, fontSize: fontSize.lg, fontWeight: '600' },
  userEmail: { color: colors.surface100, fontSize: fontSize.sm },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.white, fontSize: fontSize.xl, fontWeight: '700' },
  statLabel: { color: colors.surface100, fontSize: fontSize.xs, marginTop: 2 },
  sectionTitle: { color: colors.white, fontSize: fontSize.lg, fontWeight: '600', marginBottom: spacing.md },
  savedText: { color: colors.green400, fontSize: fontSize.sm, textAlign: 'center', fontWeight: '600' },
  saveBtn: {
    backgroundColor: colors.brand500,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },
  logoutBtn: {
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  logoutText: { color: colors.surface100, fontSize: fontSize.md, fontWeight: '600' },
  deleteBtn: {
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.red400,
  },
  deleteText: { color: colors.red400, fontSize: fontSize.md, fontWeight: '600' },
});
