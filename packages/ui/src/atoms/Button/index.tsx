import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { easings, microInteractions, transitions, useTheme } from '@dawwar/theme';
import { AnimatedPressable } from '../AnimatedPressable';
import { Text } from '../Text';
import { createStyles } from './styles';
import type { ButtonProps } from './types';

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onHaptic,
  style,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isDisabled = disabled || loading;

  // ─── Loading transition ───────────────────────────────────────────
  const contentOpacity = useSharedValue(loading ? 0 : 1);
  const spinnerOpacity = useSharedValue(loading ? 1 : 0);

  useEffect(() => {
    contentOpacity.value = withTiming(loading ? 0 : 1, {
      duration: transitions.fast,
      easing: easings.standard,
    });
    spinnerOpacity.value = withTiming(loading ? 1 : 0, {
      duration: transitions.fast,
      easing: easings.standard,
    });
  }, [loading, contentOpacity, spinnerOpacity]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    opacity: spinnerOpacity.value,
  }));

  const labelStyleKey = `label${variant.charAt(0).toUpperCase()}${variant.slice(1)}` as
    | 'labelPrimary'
    | 'labelSecondary'
    | 'labelOutline'
    | 'labelGhost'
    | 'labelDanger';

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      pressScale={microInteractions.pressScale}
      pressOpacity={microInteractions.pressOpacity}
      pressTranslateY={1}
      spring="soft"
      disabledOpacity={0.55}
      onHaptic={onHaptic}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <Animated.View style={contentStyle}>
        {leftIcon}
        <Text
          style={[
            styles[labelStyleKey],
            styles[
              `label${size.charAt(0).toUpperCase()}${size.slice(1)}` as
                | 'labelSm'
                | 'labelMd'
                | 'labelLg'
            ],
          ]}
        >
          {label}
        </Text>
        {rightIcon}
      </Animated.View>

      <Animated.View style={[styles.spinnerWrap, spinnerStyle]}>
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger'
            ? colors.primaryText
            : colors.primary}
        />
      </Animated.View>
    </AnimatedPressable>
  );
}
