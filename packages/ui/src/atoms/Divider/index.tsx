import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import type { DividerProps } from './types';

export function Divider({
  orientation = 'horizontal',
  thickness = 1,
  color,
  style,
}: DividerProps) {
  const { colors } = useTheme();
  const resolvedColor = color ?? colors.border;

  return (
    <View
      style={[
        orientation === 'horizontal'
          ? { width: '100%', height: thickness, backgroundColor: resolvedColor }
          : { width: thickness, alignSelf: 'stretch', backgroundColor: resolvedColor },
        style,
      ]}
    />
  );
}
