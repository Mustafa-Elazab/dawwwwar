import React, { useCallback } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme, springs, microInteractions } from '@dawwar/theme';
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

  const handlePressIn = useCallback(() => {
    if (onPress && !disabled) {
      scale.value = withSpring(microInteractions.cardPressScale, springs.snappy);
      opacity.value = withSpring(0.95, springs.snappy);
    }
  }, [onPress, disabled, scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, springs.bouncy);
    opacity.value = withSpring(1, springs.bouncy);
  }, [scale, opacity]);

  const containerStyle = [
    styles.base,
    styles[variant],
    disabled && styles.disabled,
  ];

  if (onPress) {
    return (
      <Animated.View
        style={[containerStyle, animatedStyle, style]}
        testID={testID}
      >
        <Animated.View
          onTouchStart={handlePressIn}
          onTouchEnd={handlePressOut}
          onTouchCancel={handlePressOut}
          // @ts-ignore — RN supports onStartShouldSetResponder
          onStartShouldSetResponder={() => true}
          onResponderRelease={() => {
            handlePressOut();
            onPress?.();
          }}
          style={styles.pressable}
        >
          {children}
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <View style={[containerStyle, style]} testID={testID}>
      {children}
    </View>
  );
}
