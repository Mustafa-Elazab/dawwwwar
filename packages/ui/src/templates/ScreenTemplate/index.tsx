import React from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { NetworkBanner } from '../../molecules/NetworkBanner';
import { createStyles } from './styles';
import type { ScreenTemplateProps } from './types';

export function ScreenTemplate({
  children,
  header,
  footer,
  backgroundColor,
  edges = ['top', 'bottom'],
  style,
  contentStyle,
  testID,
}: ScreenTemplateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView
      style={[styles.safeArea, backgroundColor ? { backgroundColor } : undefined, style]}
      edges={edges}
      testID={testID}
    >
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={backgroundColor ?? colors.statusBarBg}
        translucent={false}
      />
      {header}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
      {footer}
      <NetworkBanner />
    </SafeAreaView>
  );
}
