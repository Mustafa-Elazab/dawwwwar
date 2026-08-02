import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppText } from '@dawwar/ui';

import { createPhase1ScreenStyles } from '../../planner/utils/styles';

export function AdBanner() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);

  return (
    <View style={styles.adBanner}>
      <AppText variant="caption" color={colors.textSecondary} align="center">
        {t('farha.phase1.ads.banner')}
      </AppText>
    </View>
  );
}
