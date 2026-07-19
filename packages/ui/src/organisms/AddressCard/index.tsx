import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppCard, AppIcon, AppText } from '../../atoms';

export interface AddressCardProps {
  label: string;
  address: string;
  selected?: boolean;
  onPress?: () => void;
}

export function AddressCard({ label, address, selected, onPress }: AddressCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard
      style={[styles.card, { borderColor: selected ? colors.primary : colors.border }]}
      onPress={onPress}
    >
      <View style={[styles.icon, { backgroundColor: colors.primaryLight }]}>
        <AppIcon name="map-marker-outline" size={20} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <AppText variant="label" numberOfLines={1}>{label}</AppText>
        <AppText variant="body2" color={colors.textSecondary} numberOfLines={2}>{address}</AppText>
      </View>
      {selected ? <AppIcon name="radiobox-marked" size={22} color={colors.primary} /> : <AppIcon name="radiobox-blank" size={22} color={colors.icon} />}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    borderWidth: 1,
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
