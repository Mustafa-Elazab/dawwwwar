import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useAppSelector } from '../../../../store/hooks';
import { selectCartCount, selectCartTotal } from '../../../../store/slices/cart.slice';
import { Text, Icon, AnimatedPressable } from '@dawwar/ui';
import { useTheme, space, radius, shadows, springs, layout } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { MODAL_ROUTES } from '../../../../navigation/routes';
import type { RootParamList } from '../../../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';

const HIDE_ON_SCREENS = [
  MODAL_ROUTES.CART,
  MODAL_ROUTES.CHECKOUT,
  MODAL_ROUTES.CUSTOM_ORDER,
  'CheckoutScreen',
  'TrackingScreen',
  'OrderDetailScreen',
];

type NestedRoute = {
  name: string;
  state?: {
    routes: NestedRoute[];
    index: number;
  };
};

export function GlobalCartToast() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);
  const prevCount = React.useRef(count);

  const badgeScale = useSharedValue(1);

  useEffect(() => {
    if (count !== prevCount.current && count > 0) {
      badgeScale.value = withSpring(1.2, springs.stiff);
      setTimeout(() => {
        badgeScale.value = withSpring(1, springs.bouncy);
      }, 100);
    }
    prevCount.current = count;
  }, [count, badgeScale]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const currentRoute = useNavigationState((state) => {
    if (!state) return null;
    let current = state.routes[state.index] as NestedRoute;
    while (current.state?.routes?.length) {
      current = current.state.routes[current.state.index];
    }
    return current.name;
  });

  const isVisible = count > 0 && !!currentRoute && !HIDE_ON_SCREENS.includes(currentRoute);

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18).stiffness(120)}
      exiting={SlideOutDown.springify().damping(20)}
      style={styles.container}
    >
      <AnimatedPressable
        style={[styles.toast, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate(MODAL_ROUTES.CART)}
        pressScale={0.97}
      >
        <View style={styles.left}>
          <Animated.View style={[styles.badge, badgeStyle]}>
            <Text style={styles.badgeText}>{count}</Text>
          </Animated.View>
          <Text style={styles.totalText}>{total} {t('common.egp')}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.actionText}>{t('cart.view_cart')}</Text>
          <Icon name="chevron-right" size={18} color="#fff" />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: layout.screenPaddingH,
    right: layout.screenPaddingH,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.md,
    paddingHorizontal: space.base,
    borderRadius: radius.xl,
    ...shadows.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.md,
    minWidth: 26,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  totalText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
