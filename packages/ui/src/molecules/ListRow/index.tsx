import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppIcon, AppPressable, AppText } from '../../atoms';

export interface ListRowProps {
  icon?: string;
  label: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  testID?: string;
}

export function ListRow({
  icon,
  label,
  subtitle,
  rightElement,
  showChevron = true,
  onPress,
  testID,
}: ListRowProps) {
  const { colors } = useTheme();

  return (
    <AppPressable
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
      testID={testID}
    >
      {icon ? (
        <View style={[styles.icon, { backgroundColor: colors.surfaceVariant }]}>
          <AppIcon name={icon} size={20} color={colors.icon} />
        </View>
      ) : null}
      <View style={styles.textBlock}>
        <AppText variant="label" numberOfLines={1}>{label}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={2}>{subtitle}</AppText>
        ) : null}
      </View>
      {rightElement}
      {showChevron ? (
        <AppIcon
          name="chevron-right"
          size={22}
          color={colors.icon}
          style={styles.chevron}
        />
      ) : null}
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: spacing[4],
    paddingEnd: spacing[3],
    gap: spacing[3],
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  chevron: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
