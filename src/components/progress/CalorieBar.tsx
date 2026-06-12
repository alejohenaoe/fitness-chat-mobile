import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, borderRadius, spacing } from '../../constants/layout';

interface CalorieBarProps {
  consumed: number;
  burned: number;
  target: number;
}

export function CalorieBar({ consumed, burned, target }: CalorieBarProps) {
  const net = consumed - burned;
  const pct = target > 0 ? Math.min(net / target, 1) : 0;
  const isOver = net > target * 1.2;
  const barColor = isOver ? colors.red400 : colors.brand400;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  return (
    <View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.value}>{Math.round(net)} kcal</Text>
        <Text style={styles.target}>/ {target} kcal</Text>
      </View>
      <Text style={styles.detail}>
        Consumidas: {Math.round(consumed)} · Quemadas: {Math.round(burned)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value: { color: colors.white, fontSize: fontSize.xl, fontWeight: '700' },
  target: { color: colors.surface100, fontSize: fontSize.sm },
  detail: { color: colors.surface100, fontSize: fontSize.xs, marginTop: 4 },
});
