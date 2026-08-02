import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppIcon, AppText } from '@dawwar/ui';

import { usePlannerController } from '../context/PlannerControllerContext';
import type { Phase1TabKey } from '../domain/phase1Types';
import { createPhase1ScreenStyles } from '../utils/styles';

const tabIcons: Record<Phase1TabKey, { active: string; inactive: string }> = {
  home: { active: 'home', inactive: 'home-outline' },
  budget: { active: 'wallet', inactive: 'wallet-outline' },
  checklist: { active: 'clipboard-check', inactive: 'clipboard-check-outline' },
  settings: { active: 'cog', inactive: 'cog-outline' },
};

export function BottomTabs() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);
  const controller = usePlannerController();
  const tabs: Phase1TabKey[] = ['home', 'budget', 'checklist', 'settings'];

  return (
    <View
      style={[
        styles.bottomTabs,
        {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}
    >
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const active = tab === controller.activeTab;
          const color = active ? colors.tabBarIconActive : colors.tabBarIcon;

          return (
            <Pressable
              key={tab}
              accessibilityRole="button"
              accessibilityState={active ? { selected: true } : {}}
              accessibilityLabel={t(`farha.phase1.tabs.${tab}`)}
              style={styles.tabButton}
              onPress={() => controller.openTab(tab)}
            >
              <View style={styles.tabItem}>
                <View
                  style={[
                    styles.tabIconBubble,
                    active ? { backgroundColor: colors.primaryLight } : null,
                  ]}
                >
                  <AppIcon
                    name={active ? tabIcons[tab].active : tabIcons[tab].inactive}
                    size={22}
                    color={color}
                  />
                </View>
                <AppText
                  variant="caption"
                  color={color}
                  align="center"
                  numberOfLines={1}
                  style={styles.tabLabel}
                >
                  {t(`farha.phase1.tabs.${tab}`)}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
