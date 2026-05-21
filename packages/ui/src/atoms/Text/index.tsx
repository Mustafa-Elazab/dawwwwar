import React from 'react';
import { Text as RNText, I18nManager } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { createStyles } from './styles';
import type { TextProps } from './types';

export function Text({
  variant = 'body1',
  color,
  align,
  numberOfLines,
  selectable = false,
  style,
  children,
  onPress,
  testID,
}: TextProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        {
          color: color ?? colors.text,
          ...(align ? { textAlign: align } : undefined),
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      selectable={selectable}
      onPress={onPress}
      testID={testID}
    >
      {children}
    </RNText>
  );
}
