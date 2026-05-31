import React from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { EmptyState } from '../../molecules/EmptyState';
import { ErrorState } from '../../molecules/ErrorState';
import { LoadingSpinner } from '../../molecules/LoadingSpinner';
import { NetworkBanner } from '../../molecules/NetworkBanner';
import { Header } from '../../organisms/Header';
import { createStyles } from './styles';
import type { AppScreenTemplateProps } from './types';

export function AppScreenTemplate({
  children,
  header,
  headerProps,
  footer,
  backgroundColor,
  statusBarStyle,
  statusBarBackgroundColor,
  edges = ['top', 'bottom'],
  style,
  contentStyle,
  isLoading = false,
  loadingMessage,
  isError = false,
  errorMessage,
  onRetry,
  isEmpty = false,
  emptyState,
  testID,
}: AppScreenTemplateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const resolvedBg = backgroundColor ?? colors.background;

  const renderContent = () => {
    if (isError) {
      return (
        <View style={styles.stateContainer}>
          <ErrorState message={errorMessage} onRetry={onRetry} />
        </View>
      );
    }

    if (isEmpty && emptyState) {
      return (
        <View style={styles.stateContainer}>
          <EmptyState {...emptyState} />
        </View>
      );
    }

    return children;
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: resolvedBg }, style]}
      edges={edges}
      testID={testID}
    >
      <StatusBar
        barStyle={statusBarStyle ?? colors.statusBarStyle}
        backgroundColor={statusBarBackgroundColor ?? resolvedBg}
        translucent={false}
      />
      {headerProps ? <Header {...headerProps} /> : header}
      <View style={[styles.content, contentStyle]}>{renderContent()}</View>
      {footer}
      {isLoading ? (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <LoadingSpinner message={loadingMessage} />
        </View>
      ) : null}
      <NetworkBanner />
    </SafeAreaView>
  );
}
