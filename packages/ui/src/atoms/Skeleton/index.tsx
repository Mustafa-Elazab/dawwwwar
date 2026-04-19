import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { radius } from '@dawwar/theme';
import type { SkeletonProps } from './types';

/**
 * Skeleton — CSS-style opacity pulse using React state instead of
 * Animated API. The Animated API in packages/ui resolves react-native
 * through pnpm's symlink, creating a second module instance that
 * produces duplicate native node IDs under RN 0.84 New Architecture.
 */
export function Skeleton({
  width,
  height,
  borderRadius = radius.md,
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const [dim, setDim] = React.useState(false);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setDim((prev) => !prev);
    };
    const id = setInterval(tick, 800);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.shimmer,
          opacity: dim ? 0.4 : 1,
        },
        style,
      ]}
    />
  );
}
