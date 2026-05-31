import type { StyleProp, ViewStyle, ScrollViewProps } from 'react-native';
import type { ScreenTemplateProps } from '../ScreenTemplate/types';
import type { EmptyStateProps } from '../../molecules/EmptyState/types';

export interface ScrollScreenTemplateProps extends ScreenTemplateProps {
  isLoading?: boolean;
  loadingMessage?: string;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyState?: EmptyStateProps;
  refreshing?: boolean;
  onRefresh?: () => void;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  scrollEnabled?: boolean;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  stickyHeaderIndices?: number[];
}
