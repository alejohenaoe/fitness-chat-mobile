import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { borderRadius, spacing } from '../../constants/layout';

function Dot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );

    const delayed = Animated.sequence([
      Animated.delay(delay),
      animation,
    ]);

    delayed.start();
    return () => delayed.stop();
  }, []);

  return <Animated.View style={[styles.dot, { opacity }]} />;
}

export function TypingIndicator() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bubble}>
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
    marginHorizontal: spacing.md,
    marginVertical: 4,
  },
  bubble: {
    backgroundColor: colors.surface800,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface100,
  },
});
