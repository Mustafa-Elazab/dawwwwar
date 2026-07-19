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
  state,
  testID,
}: AppScreenTemplateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const resolvedBg = backgroundColor ?? colors.background;
  const resolvedIsLoading = state?.isLoading ?? isLoading;
  const resolvedLoadingMessage = state?.loadingMessage ?? loadingMessage;
  const resolvedIsError = state?.isError ?? isError;
  const resolvedErrorMessage = state?.errorMessage ?? errorMessage;
  const resolvedIsEmpty = state?.isEmpty ?? isEmpty;
  const resolvedEmptyState = state?.emptyState ?? emptyState;

  const renderContent = () => {
    if (resolvedIsError) {
      return (
        <View style={styles.stateContainer}>
          <ErrorState message={resolvedErrorMessage} onRetry={onRetry} />
        </View>
      );
    }

    if (resolvedIsEmpty && resolvedEmptyState) {
      return (
        <View style={styles.stateContainer}>
          <EmptyState {...resolvedEmptyState} />
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
      {resolvedIsLoading ? (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <LoadingSpinner message={resolvedLoadingMessage} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
