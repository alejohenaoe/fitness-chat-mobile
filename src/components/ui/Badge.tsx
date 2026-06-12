import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, borderRadius, spacing } from '../../constants/layout';

interface BadgeProps {
  count: number;
}

export function Badge({ count }: BadgeProps) {
  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.brand500,
    borderRadius: borderRadius.full,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -6,
    right: -6,
  },
  text: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
});
