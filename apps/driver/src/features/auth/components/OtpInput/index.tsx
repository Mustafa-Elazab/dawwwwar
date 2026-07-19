import React, { useRef } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../../../../../../../packages/ui/src/atoms/Text';
import { createStyles } from './styles';
import type { OtpInputProps } from './types';

export function OtpInput({
  value = '',
  length = 6,
  onChange,
  hasError,
  testID,
}: OtpInputProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, hasError);
  const inputRef = useRef<TextInput>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.row} testID={testID}>
      {Array.from({ length }).map((_, i) => {
        const char = value[i] || '';
        const isFocused = value.length === i;

        return (
        <TouchableOpacity
          key={i}
          style={[
            styles.box,
            char ? styles.boxFilled : null,
            isFocused ? styles.boxFocused : null,
          ]}
          onPress={focusInput}
          activeOpacity={1}
        >
          <Text style={styles.digit}>{char}</Text>
        </TouchableOpacity>
        );
      })}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={(text) => {
          const cleanText = text.replace(/\D/g, '').slice(0, length);
          onChange?.(cleanText);
        }}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
      />
    </View>
  );
}
