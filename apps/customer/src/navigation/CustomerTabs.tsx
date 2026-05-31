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
  LIKED_ROUTES,
  ORDER_ROUTES,
  PROFILE_ROUTES,
} from './routes';

import type { CustomerTabParamList } from './types';

import { HomeStack } from './stacks/HomeStack';
import { OrdersStack } from './stacks/OrdersStack';
import { ProfileStack } from './stacks/ProfileStack';
import { LikedStack } from './stacks/LikedStack';
import { CartModal } from './placeholders';

import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<CustomerTabParamList>();

const TAB_CONFIG = {
  [TAB_ROUTES.HOME_TAB]: {
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
    label: 'mainTabs.home',
  },

  [TAB_ROUTES.BASKET_TAB]: {
    activeIcon: 'basket',
    inactiveIcon: 'basket-outline',
    label: 'mainTabs.basket',
  },

  [TAB_ROUTES.ORDERS_TAB]: {
    activeIcon: 'clipboard-text',
    inactiveIcon: 'clipboard-text-outline',
    label: 'mainTabs.orders',
  },

  [TAB_ROUTES.LIKED_TAB]: {
    activeIcon: 'heart',
    inactiveIcon: 'heart-outline',
    label: 'mainTabs.liked',
  },

  [TAB_ROUTES.PROFILE_TAB]: {
    activeIcon: 'account-circle',
    inactiveIcon: 'account-circle-outline',
    label: 'mainTabs.profile',
  },
} as const;

const TAB_BAR_VISIBLE_ROUTES: string[] = [
  HOME_ROUTES.HOME,
  TAB_ROUTES.BASKET_TAB,
  ORDER_ROUTES.ORDERS_LIST,
  LIKED_ROUTES.LIKED,
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

            if (!event.defaultPrevented) {
              if (route.name === TAB_ROUTES.ORDERS_TAB) {
                navigation.navigate(TAB_ROUTES.ORDERS_TAB, {
                  screen: ORDER_ROUTES.ORDERS_LIST,
                });
                return;
              }

              if (route.name === TAB_ROUTES.HOME_TAB) {
                navigation.navigate(TAB_ROUTES.HOME_TAB, {
                  screen: HOME_ROUTES.HOME,
                });
                return;
              }

              if (!isFocused) {
                navigation.navigate(route.name);
              }
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

                {isFocused ? (
                  <Text
                    style={[
                      styles.label,
                      {
                        color,
                        fontWeight: '800',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {t(config.label)}
                  </Text>
                ) : null}
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
      <Tab.Screen
        name={TAB_ROUTES.HOME_TAB}
        component={HomeStack}
      />

      <Tab.Screen
        name={TAB_ROUTES.BASKET_TAB}
        component={CartModal}
      />

      <Tab.Screen
        name={TAB_ROUTES.ORDERS_TAB}
        component={OrdersStack}
      />

      <Tab.Screen
        name={TAB_ROUTES.LIKED_TAB}
        component={LikedStack}
      />

      <Tab.Screen
        name={TAB_ROUTES.PROFILE_TAB}
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 10 : 6,
    paddingTop: 2,

    backgroundColor: 'transparent',
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    alignSelf: 'center',

    width: '94%',

    borderRadius: 10,

    borderWidth: 1,

    paddingHorizontal: 8,
    paddingVertical: 6,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 0 },

    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 6,
  },

  tabButton: {
    flex: 1,
  },

  activeContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 999,

    paddingVertical: 4,
    paddingHorizontal: 4,

    minHeight: 46,
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
