import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Skeleton } from '@dawwar/ui';
import { createStyles } from '../styles';

interface MerchantLoadingStateProps {
  colors: AppColors;
  isRTL: boolean;
}

export function MerchantLoadingState({ colors, isRTL }: MerchantLoadingStateProps) {
  const styles = createStyles(colors, isRTL);

  return (
    <View style={styles.loadingContainer}>
      <Skeleton width="100%" height={220} />
      <View style={styles.loadingContent}>
        <Skeleton width="60%" height={24} />
        <Skeleton width="80%" height={16} />
      </View>
    </View>
  );
}
