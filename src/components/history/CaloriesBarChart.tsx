import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../../constants/colors';
import { fontSize, spacing } from '../../constants/layout';
import type { DayHistory } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CaloriesBarChartProps {
  data: DayHistory[];
}

const CHART_HEIGHT = 180;
const PADDING = { top: 8, right: 8, bottom: 32, left: 40 };

export function CaloriesBarChart({ data }: CaloriesBarChartProps) {
  if (data.length === 0) {
    return <Text style={styles.empty}>Sin datos para este período</Text>;
  }

  const chartData = data.map((d) => ({
    date: format(new Date(d.date), 'd MMM', { locale: es }),
    calories: Math.round(d.net_calories),
    isOver: d.net_calories > d.calorie_target * 1.2,
  }));

  const maxCal = Math.max(...chartData.map((d) => d.calories), 1);
  const chartW = chartData.length * 44;
  const drawW = Math.max(chartW, 200);
  const drawH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const barWidth = Math.min(28, 44 * 0.6);

  const yTick = (val: number) =>
    PADDING.top + drawH - (val / maxCal) * drawH;

  const ticks = [0, Math.round(maxCal * 0.25), Math.round(maxCal * 0.5), Math.round(maxCal * 0.75), maxCal];

  return (
    <View style={styles.container}>
      <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${drawW} ${CHART_HEIGHT}`}>
        {ticks.map((t) => (
          <Line
            key={t}
            x1={PADDING.left}
            y1={yTick(t)}
            x2={drawW - PADDING.right}
            y2={yTick(t)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}
        {ticks.map((t) => (
          <SvgText
            key={t}
            x={PADDING.left - 6}
            y={yTick(t) + 4}
            fill={colors.surface100}
            fontSize={10}
            textAnchor="end"
          >
            {t}
          </SvgText>
        ))}
        {chartData.map((d, i) => {
          const barH = (d.calories / maxCal) * drawH;
          const x = PADDING.left + i * 44 + (44 - barWidth) / 2;
          const y = PADDING.top + drawH - barH;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={4}
              ry={4}
              fill={d.isOver ? colors.red400 : colors.brand400}
            />
          );
        })}
        {chartData.map((d, i) => {
          if (chartData.length > 12 && i % 2 !== 0 && i !== chartData.length - 1) return null;
          return (
            <SvgText
              key={`label-${i}`}
              x={PADDING.left + i * 44 + 22}
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
  );
}

const styles = StyleSheet.create({
  container: { height: 180 },
  empty: { color: colors.surface100, fontSize: fontSize.sm, fontStyle: 'italic', padding: spacing.sm },
});
