import React, { memo, useCallback, useMemo } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text, AnimatedPressable } from '@dawwar/ui';
import {
  microInteractions,
  space,
  useTheme,
} from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';

import { CategoriesScreen } from './placeholders';
import { HOME_ROUTES, ORDER_ROUTES, PROFILE_ROUTES, TAB_ROUTES } from './routes';
import { HomeStack } from './stacks/HomeStack';
import { OrdersStack } from './stacks/OrdersStack';
import { ProfileStack } from './stacks/ProfileStack';
import type { CustomerTabParamList } from './types';
import { GuestProfileScreen } from '../features/profile/screens/GuestProfileScreen';
import { GuestLoginPromptScreen } from '../features/orders/screens/GuestLoginPromptScreen';
import { GlobalCartToast } from '../features/cart/components/GlobalCartToast';
import { useAppSelector } from '../store/hooks';
import { selectAuthStatus } from '../store/slices/auth.slice';

const Tab = createBottomTabNavigator<CustomerTabParamList>();

const TAB_METRICS = { iconSize: 22, minTabHeight: 48, minBottomPadding: space.sm } as const;

const TAB_CONFIG = {
  [TAB_ROUTES.HOME_TAB]: {
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
    labelKey: 'mainTabs.home',
    analyticsId: 'tab_home',
  },
  [TAB_ROUTES.CATEGORIES_TAB]: {
    activeIcon: 'shape',
    inactiveIcon: 'shape-outline',
    labelKey: 'mainTabs.categories',
    analyticsId: 'tab_categories',
  },
  [TAB_ROUTES.ORDERS_TAB]: {
    activeIcon: 'clipboard-text',
    inactiveIcon: 'clipboard-text-outline',
    labelKey: 'mainTabs.orders',
    analyticsId: 'tab_orders',
  },
  [TAB_ROUTES.PROFILE_TAB]: {
    activeIcon: 'account-circle',
    inactiveIcon: 'account-circle-outline',
    labelKey: 'mainTabs.profile',
    analyticsId: 'tab_profile',
  },
} as const;

type TabRouteName = keyof typeof TAB_CONFIG;

const TAB_BAR_VISIBLE_ROUTES: string[] = [
  HOME_ROUTES.HOME,
  TAB_ROUTES.CATEGORIES_TAB,
  ORDER_ROUTES.ORDERS_LIST,
  PROFILE_ROUTES.PROFILE,
];

const getTabBarVisibility = (route: Parameters<typeof getFocusedRouteNameFromRoute>[0]) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  if (!routeName) return true;
  return TAB_BAR_VISIBLE_ROUTES.includes(routeName);
};

// Placeholder hook points for future analytics wiring.
const trackTabPress = (_analyticsId: string) => {
  return;
};

// Placeholder hook point for future badge counts (cart, notifications, etc.).
const getBadgeCount = (_routeName: TabRouteName): number | undefined => {
  return undefined;
};

type TabButtonProps = {
  isFocused: boolean;
  routeName: TabRouteName;
  onPress: () => void;
  label: string;
  badgeCount?: number;
};

const TabButton = memo(function TabButton({
  isFocused,
  routeName,
  onPress,
  label,
  badgeCount,
}: TabButtonProps) {
  const { colors } = useTheme();
  const config = TAB_CONFIG[routeName];
  const iconColor = isFocused ? '#1DB954' : '#606060';

  return (
    <AnimatedPressable
      onPress={onPress}
      pressScale={microInteractions.pressScale}
      pressOpacity={microInteractions.pressOpacity}
      pressTranslateY={1}
      style={styles.tabButton}
    >
      <View style={styles.activeContainer}>
        <View style={styles.iconWrap}>
          <Icon
            name={isFocused ? config.activeIcon : config.inactiveIcon}
            size={TAB_METRICS.iconSize}
            color={iconColor}
          />
          {badgeCount != null && badgeCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: colors.error }]}> 
              <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : `${badgeCount}`}</Text>
            </View>
          ) : null}
        </View>

        {isFocused ? (
          <>
            <Text style={styles.activeLabel} numberOfLines={1}>{label}</Text>
            <View style={styles.activeDot} />
          </>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}, (prev, next) => {
  return (
    prev.isFocused === next.isFocused
    && prev.routeName === next.routeName
    && prev.label === next.label
    && prev.badgeCount === next.badgeCount
    && prev.onPress === next.onPress
  );
});

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isRTL = I18nManager.isRTL;

  const activeRoute = state.routes[state.index];
  const isVisible = getTabBarVisibility(activeRoute);
  if (!isVisible) return null;

  const orderedRoutes = useMemo(() => {
    return isRTL ? [...state.routes].reverse() : state.routes;
  }, [isRTL, state.routes]);

  const bottomPadding = Math.max(insets.bottom, TAB_METRICS.minBottomPadding);

  const handleTabPress = useCallback((routeKey: string, routeName: string, isFocused: boolean, analyticsId: string) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      trackTabPress(analyticsId);
      navigation.navigate(routeName as never);
    }
  }, [navigation]);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPadding }]}>
      <View style={styles.container}>

        {orderedRoutes.map((route) => {
          const routeName = route.name as TabRouteName;
          const config = TAB_CONFIG[routeName];
          const isFocused = activeRoute.key === route.key;
          const label = t(config.labelKey);
          const badgeCount = getBadgeCount(routeName);

          return (
            <TabButton
              key={route.key}
              routeName={routeName}
              isFocused={isFocused}
              label={label}
              badgeCount={badgeCount}
              onPress={() => handleTabPress(route.key, route.name, isFocused, config.analyticsId)}
            />
          );
        })}
      </View>
    </View>
  );
}

export function CustomerTabs() {
  const { colors } = useTheme();
  const authStatus = useAppSelector(selectAuthStatus);
  const isGuest = authStatus === 'guest';

  return (
    <>
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
        <Tab.Screen name={TAB_ROUTES.CATEGORIES_TAB} component={CategoriesScreen} />
        <Tab.Screen
          name={TAB_ROUTES.ORDERS_TAB}
          component={isGuest ? GuestLoginPromptScreen : OrdersStack}
        />
        <Tab.Screen
          name={TAB_ROUTES.PROFILE_TAB}
          component={isGuest ? GuestProfileScreen : ProfileStack}
        />
      </Tab.Navigator>

      <GlobalCartToast />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: space.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#1A1A1A',
    height: 62,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TAB_METRICS.minTabHeight,
    gap: 1,
  },
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    end: -9,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 10,
  },
  activeLabel: {
    marginTop: 1,
    fontSize: 11,
    color: '#1DB954',
    fontWeight: '600',
    textAlign: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
    backgroundColor: '#1DB954',
  },
});