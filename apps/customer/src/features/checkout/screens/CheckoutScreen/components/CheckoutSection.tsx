import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { createStyles } from '../styles';

interface CheckoutSectionProps {
  colors: AppColors;
  title?: string;
  children: React.ReactNode;
}

export function CheckoutSection({ colors, title, children }: CheckoutSectionProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {children}
    </View>
  );
}
