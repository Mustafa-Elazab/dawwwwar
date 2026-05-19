import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';

import {
  TAB_ROUTES,
  HOME_ROUTES,
  ORDER_ROUTES,
  PROFILE_ROUTES,
} from './routes';

import type { CustomerTabParamList } from './types';

import { HomeStack } from './stacks/HomeStack';
import { OrdersStack } from './stacks/OrdersStack';
import { ProfileStack } from './stacks/ProfileStack';
import { CategoriesScreen } from './placeholders';
import { GuestProfileScreen } from '../features/profile/screens/GuestProfileScreen';
import { GuestLoginPromptScreen } from '../features/orders/screens/GuestLoginPromptScreen';

import { GlobalCartToast } from '../features/cart/components/GlobalCartToast';
import { useAppSelector } from '../store/hooks';
import { selectAuthStatus } from '../store/slices/auth.slice';

import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<CustomerTabParamList>();

const TAB_CONFIG = {
  [TAB_ROUTES.HOME_TAB]: {
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
    label: 'mainTabs.home',
  },

  [TAB_ROUTES.CATEGORIES_TAB]: {
    activeIcon: 'shape',
    inactiveIcon: 'shape-outline',
    label: 'mainTabs.categories',
  },

  [TAB_ROUTES.ORDERS_TAB]: {
    activeIcon: 'clipboard-text',
    inactiveIcon: 'clipboard-text-outline',
    label: 'mainTabs.orders',
  },

  [TAB_ROUTES.PROFILE_TAB]: {
    activeIcon: 'account-circle',
    inactiveIcon: 'account-circle-outline',
    label: 'mainTabs.profile',
  },
} as const;

const TAB_BAR_VISIBLE_ROUTES: string[] = [
  HOME_ROUTES.HOME,
  TAB_ROUTES.CATEGORIES_TAB,
  ORDER_ROUTES.ORDERS_LIST,
  PROFILE_ROUTES.PROFILE,
];

const getTabBarVisibility = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  
  // If we are at the root of the tab stack (routeName is empty), show it
  if (!routeName) return true;

  return TAB_BAR_VISIBLE_ROUTES.includes(routeName);
};

function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Check if current focused route should hide the tab bar
  const activeRoute = state.routes[state.index];
  const isVisible = getTabBarVisibility(activeRoute);

  if (!isVisible) return null;

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const config =
            TAB_CONFIG[
              route.name as keyof typeof TAB_CONFIG
            ];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused
            ? colors.primary
            : colors.textSecondary;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
            >
              <View
  style={[
    styles.activeContainer,
    {
      backgroundColor: isFocused
        ? `${colors.primary}12`
        : 'transparent',

      borderWidth: isFocused ? 1 : 0,

      borderColor: isFocused
        ? `${colors.primary}20`
        : 'transparent',
    },
  ]}
>
                <View style={styles.iconContainer}>
                  <Icon
                    name={
                      isFocused
                        ? config.activeIcon
                        : config.inactiveIcon
                    }
                    size={24}
                    color={color}
                  />

                 
                </View>

                <Text
                  style={[
                    styles.label,
                    {
                      color,
                      fontWeight: isFocused ? '800' : '600',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {t(config.label)}
                </Text>
              </View>
            </Pressable>
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
        <Tab.Screen
          name={TAB_ROUTES.HOME_TAB}
          component={HomeStack}
        />

        <Tab.Screen
          name={TAB_ROUTES.CATEGORIES_TAB}
          component={CategoriesScreen}
        />

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
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 10 : 6,
    paddingTop: 2,

    backgroundColor: 'transparent',
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    alignSelf: 'center',

    width: '92%', // smaller width

    borderRadius: 22,

    borderWidth: 1,

    paddingHorizontal: 6,
    paddingVertical: 4, // smaller height

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: -2,
    },

    shadowOpacity: 0.04,
    shadowRadius: 10,

    elevation: 6,
  },

  tabButton: {
    flex: 1,
  },

  activeContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 14,

    paddingVertical: 5, // reduced
    paddingHorizontal: 4,

    minHeight: 44, // smaller
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    marginTop: 2,

    fontSize: 10,

    textAlign: 'center',
  },
});