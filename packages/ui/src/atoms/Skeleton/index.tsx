import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, radius } from '@dawwar/theme';
import type { SkeletonProps } from './types';

/**
 * Skeleton — Premium high-performance opacity pulse using Reanimated.
 */
export function Skeleton({
  width,
  height,
  borderRadius = radius.md,
  style,
}: SkeletonProps) {
  const { colors } = useTheme();

  // ─── Animations ───────────────────────────────────────────────────
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.shimmer,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
