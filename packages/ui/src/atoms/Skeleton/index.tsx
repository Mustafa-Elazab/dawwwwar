import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { easings, motion, radius as themeRadius, useTheme } from '@dawwar/theme';
import type { SkeletonProps } from './types';

/**
 * Skeleton — Premium shimmer effect with a sweeping highlight.
 * Uses opacity pulse + translateX shimmer for a premium loading feel.
 */
export function Skeleton({
  width,
  height,
  borderRadius = themeRadius.md,
  variant = 'rectangular',
  style,
}: SkeletonProps) {
  const { colors } = useTheme();

  const resolvedRadius =
    variant === 'circular' ? themeRadius.full : variant === 'text' ? themeRadius.sm : borderRadius;

  // ─── Shimmer animation ────────────────────────────────────────
  const shimmer = useSharedValue(0);
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    // Pulse: gentle opacity breathing
    pulse.value = withRepeat(
      withTiming(0.7, { duration: motion.skeletonPulseMs, easing: easings.standard }),
      -1,
      true,
    );
    // Shimmer: sweeping highlight from start to end
    shimmer.value = withRepeat(
      withDelay(
        motion.skeletonDelayMs,
        withTiming(1, { duration: motion.skeletonShimmerMs, easing: easings.standard }),
      ),
      -1,
      false,
    );
  }, [pulse, shimmer]);

  const baseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.4, 0.6, 1], [0, 0.6, 0.6, 0]),
    transform: [
      {
        translateX: interpolate(
          shimmer.value,
          [0, 1],
          [-100, typeof width === 'number' ? width + 100 : 300],
        ),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: resolvedRadius,
          backgroundColor: colors.shimmer,
          overflow: 'hidden',
        },
        baseStyle,
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 80,
            backgroundColor: colors.shimmerHighlight,
            borderRadius: resolvedRadius,
          },
          highlightStyle,
        ]}
      />
    </Animated.View>
  );
}

/**
 * SkeletonGroup — renders multiple skeletons in a column layout
 * for quick placeholder composition.
 */
export function SkeletonGroup({
  lines = 3,
  gap = 8,
  lastLineWidth = '60%',
}: {
  lines?: number;
  gap?: number;
  lastLineWidth?: number | `${number}%`;
}) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          height={14}
          variant="text"
        />
      ))}
    </View>
  );
}
