import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@dawwar/theme';

export interface AppPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  animatedFeedback?: boolean;
}

export function AppPressable({
  children,
  style,
  pressedStyle,
  animatedFeedback = true,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: AppPressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedFeedback ? animatedStyle : undefined}>
      <Pressable
        {...props}
        disabled={disabled}
        onPressIn={(event) => {
          if (animatedFeedback && !disabled) {
            scale.value = withSpring(0.97, springs.stiff);
          }
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          if (animatedFeedback) {
            scale.value = withSpring(1, springs.bouncy);
          }
          onPressOut?.(event);
        }}
        style={({ pressed }) => [
          style,
          pressed && !disabled ? pressedStyle : null,
          disabled ? { opacity: 0.5 } : null,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
