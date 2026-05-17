import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@dawwar/theme';
import type { IconProps } from './types';

export function Icon({ name, size = 24, color, testID, style }: IconProps) {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color ?? colors.icon}
      testID={testID}
      // @ts-ignore
      style={style}
    />
  );
}
