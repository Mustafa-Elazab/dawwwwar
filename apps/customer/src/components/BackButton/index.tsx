import React from 'react';
import { TouchableOpacity, I18nManager, StyleSheet } from 'react-native';
import { Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';

interface BackButtonProps {
  onPress: () => void;
}

export const BackButton = ({ onPress }: BackButtonProps) => {
  const { colors } = useTheme();
  // In RTL, we want chevron-right to point "back"
  // In LTR, we want chevron-left to point "back"
  const icon = I18nManager.isRTL ? 'chevron-right' : 'chevron-left';

  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Icon name={icon} size={28} color={colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
