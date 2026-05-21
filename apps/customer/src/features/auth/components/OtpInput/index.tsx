import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';
import { useTheme } from '@dawwar/theme';
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
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const chars = Array.from({ length }, (_, idx) => value[idx] ?? '');

  const focusIndex = (idx: number) => {
    inputRefs.current[idx]?.focus();
  };

  const handleDigitChange = (idx: number, text: string) => {
    const nextChar = text.replace(/\D/g, '').slice(-1);
    const next = [...chars];
    next[idx] = nextChar;
    const joined = next.join('');
    onChange?.(joined);

    if (nextChar && idx < length - 1) {
      focusIndex(idx + 1);
    }
  };

  return (
    <View style={styles.row} testID={testID}>
      {chars.map((char, idx) => {
        const isFocused = value.length === idx && value.length < length;

        return (
          <TextInput
            key={idx}
            ref={r => {
              inputRefs.current[idx] = r;
            }}
            value={char}
            onChangeText={text => handleDigitChange(idx, text)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key !== 'Backspace') return;
              if (char) {
                const next = [...chars];
                next[idx] = '';
                onChange?.(next.join(''));
                return;
              }
              if (idx > 0) {
                focusIndex(idx - 1);
              }
            }}
            keyboardType="number-pad"
            textContentType={idx === 0 ? 'oneTimeCode' : 'none'}
            autoComplete={idx === 0 ? 'sms-otp' : 'off'}
            maxLength={1}
            autoFocus={idx === 0}
            style={[
              styles.box,
              char ? styles.boxFilled : null,
              isFocused ? styles.boxFocused : null,
            ]}
          />
        );
      })}
    </View>
  );
}
