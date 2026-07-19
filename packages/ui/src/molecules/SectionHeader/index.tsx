import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { spacing } from '@dawwar/theme';
import { AppPressable, AppText, AppIcon } from '../../atoms';

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  testID?: string;
}

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
  testID,
}: SectionHeaderProps) {
  return (
    <View style={styles.row} testID={testID}>
      <AppText variant="h4" numberOfLines={1}>{title}</AppText>
      {actionLabel ? (
        <AppPressable style={styles.action} onPress={onActionPress}>
          <AppText variant="label">{actionLabel}</AppText>
          <AppIcon name="chevron-right" size={18} style={styles.chevron} />
        </AppPressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: spacing[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  chevron: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
