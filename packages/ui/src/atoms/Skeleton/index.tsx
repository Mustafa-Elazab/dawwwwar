import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@dawwar/theme';
import { radius } from '@dawwar/theme';
import type { SkeletonProps } from './types';

export function Skeleton({
  width,
  height,
  borderRadius = radius.md,
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,  // repeat forever
      true, // reverse: pulse back to 1
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.shimmer },
        animStyle,
        style,
      ]}
    />
  );
}
