import React, { useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
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
  const opacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.shimmer },
        { opacity },
        style,
      ]}
    />
  );
}
