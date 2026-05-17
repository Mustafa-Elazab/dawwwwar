import React, { useRef } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { createStyles } from './styles';
import type { OtpInputProps } from './types';

export function OtpInput({
  value = '',
  length = 6,
  onChange,
  hasError,
  testID,
}: OtpInputProps & { length?: number }) {
  const { colors } = useTheme();
  const styles = createStyles(colors, hasError);
  const inputRef = useRef<TextInput>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const renderBoxes = () => {
    const boxes = [];
    for (let i = 0; i < length; i++) {
      const char = value[i] || '';
      const isFocused = value.length === i;

      boxes.push(
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
    }
    return boxes;
  };

  return (
    <View style={styles.row} testID={testID}>
      {renderBoxes()}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={(text) => {
          const cleanText = text.replace(/\D/g, '').slice(0, length);
          if (onChange) {
            onChange(cleanText);
          }
        }}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
      />
    </View>
  );
}
