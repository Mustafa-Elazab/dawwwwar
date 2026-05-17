import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { TAB_ROUTES } from './routes';
import { useAppSelector } from '../store/hooks';
import { selectNewOrderCount } from '../store/slices/merchant.slice';
import { MerchantOrdersScreen } from '../features/orders/screens/MerchantOrdersScreen';
import { ProductsScreen } from '../features/products/screens/ProductsScreen';
import { AddEditProductScreen } from '../features/products/screens/AddEditProductScreen';
import { AnalyticsScreen } from '../features/analytics/screens/AnalyticsScreen';
import { MerchantProfileScreen } from '../features/profile/screens/MerchantProfileScreen';
import { MERCHANT_ROUTES } from './routes';
import { createStackNavigator } from '@react-navigation/stack';

const ProductsStack = createStackNavigator();
function ProductsStackNav() {
  return (
    <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductsStack.Screen name={MERCHANT_ROUTES.PRODUCTS} component={ProductsScreen} />
      <ProductsStack.Screen name={MERCHANT_ROUTES.ADD_EDIT_PRODUCT} component={AddEditProductScreen} />
    </ProductsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

// ─── Icon components — memoized, defined OUTSIDE the navigator ────────────────
const OrdersIcon = React.memo(({ focused, color, size, badgeCount }: { focused: boolean; color: string; size: number; badgeCount: number }) => (
  <View>
    <Icon name={focused ? 'clipboard-list' : 'clipboard-list-outline'} size={size} color={color} />
    {badgeCount > 0 && (
      <View style={{ position: 'absolute', top: -4, right: -8, backgroundColor: '#FF3B30', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
        <Text variant="overline" color="#fff" style={{ fontSize: 10, fontWeight: '700' }}>{String(badgeCount)}</Text>
      </View>
    )}
  </View>
));

const ProductsIcon = React.memo(({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
  <Icon name={focused ? 'tag' : 'tag-outline'} size={size} color={color} />
));

const AnalyticsIcon = React.memo(({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
  <Icon name={focused ? 'chart-bar' : 'chart-bar'} size={size} color={color} />
));

const ProfileIcon = React.memo(({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
  <Icon name={focused ? 'store' : 'store-outline'} size={size} color={color} />
));

export function MerchantTabs() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const newOrderCount = useAppSelector(selectNewOrderCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: colors.surface, 
          borderTopColor: colors.border, 
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
        name={TAB_ROUTES.ORDERS_TAB}
        component={MerchantOrdersScreen}
        options={{
          tabBarLabel: t('merchant.tabs.orders', 'Orders'),
          tabBarIcon: ({ focused, color, size }) => (
            <OrdersIcon focused={focused} color={color} size={size} badgeCount={newOrderCount} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PRODUCTS_TAB}
        component={ProductsStackNav}
        options={{
          tabBarLabel: t('merchant.tabs.products', 'Products'),
          tabBarIcon: ({ focused, color, size }) => (
            <ProductsIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.ANALYTICS_TAB}
        component={AnalyticsScreen}
        options={{
          tabBarLabel: t('merchant.tabs.analytics', 'Analytics'),
          tabBarIcon: ({ focused, color, size }) => (
            <AnalyticsIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PROFILE_TAB}
        component={MerchantProfileScreen}
        options={{
          tabBarLabel: t('merchant.tabs.profile', 'Profile'),
          tabBarIcon: ({ focused, color, size }) => (
            <ProfileIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
