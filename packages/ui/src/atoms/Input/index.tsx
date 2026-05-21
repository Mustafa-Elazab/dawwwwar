import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, I18nManager, Text as RNText } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme, springs, transitions } from '@dawwar/theme';
import { Text } from '../Text';
import { createStyles } from './styles';
import type { InputProps } from './types';

const AnimatedLabelText = Animated.createAnimatedComponent(RNText);

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  maxLength,
  autoFocus = false,
  onBlur,
  onFocus,
  containerStyle,
  testID,
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const styles = createStyles(colors, isFocused, !!error);

  const inputRef = React.useRef<TextInput>(null);

  // ─── Animations ───────────────────────────────────────────────────
  const focusAnim = useSharedValue(0);
  const errorAnim = useSharedValue(0);
  const labelAnim = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, {
      duration: transitions.base,
    });
  }, [isFocused, focusAnim]);

  useEffect(() => {
    labelAnim.value = withSpring(isFocused || value ? 1 : 0, springs.soft);
  }, [isFocused, value, labelAnim]);

  useEffect(() => {
    if (error) {
      errorAnim.value = withSequence(
        withSpring(-10, springs.stiff),
        withSpring(10, springs.stiff),
        withSpring(-10, springs.stiff),
        withSpring(0, springs.stiff),
      );
    }
  }, [error, errorAnim]);

  const animatedInputRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: errorAnim.value }],
    borderColor: interpolateColor(
      focusAnim.value,
      [0, 1],
      [
        error ? colors.error : colors.border,
        error ? colors.error : colors.borderFocus,
      ],
    ),
  }));

  const animatedLabelStyle = useAnimatedStyle(() => {
    const translateY = interpolate(labelAnim.value, [0, 1], [0, -28]);
    const scale = interpolate(labelAnim.value, [0, 1], [1, 0.85]);
    const translateX = interpolate(
      labelAnim.value,
      [0, 1],
      [0, I18nManager.isRTL ? 4 : -4],
    );

    return {
      transform: [{ translateY }, { scale }, { translateX }],
      color: interpolateColor(focusAnim.value, [0, 1], [
        error ? colors.error : colors.textSecondary,
        error ? colors.error : colors.primary,
      ]),
    };
  });

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        {label && (
          <AnimatedLabelText
            pointerEvents="none"
            style={[styles.labelFloating, styles.labelText, animatedLabelStyle]}
          >
            {label}
          </AnimatedLabelText>
        )}

        <Animated.View
          style={[
            styles.inputRow,
            !editable && styles.disabled,
            animatedInputRowStyle,
          ]}
        >
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <TextInput
            ref={inputRef}
            style={[styles.input, multiline && styles.multiline]}
            value={value}
            onChangeText={onChangeText}
            placeholder={isFocused ? placeholder : ''}
            placeholderTextColor={colors.placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            editable={editable}
            maxLength={maxLength}
            autoFocus={autoFocus}
            onFocus={handleFocus}
            onBlur={handleBlur}
            testID={testID}
          />
          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </Animated.View>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!error && !!hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}
