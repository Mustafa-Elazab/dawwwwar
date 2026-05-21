import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Icon, EmptyState } from '@dawwar/ui';
import { useTheme, space } from '@dawwar/theme';
import { formatDistanceToNow } from 'date-fns';
import { ORDER_ROUTES, WALLET_ROUTES } from '../../../navigation/routes';

interface AppNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  type: 'order' | 'promo' | 'system' | 'wallet' | 'chat';
  payload?: {
    orderId?: string;
    url?: string;
  };
}

const DUMMY_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'Order Delivered! 🎉',
    body: 'Your order #ORD-123 from KFC has been delivered successfully. Enjoy your meal!',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: 'order',
    payload: { orderId: 'ORD-123' },
  },
  {
    id: '2',
    title: '50% OFF Weekend Sale 🍔',
    body: 'Get 50% off on all burger joints this weekend. Apply code BURGER50 at checkout.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'promo',
  },
  {
    id: '3',
    title: 'Wallet Recharged',
    body: 'Your wallet has been successfully recharged with 200 EGP.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: 'wallet',
  },
];

export function NotificationsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>(); // Generic for cross-stack routing

  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate fetch
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  const handleNotificationPress = useCallback(
    (item: AppNotification) => {
      // 1. Optimistic mark as read
      setNotifications(prev => prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n)));

      // 2. Payload-based navigation
      try {
        if (item.type === 'order' && item.payload?.orderId) {
          // We must navigate to the Orders Stack, then the Tracking screen
          // In a real app, nested cross-stack navigation is handled by the RootNavigator mapping
          navigation.navigate(ORDER_ROUTES.TRACKING, { orderId: item.payload.orderId });
        } else if (item.type === 'wallet') {
          navigation.navigate(WALLET_ROUTES.WALLET);
        } else if (item.type === 'chat' && item.payload?.orderId) {
          // Example: navigation.navigate('ChatScreen', { orderId: item.payload.orderId });
        }
      } catch (err) {
        console.warn('Navigation failed for notification', item, err);
      }
    },
    [navigation],
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return { name: 'moped', color: colors.primary };
      case 'promo':
        return { name: 'ticket-percent', color: colors.warning };
      case 'wallet':
        return { name: 'wallet', color: colors.success };
      case 'chat':
        return { name: 'chat-processing', color: colors.info };
      default:
        return { name: 'bell-outline', color: colors.textSecondary };
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const iconData = getIcon(item.type);

    // Attempt local translation if type matches our predefined keys
    let displayTitle = item.title;
    let displayBody = item.body;

    if (item.type === 'order') {
      const merchantFromBody = item.body.includes('KFC') ? 'KFC' : '';
      displayTitle = t('notifications.order_delivered');
      displayBody = t('notifications.order_delivered_body', {
        orderId: item.payload?.orderId?.replace('ORD-', '') || '123',
        merchant: merchantFromBody,
      });
    } else if (item.type === 'promo') {
      displayTitle = t('notifications.weekend_sale');
    } else if (item.type === 'wallet') {
      displayTitle = t('notifications.wallet_recharged');
      displayBody = t('notifications.wallet_recharged_body', { amount: 200 });
    }

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          padding: space.base,
          backgroundColor: item.isRead ? colors.background : colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        }}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: `${iconData.color}15`,
            alignItems: 'center',
            justifyContent: 'center',
            marginEnd: space.md,
          }}
        >
          <Icon name={iconData.name} size={24} color={iconData.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 4,
              alignItems: 'center',
            }}
          >
            <Text
              variant="label"
              style={{
                color: colors.text,
                flex: 1,
                fontWeight: item.isRead ? '500' : '700',
                textAlign: 'auto',
              }}
            >
              {displayTitle}
            </Text>
            {!item.isRead && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                  marginStart: 8,
                }}
              />
            )}
          </View>
          <Text
            variant="body2"
            style={{
              color: colors.textSecondary,
              marginBottom: 8,
              lineHeight: 20,
              textAlign: 'auto',
            }}
          >
            {displayBody}
          </Text>
          <Text variant="caption" style={{ color: colors.textDisabled, textAlign: 'left' }}>
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenTemplate headerProps={{ title: t('profile.notifications') || 'Notifications' }}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={notifications.length === 0 ? { flex: 1 } : { flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title="No notifications yet"
            subtitle="When you get orders, promos, or updates, they will appear here."
            action={{
              label: 'Explore Deals',
              onPress: () => navigation.goBack(),
              variant: 'outline',
            }}
          />
        }
      />
    </ScreenTemplate>
  );
}
