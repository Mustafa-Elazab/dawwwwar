import React from 'react';
import {
  I18nManager,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import {
  CATEGORY_ROUTES,
  HOME_ROUTES,
  LIKED_ROUTES,
  ORDER_ROUTES,
  PROFILE_ROUTES,
  TAB_ROUTES,
} from './routes';
import type { CustomerTabParamList } from './types';
import { CartModal } from './placeholders';
import { CategoriesStack } from './stacks/CategoriesStack';
import { HomeStack } from './stacks/HomeStack';
import { LikedStack } from './stacks/LikedStack';
import { OrdersStack } from './stacks/OrdersStack';
import { ProfileStack } from './stacks/ProfileStack';

const Tab = createBottomTabNavigator<CustomerTabParamList>();

const TAB_CONFIG = {
  [TAB_ROUTES.HOME_TAB]: {
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
    label: 'mainTabs.home',
    rootRoute: HOME_ROUTES.HOME,
    visible: true,
  },
  [TAB_ROUTES.CATEGORY_TAB]: {
    activeIcon: 'view-grid',
    inactiveIcon: 'view-grid-outline',
    label: 'mainTabs.categories',
    rootRoute: CATEGORY_ROUTES.CATEGORIES,
    visible: false,
  },
  [TAB_ROUTES.ORDERS_TAB]: {
    activeIcon: 'clipboard-text',
    inactiveIcon: 'clipboard-text-outline',
    label: 'mainTabs.orders',
    rootRoute: ORDER_ROUTES.ORDERS_LIST,
    visible: true,
  },
  [TAB_ROUTES.PROFILE_TAB]: {
    activeIcon: 'account-circle',
    inactiveIcon: 'account-circle-outline',
    label: 'mainTabs.profile',
    rootRoute: PROFILE_ROUTES.PROFILE,
    visible: true,
  },
  [TAB_ROUTES.BASKET_TAB]: {
    activeIcon: 'basket',
    inactiveIcon: 'basket-outline',
    label: 'mainTabs.basket',
    rootRoute: TAB_ROUTES.BASKET_TAB,
    visible: true,
  },
  [TAB_ROUTES.LIKED_TAB]: {
    activeIcon: 'heart',
    inactiveIcon: 'heart-outline',
    label: 'mainTabs.liked',
    rootRoute: LIKED_ROUTES.LIKED,
    visible: true,
  },
} as const;

function shouldShowTabBar(route: BottomTabBarProps['state']['routes'][number]) {
  const config = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];
  if (!config?.visible) return false;

  const focusedRoute = getFocusedRouteNameFromRoute(route);
  return !focusedRoute || focusedRoute === config.rootRoute;
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index];

  if (!shouldShowTabBar(activeRoute)) return null;

  const visibleRoutes = state.routes.filter((route) => {
    const config = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];
    return config?.visible;
  });

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
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.tabBar,
          },
        ]}
      >
        <View style={styles.tabsRow}>
          {visibleRoutes.map((route) => {
            const routeIndex = state.routes.findIndex((candidate) => candidate.key === route.key);
            const isFocused = state.index === routeIndex;
            const config = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];
            const color = isFocused ? colors.primary : colors.textTertiary;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) return;

              if (route.name === TAB_ROUTES.HOME_TAB) {
                navigation.navigate(TAB_ROUTES.HOME_TAB, { screen: HOME_ROUTES.HOME });
                return;
              }

              if (route.name === TAB_ROUTES.CATEGORY_TAB) {
                navigation.navigate(TAB_ROUTES.CATEGORY_TAB, { screen: CATEGORY_ROUTES.CATEGORIES });
                return;
              }

              if (route.name === TAB_ROUTES.ORDERS_TAB) {
                navigation.navigate(TAB_ROUTES.ORDERS_TAB, { screen: ORDER_ROUTES.ORDERS_LIST });
                return;
              }

              if (route.name === TAB_ROUTES.BASKET_TAB) {
                navigation.navigate(TAB_ROUTES.BASKET_TAB);
                return;
              }

              if (route.name === TAB_ROUTES.LIKED_TAB) {
                navigation.navigate(TAB_ROUTES.LIKED_TAB, { screen: LIKED_ROUTES.LIKED });
                return;
              }

              if (route.name === TAB_ROUTES.PROFILE_TAB) {
                navigation.navigate(TAB_ROUTES.PROFILE_TAB, { screen: PROFILE_ROUTES.PROFILE });
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                style={styles.tabButton}
              >
                <View style={styles.tabItem}>
                  <View
                    style={[
                      styles.iconBubble,
                      isFocused && {
                        backgroundColor: colors.primaryLight,
                      },
                    ]}
                  >
                    <Icon
                      name={isFocused ? config.activeIcon : config.inactiveIcon}
                      size={22}
                      color={color}
                    />
                  </View>
                  <Text style={[styles.label, { color }]} numberOfLines={1}>
                    {t(config.label)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export function CustomerTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tab.Screen name={TAB_ROUTES.HOME_TAB} component={HomeStack} />
      <Tab.Screen name={TAB_ROUTES.ORDERS_TAB} component={OrdersStack} />
      <Tab.Screen name={TAB_ROUTES.BASKET_TAB} component={CartModal} />
      <Tab.Screen name={TAB_ROUTES.LIKED_TAB} component={LikedStack} />
      <Tab.Screen name={TAB_ROUTES.PROFILE_TAB} component={ProfileStack} />
      <Tab.Screen name={TAB_ROUTES.CATEGORY_TAB} component={CategoriesStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
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
