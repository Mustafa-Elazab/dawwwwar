import React from 'react';
import { ListItem, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import type { SettingsRowProps } from './types';

export function SettingsRow({
  icon, iconColor, title, subtitle, onPress, rightElement, testID,
}: SettingsRowProps) {
  const { colors } = useTheme();
  return (
    <ListItem
      title={title}
      subtitle={subtitle}
      leftElement={<Icon name={icon} size={22} color={iconColor ?? colors.primary} />}
      rightElement={rightElement}
      onPress={onPress}
      showChevron={!!onPress && !rightElement}
      testID={testID}
    />
  );
}
