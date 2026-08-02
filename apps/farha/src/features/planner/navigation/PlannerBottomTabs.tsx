import React, { useMemo } from 'react';
import { I18nManager, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppIcon, AppText } from '@dawwar/ui';

import { usePlannerController } from '../context/PlannerControllerContext';
import { PLANNER_TAB_CONFIG, PLANNER_TAB_KEYS } from './plannerTabs';

export function PlannerBottomTabs() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(), []);
  const controller = usePlannerController();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}
    >
      <View style={[styles.container, { backgroundColor: colors.tabBar }]}>
        <View style={styles.tabsRow}>
          {PLANNER_TAB_KEYS.map((tab) => {
            const config = PLANNER_TAB_CONFIG[tab];
            const active = controller.activeTab === tab;
            const color = active ? colors.tabBarIconActive : colors.tabBarIcon;

            return (
              <Pressable
                key={tab}
                accessibilityRole="button"
                accessibilityState={active ? { selected: true } : undefined}
                accessibilityLabel={t(config.labelKey)}
                style={styles.tabButton}
                onPress={() => controller.openTab(tab)}
              >
                <View style={styles.tabItem}>
                  <View
                    style={[
                      styles.iconBubble,
                      active ? { backgroundColor: colors.primaryLight } : undefined,
                    ]}
                  >
                    <AppIcon
                      name={active ? config.activeIcon : config.inactiveIcon}
                      size={22}
                      color={color}
                    />
                  </View>
                  <AppText
                    variant="caption"
                    color={color}
                    align="center"
                    numberOfLines={1}
                    style={styles.label}
                  >
                    {t(config.labelKey)}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    wrapper: {
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 6,
      paddingTop: 6,
    },
    container: {
      width: '100%',
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    tabsRow: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabItem: {
      minWidth: 54,
      minHeight: 54,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    iconBubble: {
      width: 42,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '800',
      textAlign: 'center',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
  });
