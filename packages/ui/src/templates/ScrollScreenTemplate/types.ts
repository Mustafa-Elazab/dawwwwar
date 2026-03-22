import type { StyleProp, ViewStyle, ScrollViewProps } from 'react-native';
import type { ScreenTemplateProps } from '../ScreenTemplate/types';

export interface ScrollScreenTemplateProps extends ScreenTemplateProps {
  refreshing?: boolean;
  onRefresh?: () => void;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  scrollEnabled?: boolean;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
}
