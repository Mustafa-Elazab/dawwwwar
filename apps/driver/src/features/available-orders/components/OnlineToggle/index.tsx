import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';

interface OnlineToggleProps {
  isOnline: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export function OnlineToggle({ isOnline, onToggle, isLoading }: OnlineToggleProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, isOnline);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>
          {isOnline ? t('driver.online_status') : t('driver.offline_status')}
        </Text>
      </View>
      <Text style={styles.subtitleText}>
        {isOnline ? t('driver.online_sub') : t('driver.offline_sub')}
      </Text>
      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={onToggle}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        <Text style={styles.toggleBtnText}>
          {isOnline ? t('driver.go_offline') : t('driver.go_online')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
