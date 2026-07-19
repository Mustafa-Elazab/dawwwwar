import type { ReactNode } from 'react';
import type { StatusBarStyle, StyleProp, ViewStyle } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import type { HeaderProps } from '../../organisms/Header/types';
import type { EmptyStateProps } from '../../molecules/EmptyState/types';

export interface ScreenStateConfig {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyState?: EmptyStateProps;
}

export interface AppScreenTemplateProps {
  children?: ReactNode;
  header?: ReactNode;
  headerProps?: HeaderProps;
  footer?: ReactNode;
  backgroundColor?: string;
  statusBarStyle?: StatusBarStyle;
  statusBarBackgroundColor?: string;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  loadingMessage?: string;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyState?: EmptyStateProps;
  state?: ScreenStateConfig;
  testID?: string;
}
