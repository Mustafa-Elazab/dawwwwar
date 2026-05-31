import { useCallback, useMemo } from 'react';
import { I18nManager } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import type { AppColors } from '@dawwar/theme';
import { ACTIVE_ORDER_STATUSES, OrderStatus } from '@dawwar/types';
import { ORDER_ROUTES } from '../../../../navigation/routes';
import type { OrdersStackParamList } from '../../../../navigation/types';
import { useOrderDetail } from '../../core/hooks';

export interface OrderDetailItemView {
  id: string;
  image?: string;
  name: string;
  meta: string;
  price: string;
}

export interface OrderInfoBlockView {
  icon: string;
  title: string;
  value: string;
}

export interface OrderMoneyRowView {
  label: string;
  value: string;
  strong?: boolean;
}

export function useController() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const route = useRoute<RouteProp<OrdersStackParamList, typeof ORDER_ROUTES.ORDER_DETAIL>>();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList>>();
  const { data: order, isLoading, isError, refetch } = useOrderDetail(route.params.orderId);

  const isActive = order ? ACTIVE_ORDER_STATUSES.includes(order.status) : false;
  const canCancel = order
    ? order.status === OrderStatus.PENDING || order.status === OrderStatus.ACCEPTED
    : false;

  const status = useMemo(() => {
    if (!order) {
      return undefined;
    }

    return {
      label: t(`tracking.status.${order.status}`),
      color: getStatusColor(order.status, colors),
      backgroundColor: getStatusBackground(order.status, colors),
    };
  }, [colors, order, t]);

  const items = useMemo<OrderDetailItemView[]>(
    () => (order?.items ?? []).map((item: any) => {
      const itemImage = item.image || item.images?.[0];
      const name = i18n.language.startsWith('ar')
        ? item.productNameAr || item.productName
        : item.productName;

      return {
        id: item.id,
        image: itemImage,
        name,
        meta: `${item.quantity} x ${Number(item.price)} ${t('common.egp')}`,
        price: `${Number(item.price) * Number(item.quantity)} ${t('common.egp')}`,
      };
    }),
    [i18n.language, order?.items, t],
  );

  const infoBlocks = useMemo<OrderInfoBlockView[]>(
    () => order ? [
      {
        icon: 'map-marker',
        title: t('location.deliver_to'),
        value: order.deliveryAddress,
      },
      {
        icon: 'credit-card-outline',
        title: t('orders.payment_method', 'Payment method'),
        value: t(`payment_methods.${String(order.paymentMethod).toLowerCase()}`, order.paymentMethod),
      },
      {
        icon: 'ticket-percent-outline',
        title: t('orders.promotions', 'Promotions'),
        value: order.discount > 0
          ? `${order.discount} ${t('common.egp')}`
          : t('orders.no_promotions', 'No promotion'),
      },
    ] : [],
    [order, t],
  );

  const moneyRows = useMemo<OrderMoneyRowView[]>(
    () => order ? [
      { label: t('cart.subtotal'), value: `${Number(order.subtotal).toFixed(2)} ${t('common.egp')}` },
      { label: t('cart.delivery_fee'), value: `${Number(order.deliveryFee).toFixed(2)} ${t('common.egp')}` },
      { label: t('orders.discount', 'Discount'), value: `${(-Number(order.discount || 0)).toFixed(2)} ${t('common.egp')}` },
      { label: t('cart.total'), value: `${Number(order.total).toFixed(2)} ${t('common.egp')}`, strong: true },
    ] : [],
    [order, t],
  );

  const cancelReason = useMemo(() => {
    const reason = order?.events?.find((event) => event.status === OrderStatus.CANCELLED)?.metadata?.reason;
    return typeof reason === 'string' && reason.length > 0
      ? reason
      : t('orders.cancelled_order', 'Cancelled order');
  }, [order?.events, t]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleCancel = useCallback(() => {
    if (order) {
      navigation.navigate(ORDER_ROUTES.CANCEL_ORDER, { orderId: order.id });
    }
  }, [navigation, order]);

  const handleTrack = useCallback(() => {
    if (order) {
      navigation.navigate(ORDER_ROUTES.TRACKING, { orderId: order.id });
    }
  }, [navigation, order]);

  const handleReorder = useCallback(() => {
    navigation.navigate(ORDER_ROUTES.ORDERS_LIST);
  }, [navigation]);

  return {
    colors,
    isRTL,
    order,
    isLoading,
    isError,
    refetch,
    isActive,
    canCancel,
    status,
    items,
    infoBlocks,
    moneyRows,
    cancelReason,
    labels: {
      orderSummary: t('orders.order_summary', 'Order Summary'),
      cancelOrder: t('tracking.cancel_order'),
      track: t('orders.track'),
      reorder: t('orders.reorder'),
      cancelledReason: t('orders.cancelled_reason', 'Reason for Cancellation'),
    },
    handlers: {
      handleBack,
      handleCancel,
      handleTrack,
      handleReorder,
    },
  };
}

function getStatusColor(status: OrderStatus, colors: AppColors) {
  if ([OrderStatus.CANCELLED, OrderStatus.REJECTED].includes(status)) return colors.error;
  if ([OrderStatus.COMPLETED, OrderStatus.DELIVERED].includes(status)) return colors.success;
  return colors.primary;
}

function getStatusBackground(status: OrderStatus, colors: AppColors) {
  if ([OrderStatus.CANCELLED, OrderStatus.REJECTED].includes(status)) return colors.errorBg;
  if ([OrderStatus.COMPLETED, OrderStatus.DELIVERED].includes(status)) return colors.successBg;
  return colors.primaryLight;
}
