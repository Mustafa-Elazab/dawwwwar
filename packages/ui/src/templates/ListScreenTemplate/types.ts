import type { ListRenderItem, StyleProp, ViewStyle } from 'react-native';
import type { ScreenTemplateProps } from '../ScreenTemplate/types';
import type { ScreenStateConfig } from '../AppScreenTemplate/types';

export interface ListScreenTemplateProps<T> extends ScreenTemplateProps {
  // Data
  data: T[] | undefined;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;

  // State flags — template handles rendering automatically
  isLoading?: boolean;
  isError?: boolean;
  state?: ScreenStateConfig;
  onRetry?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;

  // Empty state
  emptyIcon?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyAction?: { label: string; onPress: () => void };

  // List props
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  ItemSeparatorComponent?: React.ComponentType | null;
  numColumns?: number;
  columnWrapperStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  showsVerticalScrollIndicator?: boolean;

  // Skeleton config
  skeletonCount?: number;
  renderSkeleton?: () => React.ReactElement;
}
