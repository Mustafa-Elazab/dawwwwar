import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppIcon, AppPressable, AppText } from '../../atoms';

export interface RadioRowProps {
  label: string;
  subtitle?: string;
  selected: boolean;
  icon?: string;
  onPress: () => void;
}

export function RadioRow({
  label,
  subtitle,
  selected,
  icon,
  onPress,
}: RadioRowProps) {
  const { colors } = useTheme();

  return (
    <AppPressable
      style={[
        styles.row,
        {
          backgroundColor: selected ? colors.primaryLight : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.border }]}>
        {selected ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}
      </View>
      {icon ? <AppIcon name={icon} size={22} color={selected ? colors.primary : colors.icon} /> : null}
      <View style={styles.textBlock}>
        <AppText variant="label">{label}</AppText>
        {subtitle ? <AppText variant="caption" color={colors.textSecondary}>{subtitle}</AppText> : null}
      </View>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingStart: spacing[4],
    paddingEnd: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  textBlock: {
    flex: 1,
  },
});
