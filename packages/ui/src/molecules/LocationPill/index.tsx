import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppIcon, AppPressable, AppText } from '../../atoms';

export interface LocationPillProps {
  label: string;
  address: string;
  onPress?: () => void;
  testID?: string;
}

export function LocationPill({
  label,
  address,
  onPress,
  testID,
}: LocationPillProps) {
  const { colors } = useTheme();

  return (
    <AppPressable style={styles.root} onPress={onPress} disabled={!onPress} testID={testID}>
      <View style={[styles.icon, { backgroundColor: colors.primaryLight }]}>
        <AppIcon name="map-marker-outline" size={20} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <AppText variant="caption" color={colors.textSecondary}>{label}</AppText>
        <AppText variant="label" numberOfLines={1}>{address}</AppText>
      </View>
      <AppIcon name="menu-down" size={22} color={colors.primary} />
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
});
