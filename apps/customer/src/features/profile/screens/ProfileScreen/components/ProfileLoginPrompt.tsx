import React from 'react';
import { TouchableOpacity } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { createStyles } from '../styles';

interface ProfileLoginPromptProps {
  colors: AppColors;
  label: string;
  onPress: () => void;
}

export function ProfileLoginPrompt({
  colors,
  label,
  onPress,
}: ProfileLoginPromptProps) {
  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={styles.loginButton} onPress={onPress}>
      <Icon name="login" size={22} color={colors.primary} />
      <Text style={styles.loginButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}
