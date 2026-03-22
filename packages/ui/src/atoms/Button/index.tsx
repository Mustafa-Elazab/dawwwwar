import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@dawwar/theme';
import { Text } from '../Text';
import { createStyles } from './styles';
import type { ButtonProps } from './types';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const isDisabled = disabled || loading;

  const labelStyleKey = `label${variant.charAt(0).toUpperCase()}${variant.slice(1)}` as
    | 'labelPrimary'
    | 'labelSecondary'
    | 'labelOutline'
    | 'labelGhost'
    | 'labelDanger';

  return (
    <AnimatedTouchable
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={1}
      testID={testID}
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
          <Text style={[styles[labelStyleKey], styles[`label${size.charAt(0).toUpperCase()}${size.slice(1)}` as 'labelSm' | 'labelMd' | 'labelLg']]}>{label}</Text>
          {rightIcon}
        </>
      )}
    </AnimatedTouchable>
  );
}
