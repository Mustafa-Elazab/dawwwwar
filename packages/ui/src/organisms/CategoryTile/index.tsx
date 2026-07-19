import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppCard, AppIcon, AppText } from '../../atoms';

export interface CategoryTileProps {
  label: string;
  icon?: string;
  emoji?: string;
  selected?: boolean;
  onPress?: () => void;
  testID?: string;
}

export function CategoryTile({
  label,
  icon,
  emoji,
  selected,
  onPress,
  testID,
}: CategoryTileProps) {
  const { colors } = useTheme();

  return (
    <AppCard
      style={[
        styles.card,
        { backgroundColor: selected ? colors.primaryLight : colors.surface },
      ]}
      onPress={onPress}
      testID={testID}
    >
      {icon ? <AppIcon name={icon} size={28} color={colors.primary} /> : null}
      {!icon && emoji ? <AppText style={styles.emoji}>{emoji}</AppText> : null}
      <AppText variant="caption" align="center" numberOfLines={2}>{label}</AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 92,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  emoji: {
    fontSize: 28,
  },
});
