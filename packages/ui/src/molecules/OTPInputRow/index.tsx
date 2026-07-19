import React, { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppText } from '../../atoms';

export interface OTPInputRowProps {
  value: string;
  length?: number;
  onChangeText: (value: string) => void;
  error?: string;
  testID?: string;
}

export function OTPInputRow({
  value,
  length = 6,
  onChangeText,
  error,
  testID,
}: OTPInputRowProps) {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const cells = Array.from({ length }, (_, index) => value[index] ?? '');

  return (
    <View testID={testID}>
      <Pressable style={styles.row} onPress={() => inputRef.current?.focus()}>
        {cells.map((digit, index) => (
          <View
            key={`${index}-${digit}`}
            style={[
              styles.cell,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: error ? colors.error : colors.border,
              },
            ]}
          >
            <AppText variant="h4" align="center">{digit}</AppText>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        style={styles.hiddenInput}
      />
      {error ? <AppText variant="caption" color={colors.error} align="center">{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
  },
  cell: {
    width: 48,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
});
