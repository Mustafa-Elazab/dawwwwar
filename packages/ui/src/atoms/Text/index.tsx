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
  ellipsizeMode,
  selectable = false,
  style,
  children,
  onPress,
  testID,
}: TextProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // RTL: default align right for Arabic, left for English
  const resolvedAlign =
    align ?? (I18nManager.isRTL ? 'right' : 'left');

  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        {
          color: color ?? colors.text,
          textAlign: resolvedAlign,
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}
      onPress={onPress}
      testID={testID}
    >
      {children}
    </RNText>
  );
}
