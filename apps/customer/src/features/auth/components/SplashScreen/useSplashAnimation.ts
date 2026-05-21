import { useEffect, useMemo } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  withDelay,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { easings, motion } from '@dawwar/theme';

export interface SplashAnimationConfig {
  isExiting?: boolean;
}

export const useSplashAnimation = ({ isExiting = false }: SplashAnimationConfig) => {
  const intro = useSharedValue(0);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);
  const progress = useSharedValue(0);
  const exit = useSharedValue(0);

  useEffect(() => {
    intro.value = withTiming(1, {
      duration: motion.splashEnterMs,
      easing: easings.standard,
    });

    ring1.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: easings.decelerate,
      }),
      -1,
      false,
    );

    ring2.value = withRepeat(
      withDelay(
        260,
        withTiming(1, {
          duration: 1500,
          easing: easings.decelerate,
        }),
      ),
      -1,
      false,
    );

    ring3.value = withRepeat(
      withDelay(
        520,
        withTiming(1, {
          duration: 1500,
          easing: easings.decelerate,
        }),
      ),
      -1,
      false,
    );

    progress.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: easings.standard,
      }),
      -1,
      false,
    );
  }, [intro, progress, ring1, ring2, ring3]);

  useEffect(() => {
    exit.value = withTiming(isExiting ? 1 : 0, {
      duration: motion.splashExitMs,
      easing: easings.standard,
    });
  }, [isExiting, exit]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: 1 - exit.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [
      { translateY: (1 - intro.value) * 10 },
    ],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: (1 - ring1.value) * 0.15,
    transform: [{ scale: interpolate(ring1.value, [0, 1], [0.8, 2.1]) }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: (1 - ring2.value) * 0.15,
    transform: [{ scale: interpolate(ring2.value, [0, 1], [0.8, 2.1]) }],
  }));

  const ring3Style = useAnimatedStyle(() => ({
    opacity: (1 - ring3.value) * 0.15,
    transform: [{ scale: interpolate(ring3.value, [0, 1], [0.8, 2.1]) }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [-160, 160]) }],
  }));

  return useMemo(
    () => ({
      containerStyle,
      logoStyle,
      ring1Style,
      ring2Style,
      ring3Style,
      progressStyle,
    }),
    [containerStyle, logoStyle, ring1Style, ring2Style, ring3Style, progressStyle],
  );
};
