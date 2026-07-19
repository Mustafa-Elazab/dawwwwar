import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { createStyles } from './styles';
import type { MapTemplateProps } from './types';

export function MapTemplate({
  header,
  map,
  content,
  footer,
  keyboardBehavior,
  style,
  mapContainerStyle,
  contentContainerStyle,
  contentPointerEvents,
}: MapTemplateProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={keyboardBehavior}
    >
      {header ? <View style={styles.header}>{header}</View> : null}
      <View style={[styles.mapContainer, mapContainerStyle]}>{map}</View>
      {content ? (
        <View
          style={[styles.content, contentContainerStyle]}
          pointerEvents={contentPointerEvents}
        >
          {content}
        </View>
      ) : null}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </KeyboardAvoidingView>
  );
}
