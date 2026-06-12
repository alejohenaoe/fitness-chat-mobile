import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useAppStore } from '../../src/stores/useAppStore';
import api from '../../src/services/api';
import { colors } from '../../src/constants/colors';
import { spacing, fontSize, borderRadius } from '../../src/constants/layout';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

const registerSchema = z.object({
  first_name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthScreen() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { setUser } = useAppStore();
  console.log('AUTH: EXPO_PUBLIC_API_BASE_URL =', process.env.EXPO_PUBLIC_API_BASE_URL);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onLogin = async (values: LoginForm) => {
    try {
      console.log('LOGIN: sending', values.email, 'to', process.env.EXPO_PUBLIC_API_BASE_URL + '/auth/login/');
      const { data } = await api.post('/auth/login/', values);
      console.log('LOGIN: response', JSON.stringify(data, null, 2));
      await SecureStore.setItemAsync('access_token', data.access);
      await SecureStore.setItemAsync('refresh_token', data.refresh);
      setUser(data.user);
    } catch (err: any) {
      console.log('LOGIN: error', err.message, err.response?.status, JSON.stringify(err.response?.data, null, 2));
      const detail = typeof err.response?.data === 'string' ? err.response?.data?.match(/<title>([^<]+)<\/title>/)?.[1] : undefined;
      const msg = detail || err.response?.data?.detail || err.response?.data?.error || err.message || 'Error de conexión';
      Alert.alert('Error (' + (err.response?.status || 'sin respuesta') + ')', msg);
    }
  };

  const onRegister = async (values: RegisterForm) => {
    try {
      console.log('REGISTER: sending', values, 'to', process.env.EXPO_PUBLIC_API_BASE_URL + '/auth/register/');
      const { data } = await api.post('/auth/register/', values);
      console.log('REGISTER: response', JSON.stringify(data, null, 2));
      if (data.access) {
        await SecureStore.setItemAsync('access_token', data.access);
        await SecureStore.setItemAsync('refresh_token', data.refresh);
        setUser(data.user);
      } else {
        setTab('login');
        Alert.alert('Cuenta creada', 'Ahora puedes iniciar sesión');
      }
    } catch (err: any) {
      console.log('REGISTER: error', err.message, err.response?.status, JSON.stringify(err.response?.data, null, 2));
      const detail = typeof err.response?.data === 'string' ? err.response?.data?.match(/<title>([^<]+)<\/title>/)?.[1] : undefined;
      const msg = detail || err.response?.data?.email?.[0] || err.response?.data?.detail || err.response?.data?.error || err.message || 'Error de conexión';
      Alert.alert('Error (' + (err.response?.status || 'sin respuesta') + ')', msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <Sparkles color={colors.white} size={28} />
          </View>
          <Text style={styles.logo}>FitnessChat</Text>
          <Text style={styles.subtitle}>Tu asistente de nutrición personal</Text>
        </View>

        {/* Tab selector */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
            onPress={() => setTab('login')}
          >
            <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'register' && styles.tabBtnActive]}
            onPress={() => setTab('register')}
          >
            <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>
              Crear cuenta
            </Text>
          </TouchableOpacity>
        </View>

        {tab === 'login' ? (
          <LoginForm form={loginForm} onSubmit={onLogin} />
        ) : (
          <RegisterFormComponent form={registerForm} onSubmit={onRegister} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LoginForm({ form, onSubmit }: { form: any; onSubmit: (v: LoginForm) => Promise<void> }) {
  return (
    <View style={styles.form}>
      <Field label="Email" form={form} name="email" placeholder="tu@email.com" keyboardType="email-address" />
      <Field label="Contraseña" form={form} name="password" placeholder="••••••••" secureTextEntry />
      <SubmitButton
        label="Iniciar sesión"
        loading={form.formState.isSubmitting}
        onPress={form.handleSubmit(onSubmit)}
      />
    </View>
  );
}

function RegisterFormComponent({ form, onSubmit }: { form: any; onSubmit: (v: RegisterForm) => Promise<void> }) {
  return (
    <View style={styles.form}>
      <Field label="Nombre" form={form} name="first_name" placeholder="Tu nombre" />
      <Field label="Email" form={form} name="email" placeholder="tu@email.com" keyboardType="email-address" />
      <Field label="Contraseña" form={form} name="password" placeholder="••••••••" secureTextEntry />
      <SubmitButton
        label="Crear cuenta"
        loading={form.formState.isSubmitting}
        onPress={form.handleSubmit(onSubmit)}
      />
    </View>
  );
}

function Field({ label, form, name, ...inputProps }: any) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, fieldState.error && styles.inputError]}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            autoCapitalize="none"
            {...inputProps}
          />
          {fieldState.error && (
            <Text style={styles.errorText}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

function SubmitButton({ label, loading, onPress }: { label: string; loading: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading} activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand500,
    marginBottom: spacing.md,
  },
  logo: { color: colors.white, fontSize: fontSize.xxxl, fontWeight: '700' },
  subtitle: { color: colors.surface100, fontSize: fontSize.md, marginTop: spacing.xs },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface900,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabBtnActive: { backgroundColor: colors.brand500 },
  tabText: { color: colors.surface100, fontSize: fontSize.sm, fontWeight: '500' },
  tabTextActive: { color: colors.white },
  form: { gap: spacing.md },
  fieldWrapper: { gap: 4 },
  label: { color: colors.surface100, fontSize: fontSize.sm, fontWeight: '500' },
  input: {
    backgroundColor: colors.surface800,
    color: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputError: { borderColor: colors.red400 },
  errorText: { color: colors.red400, fontSize: fontSize.xs },
  button: {
    backgroundColor: colors.brand500,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },
});
