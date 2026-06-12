import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withKeyboard?: boolean;
}

export function Screen({ children, style, withKeyboard = false }: ScreenProps) {
  const content = withKeyboard ? (
    <KeyboardAvoidingView
      style={[styles.flex]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    children
  );

  return (
    <SafeAreaView style={[styles.container, style]}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
});
