import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useAppSelector } from '../../../../store/hooks';
import { selectCartCount, selectCartTotal } from '../../../../store/slices/cart.slice';
import { Text } from '@dawwar/ui';
import { useTheme, space, radius, shadows } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { MODAL_ROUTES, TAB_ROUTES } from '../../../../navigation/routes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Screens where the cart toast should be HIDDEN
const HIDE_ON_SCREENS = [
  TAB_ROUTES.BASKET_TAB,
  MODAL_ROUTES.CHECKOUT,
  MODAL_ROUTES.CUSTOM_ORDER,
  'CheckoutScreen',
  'TrackingScreen',
  'OrderDetailScreen',
];

export function GlobalCartToast() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);

  const currentRoute = useNavigationState((state) => {
    if (!state) return null;
    let current = state.routes[state.index];
    while (current.state) {
      const nestedState = current.state as any;
      current = nestedState.routes[nestedState.index];
    }
    return current.name;
  });

  const isVisible = count > 0 && !HIDE_ON_SCREENS.includes(currentRoute as any);

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.toast, { backgroundColor: colors.primary }]} 
        onPress={() => navigation.navigate('CustomerTabs', { screen: TAB_ROUTES.BASKET_TAB })}
        activeOpacity={0.9}
      >
        <View style={styles.left}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
          <Text style={styles.totalText}>{total} {t('common.egp')}</Text>
        </View>
        <Text style={styles.actionText}>{t('cart.view_cart', 'عرض السلة')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Above tab bar
    left: space.base,
    right: space.base,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: space.md,
    borderRadius: radius.lg,
    ...shadows.lg,
    elevation: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  totalText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  actionText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
});
