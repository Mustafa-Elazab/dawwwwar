import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppPressable, AppText } from '@dawwar/ui';

import { usePlannerController } from '../context/PlannerControllerContext';
import type { Phase1TabKey } from '../domain/phase1Types';
import { createPhase1ScreenStyles } from '../utils/styles';

export function BottomTabs() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);
  const controller = usePlannerController();
  const tabs: Phase1TabKey[] = ['home', 'budget', 'checklist', 'settings'];

  return (
    <View style={styles.bottomTabs}>
      {tabs.map((tab) => {
        const active = tab === controller.activeTab;
        return (
          <AppPressable
            key={tab}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.tabItem,
              { backgroundColor: active ? colors.primaryLight : 'transparent' },
            ]}
            onPress={() => controller.openTab(tab)}
          >
            <AppText
              variant="caption"
              color={active ? colors.primaryDark : colors.textSecondary}
              align="center"
              numberOfLines={1}
            >
              {t(`farha.phase1.tabs.${tab}`)}
            </AppText>
          </AppPressable>
        );
      })}
    </View>
  );
}
