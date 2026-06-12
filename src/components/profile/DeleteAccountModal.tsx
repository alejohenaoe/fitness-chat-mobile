import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, spacing, borderRadius } from '../../constants/layout';

interface DeleteAccountModalProps {
  visible: boolean;
  onConfirm: (password: string) => Promise<void>;
  onCancel: () => void;
}

export function DeleteAccountModal({ visible, onConfirm, onCancel }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!password) {
      setError('Introduce tu contraseña');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onConfirm(password);
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Contraseña incorrecta');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>⚠️ Eliminar cuenta</Text>
          <Text style={styles.body}>
            Esta acción es irreversible. Todos tus datos serán eliminados permanentemente.
          </Text>
          <Text style={styles.label}>Introduce tu contraseña para confirmar:</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={password}
            onChangeText={(t) => { setPassword(t); setError(''); }}
            secureTextEntry
            placeholder="Contraseña"
            placeholderTextColor={colors.surface100}
            autoCapitalize="none"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} disabled={loading}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleConfirm}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.deleteText}>Eliminar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: colors.surface900,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: spacing.sm,
  },
  title: { color: colors.white, fontSize: fontSize.xl, fontWeight: '700' },
  body: { color: colors.surface100, fontSize: fontSize.sm, lineHeight: 20 },
  label: { color: colors.surface100, fontSize: fontSize.sm, fontWeight: '500' },
  input: {
    backgroundColor: colors.surface800,
    color: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputError: { borderColor: colors.red400 },
  errorText: { color: colors.red400, fontSize: fontSize.xs },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cancelText: { color: colors.surface100, fontSize: fontSize.md, fontWeight: '600' },
  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.red400,
  },
  deleteText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },
});
