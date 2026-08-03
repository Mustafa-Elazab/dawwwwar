import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useTheme } from '@dawwar/theme';
import { spacing } from '@dawwar/theme';

import { recordFarhaError } from '../../../core/firebase/farhaFirebase';
import { canRequestFarhaAds } from './adConsent';

interface FarhaAdBannerProps {
  isPro: boolean;
  placement: 'dashboard' | 'budget_categories';
}

export function FarhaAdBanner({ isPro, placement }: FarhaAdBannerProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () => StyleSheet.create({
      wrapper: {
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: colors.surface,
        paddingVertical: spacing[2],
      },
    }),
    [colors.surface],
  );

  if (!canRequestFarhaAds(isPro)) return null;

  return (
    <View style={styles.wrapper}>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error) =>
          recordFarhaError(error, `farha_banner_ad_failed_${placement}`)
        }
      />
    </View>
  );
}
