import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { space, useTheme } from '@dawwar/theme';

type DotProps = {
  index: number;
  count: number;
  progress: SharedValue<number>;
  width: number;
};

function Dot({ index, count, progress, width }: DotProps) {
  const { colors } = useTheme();

  const style = useAnimatedStyle(() => {
    const input = Array.from({ length: count }, (_, i) => i * width);
    const dotWidth = interpolate(
      progress.value,
      input,
      input.map((_, i) => (i === index ? 24 : 8)),
    );
    const backgroundColor = interpolateColor(
      progress.value,
      input,
      input.map((_, i) => (i === index ? colors.primary : colors.textTertiary)),
    );

    return {
      width: dotWidth,
      backgroundColor,
    };
  }, [colors.primary, colors.textTertiary, count, width, index]);

  return <Animated.View style={[styles.dot, style]} />;
}

export function OnboardingPagination({
  count,
  progress,
  width,
}: {
  count: number;
  progress: SharedValue<number>;
  width: number;
}) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, index) => (
        <Dot key={index} index={index} count={count} progress={progress} width={width} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
