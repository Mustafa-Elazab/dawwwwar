import type { ListRenderItem, StyleProp, ViewStyle, SectionListData } from 'react-native';
import type { ScreenTemplateProps } from '../ScreenTemplate/types';

export interface ListScreenTemplateProps<T> extends ScreenTemplateProps {
  // Data
  data: T[] | undefined;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;

  // State flags — template handles rendering automatically
  isLoading?: boolean;
  isError?: boolean;
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
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  showsVerticalScrollIndicator?: boolean;

  // Skeleton config
  skeletonCount?: number;
  renderSkeleton?: () => React.ReactElement;
}
