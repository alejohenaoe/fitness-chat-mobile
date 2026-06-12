import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Polyline, Line as SvgLine, Text as SvgText } from 'react-native-svg';
import { colors } from '../../constants/colors';
import { fontSize, spacing } from '../../constants/layout';
import type { DayHistory } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MacrosAreaChartProps {
  data: DayHistory[];
}

const CHART_HEIGHT = 180;
const PADDING = { top: 8, right: 8, bottom: 32, left: 40 };

export function MacrosAreaChart({ data }: MacrosAreaChartProps) {
  if (data.length === 0) {
    return <Text style={styles.empty}>Sin datos para este período</Text>;
  }

  const chartData = data.map((d) => ({
    date: format(new Date(d.date), 'd MMM', { locale: es }),
    protein: Math.round(d.protein_g),
    carbs: Math.round(d.carbs_g),
    fat: Math.round(d.fat_g),
  }));

  const allVals = chartData.flatMap((d) => [d.protein, d.carbs, d.fat]);
  const maxVal = Math.max(...allVals, 1);
  const stepX = 44;
  const chartW = chartData.length * stepX;
  const drawW = Math.max(chartW, 200);
  const drawH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const yPos = (v: number) => PADDING.top + drawH - (v / maxVal) * drawH;
  const xPos = (i: number) => PADDING.left + i * stepX;

  const buildPoints = (key: 'protein' | 'carbs' | 'fat') =>
    chartData.map((d, i) => `${xPos(i)},${yPos(d[key])}`).join(' ');

  const buildArea = (key: 'protein' | 'carbs' | 'fat') => {
    const pts = chartData.map((d, i) => `${xPos(i)},${yPos(d[key])}`);
    return `${xPos(0)},${yPos(0)} ${pts.join(' ')} ${xPos(chartData.length - 1)},${yPos(0)}`;
  };

  const ticks = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), maxVal];

  return (
    <View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.protein }]} />
          <Text style={styles.legendLabel}>Proteínas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.carbs }]} />
          <Text style={styles.legendLabel}>Carbos</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.fat }]} />
          <Text style={styles.legendLabel}>Grasas</Text>
        </View>
      </View>
      <View style={styles.chart}>
        <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${drawW} ${CHART_HEIGHT}`}>
          {ticks.map((t) => (
            <SvgLine
              key={t}
              x1={PADDING.left}
              y1={yPos(t)}
              x2={drawW - PADDING.right}
              y2={yPos(t)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          ))}
          {ticks.map((t) => (
            <SvgText
              key={t}
              x={PADDING.left - 6}
              y={yPos(t) + 4}
              fill={colors.surface100}
              fontSize={10}
              textAnchor="end"
            >
              {t}
            </SvgText>
          ))}
          {([
            { key: 'protein' as const, color: colors.protein },
            { key: 'carbs' as const, color: colors.carbs },
            { key: 'fat' as const, color: colors.fat },
          ]).map(({ key, color }) => (
            <Polygon
              key={`area-${key}`}
              points={buildArea(key)}
              fill={color}
              fillOpacity={0.25}
            />
          ))}
          {([
            { key: 'protein' as const, color: colors.protein },
            { key: 'carbs' as const, color: colors.carbs },
            { key: 'fat' as const, color: colors.fat },
          ]).map(({ key, color }) => (
            <Polyline
              key={`line-${key}`}
              points={buildPoints(key)}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {chartData.map((d, i) => {
            if (chartData.length > 12 && i % 2 !== 0 && i !== chartData.length - 1) return null;
            return (
              <SvgText
                key={`label-${i}`}
                x={xPos(i) + stepX / 2}
                y={CHART_HEIGHT - 6}
                fill={colors.surface100}
                fontSize={9}
                textAnchor="middle"
              >
                {d.date.length > 5 ? d.date.slice(0, 5) : d.date}
              </SvgText>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { height: 180 },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: colors.surface100, fontSize: fontSize.xs },
  empty: { color: colors.surface100, fontSize: fontSize.sm, fontStyle: 'italic', padding: spacing.sm },
});
