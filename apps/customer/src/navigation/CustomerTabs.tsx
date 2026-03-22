import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { TAB_ROUTES } from './routes';
import type { CustomerTabParamList } from './types';
import { HomeStack } from './stacks/HomeStack';
import { OrdersStack } from './stacks/OrdersStack';
import { WalletStack } from './stacks/WalletStack';
import { ProfileStack } from './stacks/ProfileStack';
import { CategoriesScreen } from './placeholders';
import { useAppSelector } from '../store/hooks';
import { selectCartCount } from '../store/slices/cart.slice';

const Tab = createBottomTabNavigator<CustomerTabParamList>();

interface TabIconProps {
  focused: boolean;
  icon: string;
  label: string;
  badge?: number;
}

function TabIcon({ focused, icon, label, badge }: TabIconProps) {
  const { colors } = useTheme();
  const color = focused ? colors.tabBarIconActive : colors.tabBarIcon;

  return (
    <View style={styles.tabItem}>
      <View>
        <Icon name={focused ? icon : `${icon}-outline`} size={24} color={color} />
        {badge != null && badge > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text variant="overline" color="#fff">
              {badge > 99 ? '99+' : String(badge)}
            </Text>
          </View>
        )}
      </View>
      <Text variant="caption" color={color}>{label}</Text>
    </View>
  );
}

export function CustomerTabs() {
  const { colors } = useTheme();
  const cartCount = useAppSelector(selectCartCount);

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
        name={TAB_ROUTES.HOME_TAB}
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="home" label="Home" />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.CATEGORIES_TAB}
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="grid" label="Categories" />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.ORDERS_TAB}
        component={OrdersStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="clipboard-list" label="Orders" badge={cartCount} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.WALLET_TAB}
        component={WalletStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="wallet" label="Wallet" />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PROFILE_TAB}
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="account" label="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', gap: 2, paddingTop: 4 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
});
