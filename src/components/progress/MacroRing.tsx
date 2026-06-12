import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../constants/colors';
import { fontSize, spacing } from '../../constants/layout';

const SIZE = 80;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface MacroRingProps {
  label: string;
  value: number;
  target: number;
  unit?: string;
  color: string;
}

export function MacroRing({ label, value, target, unit = 'g', color }: MacroRingProps) {
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  const offset = CIRCUMFERENCE * (1 - pct);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.value}>{Math.round(value)}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.target}>/{target}{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 4 },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },
  unit: { color: colors.surface100, fontSize: fontSize.xs },
  label: { color: colors.white, fontSize: fontSize.sm, fontWeight: '600' },
  target: { color: colors.surface100, fontSize: fontSize.xs },
});
