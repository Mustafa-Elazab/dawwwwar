import React from 'react';
import { StatusBar, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { Skeleton } from '../../atoms/Skeleton';
import { EmptyState } from '../../molecules/EmptyState';
import { ErrorState } from '../../molecules/ErrorState';
import { NetworkBanner } from '../../molecules/NetworkBanner';
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
  onEndReached,
  onEndReachedThreshold = 0.5,
  showsVerticalScrollIndicator = false,

  skeletonCount = 5,
  renderSkeleton,
}: ListScreenTemplateProps<T>) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const resolvedBg = backgroundColor ?? colors.background;

  const renderSkeletonItem = renderSkeleton ?? (() => <DefaultSkeleton />);

  // Loading state: render skeletonCount skeleton rows
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: resolvedBg }, style]} edges={edges}>
        <StatusBar barStyle={colors.statusBarStyle} backgroundColor={resolvedBg} />
        {header}
        <View style={styles.list}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <React.Fragment key={`skeleton-${i}`}>
              {renderSkeletonItem()}
            </React.Fragment>
          ))}
        </View>
        <NetworkBanner />
      </SafeAreaView>
    );
  }

  // Error state
  if (isError) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: resolvedBg }, style]} edges={edges}>
        <StatusBar barStyle={colors.statusBarStyle} backgroundColor={resolvedBg} />
        {header}
        <ErrorState onRetry={onRetry} />
        <NetworkBanner />
      </SafeAreaView>
    );
  }

  const isEmpty = !data || data.length === 0;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: resolvedBg }, style]}
      edges={edges}
      testID={testID}
    >
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={resolvedBg} />
      {header}
      <FlatList<T>
        style={styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={
          isEmpty ? (
            <EmptyState
              icon={emptyIcon}
              title={emptyTitle}
              subtitle={emptySubtitle}
              action={emptyAction}
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
      <NetworkBanner />
    </SafeAreaView>
  );
}
