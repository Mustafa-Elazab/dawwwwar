import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Button, Text } from '@dawwar/ui';
import { createStyles } from '../styles';

interface OtpFooterProps {
  colors: AppColors;
  confirmLabel: string;
  sandboxHint: string;
  disabled: boolean;
  loading: boolean;
  onConfirm: () => void;
}

export function OtpFooter({
  colors,
  confirmLabel,
  sandboxHint,
  disabled,
  loading,
  onConfirm,
}: OtpFooterProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.bottomAction}>
      <Button
        label={confirmLabel}
        onPress={onConfirm}
        disabled={disabled}
        loading={loading}
        style={styles.confirmBtn}
        fullWidth
      />
      <Text style={styles.hintText}>{sandboxHint}</Text>
    </View>
  );
}
