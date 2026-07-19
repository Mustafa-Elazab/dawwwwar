import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@dawwar/theme';
import { Icon } from '../../../../packages/ui/src/atoms/Icon';
import { Text } from '../../../../packages/ui/src/atoms/Text';
import { useTranslation } from '@dawwar/i18n';
import { TAB_ROUTES, DRIVER_ROUTES } from './routes';
import type { DriverTabParamList, OrdersStackParamList } from './types';
import { useAppSelector } from '../store/hooks';
import { selectActiveOrderId, selectIsOnline } from '../store/slices/driver.slice';

const Tab = createBottomTabNavigator<DriverTabParamList>();
const OrdersStack = createStackNavigator<OrdersStackParamList>();

type ScreenComponent = React.ComponentType<any>;
type ScreenModule = Record<string, ScreenComponent | undefined> | undefined;

const createScreenLoader = (
  load: () => ScreenModule,
  exportName: string,
): ScreenComponent => {
  const LoadedScreen = (props: Record<string, unknown>) => {
    const Screen = React.useMemo(() => {
      const mod = load();
      return mod?.[exportName] ?? mod?.default;
    }, []);

    if (!Screen) {
      console.error(`[DriverTabs] Unable to load ${exportName}`);
      return null;
    }

    return <Screen {...props} />;
  };

  LoadedScreen.displayName = exportName;
  return LoadedScreen;
};

const AvailableOrdersTabScreen = createScreenLoader(
  () => require('../features/available-orders/screens/AvailableOrdersScreen'),
  'AvailableOrdersScreen',
);
const ActiveDeliveryTabScreen = createScreenLoader(
  () => require('../features/active-delivery/screens/ActiveDeliveryScreen'),
  'ActiveDeliveryScreen',
);
const OrdersHistoryStackScreen = createScreenLoader(
  () => require('../features/orders/screens/OrdersHistoryScreen'),
  'OrdersHistoryScreen',
);
const EarningsTabScreen = createScreenLoader(
  () => require('../features/earnings/screens/EarningsScreen'),
  'EarningsScreen',
);
const DriverProfileTabScreen = createScreenLoader(
  () => require('../features/profile/screens/DriverProfileScreen'),
  'DriverProfileScreen',
);

function OrdersStackNav() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name={DRIVER_ROUTES.ORDERS} component={OrdersHistoryStackScreen} />
    </OrdersStack.Navigator>
  );
}

// ─── Icon components — memoized, defined OUTSIDE the navigator ────────────────
const HomeIcon = React.memo(({ focused, color, size, isOnline }: { focused: boolean; color: string; size: number; isOnline: boolean }) => (
  <View style={{ position: 'relative' }}>
    <Icon
      name={focused ? 'bell' : 'bell-outline'}
      size={size}
      color={color}
    />
    {isOnline && (
      <View style={{
        position: 'absolute', top: -2, right: -2,
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: '#1DB954',
      }} />
    )}
  </View>
));

const DeliveryIcon = React.memo(({ focused, color, size, hasActive }: { focused: boolean; color: string; size: number; hasActive: boolean }) => (
  <View style={{ position: 'relative' }}>
    <Icon
      name={focused ? 'motorbike' : 'motorbike'}
      size={size}
      color={hasActive ? color : '#9CA3AF'}
    />
    {hasActive && (
      <View style={{
        position: 'absolute', top: -2, right: -4,
        paddingHorizontal: 4, paddingVertical: 1,
        backgroundColor: '#1DB954', borderRadius: 8,
      }}>
        <Text variant="overline" color="#fff" style={{ fontSize: 8 }}>LIVE</Text>
      </View>
    )}
  </View>
));

const HistoryIcon = React.memo(({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
  <Icon name="history" size={size} color={color} />
));

const WalletIcon = React.memo(({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
  <Icon name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />
));

const ProfileIcon = React.memo(({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
  <Icon name={focused ? 'account' : 'account-outline'} size={size} color={color} />
));

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
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name={TAB_ROUTES.AVAILABLE_ORDERS_TAB}
        component={AvailableOrdersTabScreen}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ focused, color, size }) => (
            <HomeIcon focused={focused} color={color} size={size} isOnline={isOnline} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.ACTIVE_DELIVERY_TAB}
        component={activeOrderId ? ActiveDeliveryTabScreen : AvailableOrdersTabScreen}
        options={{
          tabBarLabel: t('driver.tabs.delivery', 'Delivery'),
          tabBarIcon: ({ focused, color, size }) => (
            <DeliveryIcon focused={focused} color={color} size={size} hasActive={!!activeOrderId} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.ORDERS_TAB}
        component={OrdersStackNav}
        options={{
          tabBarLabel: t('tabs.history'),
          tabBarIcon: ({ focused, color, size }) => (
            <HistoryIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.EARNINGS_TAB}
        component={EarningsTabScreen}
        options={{
          tabBarLabel: t('driver.tabs.earnings', 'Earnings'),
          tabBarIcon: ({ focused, color, size }) => (
            <WalletIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PROFILE_TAB}
        component={DriverProfileTabScreen}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ focused, color, size }) => (
            <ProfileIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
