import React from 'react';
import { I18nManager, Pressable, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppIcon, AppText } from '@dawwar/ui';

import { BudgetCategoryListScreen } from '../features/budget/screens';
import { ChecklistTimelineScreen } from '../features/checklist/screens';
import { EventDashboardScreen } from '../features/events/screens';
import { SettingsScreen } from '../features/settings/screens';
import { FARHA_TAB_ROUTES } from './routes';
import type { FarhaTabParamList } from './types';
import { PLANNER_TAB_CONFIG, PLANNER_TAB_KEYS } from './plannerTabs';

const Tab = createBottomTabNavigator<FarhaTabParamList>();

const TAB_ROUTE_BY_KEY = {
  home: FARHA_TAB_ROUTES.HOME,
  budget: FARHA_TAB_ROUTES.BUDGET,
  checklist: FARHA_TAB_ROUTES.CHECKLIST,
  settings: FARHA_TAB_ROUTES.SETTINGS,
} as const;

function FarhaTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

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
            const routeName = TAB_ROUTE_BY_KEY[tab];
            const routeIndex = state.routes.findIndex((route) => route.name === routeName);
            const isFocused = state.index === routeIndex;
            const config = PLANNER_TAB_CONFIG[tab];
            const color = isFocused ? colors.primary : colors.textTertiary;

            const onPress = () => {
              const route = state.routes[routeIndex];
              if (!route) return;

              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!event.defaultPrevented) {
                navigation.navigate(routeName);
              }
            };

            return (
              <Pressable
                key={tab}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : undefined}
                accessibilityLabel={t(config.labelKey)}
                onPress={onPress}
                style={styles.tabButton}
              >
                <View style={styles.tabItem}>
                  <View
                    style={[
                      styles.iconBubble,
                      isFocused ? { backgroundColor: colors.primaryLight } : undefined,
                    ]}
                  >
                    <AppIcon
                      name={isFocused ? config.activeIcon : config.inactiveIcon}
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

export function FarhaTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <FarhaTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tab.Screen name={FARHA_TAB_ROUTES.HOME} component={EventDashboardScreen} />
      <Tab.Screen name={FARHA_TAB_ROUTES.BUDGET} component={BudgetCategoryListScreen} />
      <Tab.Screen name={FARHA_TAB_ROUTES.CHECKLIST} component={ChecklistTimelineScreen} />
      <Tab.Screen name={FARHA_TAB_ROUTES.SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
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
