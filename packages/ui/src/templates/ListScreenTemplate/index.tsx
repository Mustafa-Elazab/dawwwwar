import React from 'react';
import { StatusBar, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { Skeleton } from '../../atoms/Skeleton';
import { EmptyState } from '../../molecules/EmptyState';
import { ErrorState } from '../../molecules/ErrorState';
import { NetworkBanner } from '../../molecules/NetworkBanner';
import { Header } from '../../organisms/Header';
import { createStyles } from './styles';
import type { ListScreenTemplateProps } from './types';

// Default skeleton row shown during loading
function DefaultSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={12} />
    </View>
  );
}

export function ListScreenTemplate<T>({
  children,
  header,
  headerProps,
  footer,
  backgroundColor,
  edges = ['top', 'bottom'],
  style,
  testID,

  data,
  renderItem,
  keyExtractor,

  isLoading = false,
  isError = false,
  state,
  onRetry,
  onRefresh,
  refreshing = false,

  emptyIcon = 'inbox-outline',
  emptyTitle = 'Nothing here',
  emptySubtitle,
  emptyAction,

  ListHeaderComponent,
  ListFooterComponent,
  ItemSeparatorComponent,
  numColumns,
  columnWrapperStyle,
  contentContainerStyle,
  onEndReached,
  onEndReachedThreshold = 0.5,
  showsVerticalScrollIndicator = false,

  skeletonCount = 5,
  renderSkeleton,
}: ListScreenTemplateProps<T>) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const resolvedBg = backgroundColor ?? colors.background;
  const resolvedIsLoading = state?.isLoading ?? isLoading;
  const resolvedIsError = state?.isError ?? isError;
  const resolvedIsEmpty = state?.isEmpty;
  const resolvedEmptyState = state?.emptyState;

  const renderSkeletonItem = renderSkeleton ?? (() => <DefaultSkeleton />);

  // Loading state: render skeletonCount skeleton rows
  if (resolvedIsLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: resolvedBg }, style]} edges={edges}>
        <StatusBar barStyle={colors.statusBarStyle} backgroundColor={resolvedBg} />
        {headerProps ? <Header {...headerProps} /> : header}
        <View style={styles.list}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <React.Fragment key={`skeleton-${i}`}>
              {renderSkeletonItem()}
            </React.Fragment>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (resolvedIsError) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: resolvedBg }, style]} edges={edges}>
        <StatusBar barStyle={colors.statusBarStyle} backgroundColor={resolvedBg} />
        {headerProps ? <Header {...headerProps} /> : header}
        <ErrorState message={state?.errorMessage} onRetry={onRetry} />
      </SafeAreaView>
    );
  }

  const isEmpty = resolvedIsEmpty ?? (!data || data.length === 0);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: resolvedBg }, style]}
      edges={edges}
      testID={testID}
    >
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={resolvedBg} />
      {headerProps ? <Header {...headerProps} /> : header}
      <FlatList<T>
        style={styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={contentContainerStyle}
        ListEmptyComponent={
          isEmpty ? (
            <EmptyState
              icon={resolvedEmptyState?.icon ?? emptyIcon}
              title={resolvedEmptyState?.title ?? emptyTitle}
              subtitle={resolvedEmptyState?.subtitle ?? emptySubtitle}
              action={resolvedEmptyState?.action ?? emptyAction}
            />
          ) : null
        }
        ItemSeparatorComponent={ItemSeparatorComponent ?? null}
        numColumns={numColumns}
        columnWrapperStyle={numColumns && numColumns > 1 ? columnWrapperStyle ?? styles.columnWrapper : undefined}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onRefresh={onRefresh}
        refreshing={refreshing}
        removeClippedSubviews
        windowSize={5}
        maxToRenderPerBatch={10}
        initialNumToRender={8}
      />
      {footer}
    </SafeAreaView>
  );
}
