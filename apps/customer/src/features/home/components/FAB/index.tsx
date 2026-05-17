import React, { useMemo } from 'react';
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
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
      <Icon name="pencil-box-outline" size={22} color="#fff" />
      <Text style={styles.label}>{'طلب مخصص'}</Text>
    </TouchableOpacity>
  );
}
