import React from 'react';
import { StatusBar, KeyboardAvoidingView, Platform, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { NetworkBanner } from '../../molecules/NetworkBanner';
import { Header } from '../../organisms/Header';
import { createStyles } from './styles';
import type { ScrollScreenTemplateProps } from './types';

export function ScrollScreenTemplate({
  children,
  header,
  headerProps,
  footer,
  backgroundColor,
  edges = ['top', 'bottom'],
  style,
  contentStyle,
  refreshing = false,
  onRefresh,
  keyboardShouldPersistTaps = 'handled',
  scrollEnabled = true,
  showsVerticalScrollIndicator = false,
  bounces = true,
  stickyHeaderIndices,
  testID,
}: ScrollScreenTemplateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const resolvedBg = backgroundColor ?? colors.background;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: resolvedBg }, style]}
      edges={edges}
      testID={testID}
    >
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={resolvedBg}
      />
      {headerProps ? <Header {...headerProps} /> : header}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          bounces={bounces}
          stickyHeaderIndices={stickyHeaderIndices}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
      {footer}
      <NetworkBanner />
    </SafeAreaView>
  );
}
