import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
      <Icon name="plus" size={20} color="#fff" />
      <Text style={styles.label}>{t('home.custom_order_btn')}</Text>
    </TouchableOpacity>
  );
}
