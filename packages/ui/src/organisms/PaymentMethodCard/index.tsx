import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppCard, AppIcon, AppText } from '../../atoms';

export interface PaymentMethodCardProps {
  label: string;
  subtitle?: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
}

export function PaymentMethodCard({
  label,
  subtitle,
  icon = 'credit-card-outline',
  selected,
  onPress,
}: PaymentMethodCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard
      style={[styles.card, { borderColor: selected ? colors.primary : colors.border }]}
      onPress={onPress}
    >
      <AppIcon name={icon} size={24} color={selected ? colors.primary : colors.icon} />
      <View style={styles.copy}>
        <AppText variant="label">{label}</AppText>
        {subtitle ? <AppText variant="caption" color={colors.textSecondary}>{subtitle}</AppText> : null}
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
    borderRadius: radius.lg,
  },
  copy: {
    flex: 1,
  },
});
