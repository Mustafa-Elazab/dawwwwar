import React from 'react';
import { ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
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
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
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
        { transform: [{ scale }] },
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
