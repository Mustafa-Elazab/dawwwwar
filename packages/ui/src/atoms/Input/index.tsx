import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../Text';
import { createStyles } from './styles';
import type { InputProps } from './types';

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

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, !editable && styles.disabled]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
          maxLength={maxLength}
          autoFocus={autoFocus}
          onFocus={() => { setIsFocused(true); onFocus?.(); }}
          onBlur={() => { setIsFocused(false); onBlur?.(); }}
          testID={testID}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {!error && hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}
