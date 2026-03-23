import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';

interface CartBarProps {
  itemCount: number;
  total: number;
  onPress: () => void;
}

export function CartBar({ itemCount, total, onPress }: CartBarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  if (itemCount === 0) return null;

  return (
    <TouchableOpacity style={styles.bar} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.leftText}>
        {itemCount} {t('cart.items_count')}
      </Text>
      <Text style={styles.rightText}>
        {t('cart.checkout')} · {total} {t('common.egp')}
      </Text>
    </TouchableOpacity>
  );
}
