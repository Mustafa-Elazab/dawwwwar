import { useCallback, useEffect } from 'react';
import type { GestureResponderEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { easings, microInteractions, springs, transitions } from '@dawwar/theme';

export type PressSpring = 'snappy' | 'stiff' | 'soft' | 'gentle';

export interface PressAnimationOptions {
  pressScale?: number;
  pressOpacity?: number;
  pressTranslateY?: number;
  spring?: PressSpring;
  disabled?: boolean | null;
  disabledOpacity?: number;
  onHaptic?: () => void;
  onPressIn?: ((e: GestureResponderEvent) => void) | null;
  onPressOut?: ((e: GestureResponderEvent) => void) | null;
}

export const usePressAnimation = ({
  pressScale = microInteractions.pressScale,
  pressOpacity = microInteractions.pressOpacity,
  pressTranslateY = 0,
  spring = 'soft',
  disabled,
  disabledOpacity = 0.55,
  onHaptic,
  onPressIn,
  onPressOut,
}: PressAnimationOptions) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const baseOpacity = useSharedValue(disabled ? disabledOpacity : 1);

  useEffect(() => {
    baseOpacity.value = withTiming(disabled ? disabledOpacity : 1, {
      duration: transitions.fast,
      easing: easings.standard,
    });
  }, [disabled, disabledOpacity, baseOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value * baseOpacity.value,
  }));

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (!disabled) {
        onHaptic?.();
        scale.value = withSpring(pressScale, springs[spring]);
        opacity.value = withSpring(pressOpacity, springs[spring]);
        translateY.value = withSpring(pressTranslateY, springs[spring]);
      }
      onPressIn?.(e);
    },
    [
      disabled,
      onHaptic,
      onPressIn,
      pressScale,
      pressOpacity,
      pressTranslateY,
      spring,
      scale,
      opacity,
      translateY,
    ],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      scale.value = withSpring(1, springs[spring]);
      opacity.value = withSpring(1, springs[spring]);
      translateY.value = withSpring(0, springs[spring]);
      onPressOut?.(e);
    },
    [onPressOut, spring, scale, opacity, translateY],
  );

  return { animatedStyle, handlePressIn, handlePressOut };
};
