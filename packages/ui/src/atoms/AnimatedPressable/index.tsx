import React from 'react';
import { Pressable, type PressableProps, type ViewStyle, type StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import { microInteractions } from '@dawwar/theme';
import { usePressAnimation, type PressSpring } from './usePressAnimation';

const AnimatedPressableRN = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  /** Scale factor when pressed (default: 0.96) */
  pressScale?: number;
  /** Opacity when pressed (default: 0.88) */
  pressOpacity?: number;
  /** TranslateY when pressed (default: 0) */
  pressTranslateY?: number;
  /** Spring preset for the animation */
  spring?: PressSpring;
  /** Opacity when disabled (default: 0.55) */
  disabledOpacity?: number;
  /** Optional hook to trigger haptics on press-in */
  onHaptic?: () => void;
  /** Disable the press animation */
  noAnimation?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const AnimatedPressable = React.memo(function AnimatedPressable({
  pressScale = microInteractions.pressScale,
  pressOpacity = microInteractions.pressOpacity,
  pressTranslateY = 0,
  spring = 'soft',
  disabledOpacity = 0.55,
  onHaptic,
  noAnimation = false,
  disabled,
  onPressIn,
  onPressOut,
  style,
  children,
  ...rest
}: AnimatedPressableProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation({
    pressScale,
    pressOpacity,
    pressTranslateY,
    spring,
    disabled,
    disabledOpacity,
    onHaptic,
    onPressIn,
    onPressOut,
  });

  const normalizedDisabled = !!disabled;

  if (noAnimation) {
    return (
      <Pressable
        disabled={normalizedDisabled}
        onPressIn={onPressIn ?? undefined}
        onPressOut={onPressOut ?? undefined}
        style={style}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <AnimatedPressableRN
      disabled={normalizedDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
      {...rest}
    >
      {children}
    </AnimatedPressableRN>
  );
});
