import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { TAB_ROUTES } from './routes';
import { useAppSelector } from '../store/hooks';
import { selectNewOrderCount } from '../store/slices/merchant.slice';
import {
  MerchantOrdersScreen,
  ProductsScreen,
  AddEditProductScreen,
  AnalyticsScreen,
  MerchantProfileScreen,
} from './placeholders';
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

export function MerchantTabs() {
  const { colors } = useTheme();
  const newOrderCount = useAppSelector(selectNewOrderCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.tabBar, borderTopColor: colors.tabBarBorder, height: 60, paddingBottom: 8 },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={TAB_ROUTES.ORDERS_TAB}
        component={MerchantOrdersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <View>
                <Icon name={focused ? 'clipboard-list' : 'clipboard-list-outline'} size={24} color={focused ? colors.primary : colors.tabBarIcon} />
                {newOrderCount > 0 && (
                  <View style={{ position: 'absolute', top: -4, right: -8, backgroundColor: colors.error, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
                    <Text variant="overline" color="#fff">{String(newOrderCount)}</Text>
                  </View>
                )}
              </View>
              <Text variant="caption" color={focused ? colors.primary : colors.tabBarIcon}>Orders</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PRODUCTS_TAB}
        component={ProductsStackNav}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Icon name={focused ? 'tag' : 'tag-outline'} size={24} color={focused ? colors.primary : colors.tabBarIcon} />
              <Text variant="caption" color={focused ? colors.primary : colors.tabBarIcon}>Products</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.ANALYTICS_TAB}
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Icon name={focused ? 'chart-bar' : 'chart-bar'} size={24} color={focused ? colors.primary : colors.tabBarIcon} />
              <Text variant="caption" color={focused ? colors.primary : colors.tabBarIcon}>Analytics</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PROFILE_TAB}
        component={MerchantProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Icon name={focused ? 'store' : 'store-outline'} size={24} color={focused ? colors.primary : colors.tabBarIcon} />
              <Text variant="caption" color={focused ? colors.primary : colors.tabBarIcon}>Profile</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
