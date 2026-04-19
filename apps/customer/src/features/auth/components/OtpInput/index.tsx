import React, { useRef } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { createStyles } from './styles';
import type { OtpInputProps } from './types';

export function OtpInput({
  value,
  onChange,
  onBackspace,
  hasError,
  testID,
}: OtpInputProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, hasError);
  const inputs = useRef<(TextInput | null)[]>([]);

  const focusBox = (index: number) => {
    inputs.current[index]?.focus();
  };

  const length = value.length;

  return (
    <View style={styles.row} testID={testID}>
      {Array.from({ length }).map((_, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.box, value[i] ? styles.boxFilled : null]}
          onPress={() => focusBox(i)}
          activeOpacity={1}
        >
          <Text style={styles.digit}>{value[i] ?? ''}</Text>

          {/* Hidden TextInput for keyboard input */}
          <TextInput
            ref={(ref) => {
              inputs.current[i] = ref;
            }}
            style={styles.hiddenInput}
            value={value[i] ?? ''}
            keyboardType="number-pad"
            maxLength={1}
            caretHidden
            onChangeText={(char) => {
              const digit = char.replace(/\D/g, '');
              if (digit) {
                onChange(i, digit);
                // Auto-focus next box
                if (i < length - 1) {
                  setTimeout(() => focusBox(i + 1), 10);
                }
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !value[i]) {
                // Move to previous box on backspace when current is empty
                onBackspace(i);
                if (i > 0) {
                  setTimeout(() => focusBox(i - 1), 10);
                }
              }
            }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
