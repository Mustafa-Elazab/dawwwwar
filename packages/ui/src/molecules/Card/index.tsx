import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, springs } from '@dawwar/theme';
import { createStyles } from './styles';
import type { CardProps } from './types';

export function Card({
  variant = 'elevated',
  onPress,
  children,
  style,
  testID,
  disabled = false,
}: CardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // ─── Animations ───────────────────────────────────────────────────
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(0.98, springs.stiff);
      opacity.value = withSpring(0.92, springs.soft);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.bouncy);
    opacity.value = withSpring(1, springs.soft);
  };

  const containerStyle = [
    styles.base,
    styles[variant],
    disabled && styles.disabled,
  ];

  if (onPress) {
    return (
      <Animated.View style={[containerStyle, animatedStyle, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          testID={testID}
          style={styles.pressable}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View style={[containerStyle, style]} testID={testID}>
      {children}
    </View>
  );
}
