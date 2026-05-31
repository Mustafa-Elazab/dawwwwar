import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { ORDER_ROUTES, WALLET_ROUTES } from '../../../../navigation/routes';

type NotificationType = 'order' | 'promo' | 'system' | 'wallet' | 'chat';

interface AppNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  type: NotificationType;
  payload?: {
    orderId?: string;
    url?: string;
  };
}

export interface NotificationListItem {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  relativeTime: string;
  iconName: string;
  iconColor: string;
}

const DUMMY_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'Order Delivered',
    body: 'Your order #ORD-123 from KFC has been delivered successfully. Enjoy your meal!',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: 'order',
    payload: { orderId: 'ORD-123' },
  },
  {
    id: '2',
    title: '50% OFF Weekend Sale',
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

export function useController() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  const getIcon = useCallback(
    (type: NotificationType) => {
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
    },
    [colors.info, colors.primary, colors.success, colors.textSecondary, colors.warning],
  );

  const getText = useCallback(
    (item: AppNotification) => {
      if (item.type === 'order') {
        return {
          title: t('notifications.order_delivered'),
          body: t('notifications.order_delivered_body', {
            orderId: item.payload?.orderId?.replace('ORD-', '') || '123',
            merchant: item.body.includes('KFC') ? 'KFC' : t('notifications.store'),
          }),
        };
      }

      if (item.type === 'promo') {
        return {
          title: t('notifications.weekend_sale'),
          body: item.body,
        };
      }

      if (item.type === 'wallet') {
        return {
          title: t('notifications.wallet_recharged'),
          body: t('notifications.wallet_recharged_body', { amount: 200 }),
        };
      }

      return {
        title: item.title,
        body: item.body,
      };
    },
    [t],
  );

  const items = useMemo(
    () => notifications.map((item) => {
      const icon = getIcon(item.type);
      const text = getText(item);

      return {
        id: item.id,
        title: text.title,
        body: text.body,
        isRead: item.isRead,
        relativeTime: formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }),
        iconName: icon.name,
        iconColor: icon.color,
      };
    }),
    [getIcon, getText, notifications],
  );

  const handleNotificationPress = useCallback(
    (id: string) => {
      const item = notifications.find((notification) => notification.id === id);
      if (!item) return;

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === item.id ? { ...notification, isRead: true } : notification,
        ),
      );

      if (item.type === 'order' && item.payload?.orderId) {
        navigation.navigate(ORDER_ROUTES.TRACKING, { orderId: item.payload.orderId });
      } else if (item.type === 'wallet') {
        navigation.navigate(WALLET_ROUTES.WALLET);
      }
    },
    [navigation, notifications],
  );

  return {
    colors,
    items,
    isRefreshing,
    headerTitle: t('profile.notifications'),
    emptyState: {
      icon: 'bell-off-outline',
      title: t('notifications.empty'),
      subtitle: t('notifications.empty_subtitle'),
      action: {
        label: t('notifications.explore_deals'),
        onPress: () => navigation.goBack(),
      },
    },
    handlers: {
      handleRefresh,
      handleNotificationPress,
    },
  };
}
