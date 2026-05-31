import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Button } from '@dawwar/ui';
import { createStyles } from '../styles';

interface CartFooterProps {
  colors: AppColors;
  label: string;
  onCheckout: () => void;
}

export function CartFooter({ colors, label, onCheckout }: CartFooterProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.footer}>
      <Button
        label={label}
        onPress={onCheckout}
        fullWidth
        style={styles.checkoutBtn}
      />
    </View>
  );
}
