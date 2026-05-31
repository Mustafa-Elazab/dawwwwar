import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Button } from '@dawwar/ui';
import { createStyles } from '../styles';

interface OrderDetailFooterProps {
  colors: AppColors;
  isRTL: boolean;
  canCancel: boolean;
  isActive: boolean;
  cancelLabel: string;
  trackLabel: string;
  reorderLabel: string;
  onCancel: () => void;
  onTrack: () => void;
  onReorder: () => void;
}

export function OrderDetailFooter({
  colors,
  isRTL,
  canCancel,
  isActive,
  cancelLabel,
  trackLabel,
  reorderLabel,
  onCancel,
  onTrack,
  onReorder,
}: OrderDetailFooterProps) {
  const styles = createStyles(colors, isRTL);

  return (
    <View style={styles.footer}>
      {canCancel ? (
        <Button
          label={cancelLabel}
          variant="outline"
          onPress={onCancel}
          style={styles.footerButton}
        />
      ) : null}
      {isActive ? (
        <Button
          label={trackLabel}
          onPress={onTrack}
          style={styles.footerButton}
        />
      ) : (
        <Button
          label={reorderLabel}
          onPress={onReorder}
          style={styles.footerButton}
        />
      )}
    </View>
  );
}
