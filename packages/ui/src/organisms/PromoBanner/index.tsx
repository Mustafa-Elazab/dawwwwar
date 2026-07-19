import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppImage, AppText } from '../../atoms';

export interface PromoBannerProps {
  title: string;
  subtitle?: string;
  imageUri?: string;
}

export function PromoBanner({ title, subtitle, imageUri }: PromoBannerProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.primaryLight }]}>
      <View style={styles.copy}>
        <AppText variant="h4" color={colors.primary}>{title}</AppText>
        {subtitle ? <AppText variant="body2" color={colors.textSecondary}>{subtitle}</AppText> : null}
      </View>
      <AppImage uri={imageUri} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 132,
    borderRadius: radius.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: spacing[4],
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing[2],
  },
  image: {
    width: 116,
    height: 104,
    borderRadius: radius.lg,
  },
});
