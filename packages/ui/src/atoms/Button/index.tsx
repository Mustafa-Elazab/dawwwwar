import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, springs } from '@dawwar/theme';
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
  style,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isDisabled = disabled || loading;

  // ─── Animations ───────────────────────────────────────────────────
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isDisabled) {
      scale.value = withSpring(0.96, springs.stiff);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.bouncy);
  };

  const labelStyleKey = `label${variant.charAt(0).toUpperCase()}${variant.slice(1)}` as
    | 'labelPrimary'
    | 'labelSecondary'
    | 'labelOutline'
    | 'labelGhost'
    | 'labelDanger';

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        testID={testID}
        style={[
          styles.base,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger'
              ? colors.primaryText
              : colors.primary}
          />
        ) : (
          <>
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
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
