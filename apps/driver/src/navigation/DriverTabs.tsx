import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { TAB_ROUTES, DRIVER_ROUTES } from './routes';
import type { DriverTabParamList, OrdersStackParamList } from './types';
import {
  AvailableOrdersScreen,
  OrdersHistoryScreen,
  ActiveDeliveryScreen,
  EarningsScreen,
  DriverProfileScreen,
} from './placeholders';
import { useAppSelector } from '../store/hooks';
import { selectActiveOrderId, selectIsOnline } from '../store/slices/driver.slice';

const Tab = createBottomTabNavigator<DriverTabParamList>();
const OrdersStack = createStackNavigator<OrdersStackParamList>();

function OrdersStackNav() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name={DRIVER_ROUTES.ORDERS} component={OrdersHistoryScreen} />
    </OrdersStack.Navigator>
  );
}

export function DriverTabs() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const activeOrderId = useAppSelector(selectActiveOrderId);
  const isOnline = useAppSelector(selectIsOnline);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={TAB_ROUTES.AVAILABLE_ORDERS_TAB}
        component={AvailableOrdersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <View style={{ position: 'relative' }}>
                <Icon
                  name={focused ? 'bell' : 'bell-outline'}
                  size={24}
                  color={focused ? colors.primary : colors.tabBarIcon}
                />
                {isOnline && (
                  <View style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: colors.success,
                  }} />
                )}
              </View>
              <Text variant="caption" color={focused ? colors.primary : colors.tabBarIcon}>
                {t('driver.tabs.orders', 'Orders')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.ACTIVE_DELIVERY_TAB}
        component={activeOrderId ? ActiveDeliveryScreen : AvailableOrdersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Icon
                name={focused ? 'motorbike' : 'motorbike'}
                size={24}
                color={activeOrderId ? colors.primary : colors.tabBarIcon}
              />
              {activeOrderId && (
                <View style={{
                  position: 'absolute', top: -2, right: -4,
                  paddingHorizontal: 4, paddingVertical: 1,
                  backgroundColor: colors.primary, borderRadius: 8,
                }}>
                  <Text variant="overline" color="#fff">{t('driver.tabs.live', 'LIVE')}</Text>
                </View>
              )}
              <Text variant="caption" color={activeOrderId ? colors.primary : colors.tabBarIcon}>
                {t('driver.tabs.delivery', 'Delivery')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.ORDERS_TAB}
        component={OrdersStackNav}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Icon name={focused ? 'history' : 'history'} size={24} color={focused ? colors.primary : colors.tabBarIcon} />
              <Text variant="caption" color={focused ? colors.primary : colors.tabBarIcon}>
                {t('driver.tabs.history', 'History')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.EARNINGS_TAB}
        component={EarningsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Icon name={focused ? 'wallet' : 'wallet-outline'} size={24} color={focused ? colors.primary : colors.tabBarIcon} />
              <Text variant="caption" color={focused ? colors.primary : colors.tabBarIcon}>{t('driver.tabs.earnings', 'Earnings')}</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PROFILE_TAB}
        component={DriverProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Icon name={focused ? 'account' : 'account-outline'} size={24} color={focused ? colors.primary : colors.tabBarIcon} />
              <Text variant="caption" color={focused ? colors.primary : colors.tabBarIcon}>{t('driver.tabs.profile', 'Profile')}</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
