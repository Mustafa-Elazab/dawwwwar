import React, { useCallback } from 'react';
import {
  Modal, View, StyleSheet, Pressable, TouchableOpacity, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { Text, Icon, Button } from '@dawwar/ui';
import { useAppSelector } from '../../store/hooks';
import { selectCartCount as selectCartItemCount, selectCartTotal } from '../../store/slices/cart.slice';
import { AUTH_ROUTES } from '../../navigation/routes';

const { height } = Dimensions.get('window');

export type LoginGateReason = 'checkout' | 'orders' | 'wallet' | 'address';

interface LoginGateModalProps {
  visible: boolean;
  onClose: () => void;
  reason: LoginGateReason;
}

const RETURN_DESTINATIONS: Record<LoginGateReason, string> = {
  checkout: 'CheckoutModal',
  orders: 'OrdersList', // Adjust according to actual route name
  wallet: 'WalletScreen', // Adjust according to actual route name
  address: 'AddressesScreen', // Adjust according to actual route name
};

export function LoginGateModal({ visible, onClose, reason }: LoginGateModalProps) {
  const { t } = useTranslation();
  const { colors, space, radius } = useTheme();
  const navigation = useNavigation<any>();
  const cartCount = useAppSelector(selectCartItemCount);
  const cartTotal = useAppSelector(selectCartTotal);

  const handleLogin = useCallback(() => {
    onClose();
    navigation.navigate('Auth', {
      screen: AUTH_ROUTES.PHONE, // Assuming LOGIN is the starting point
      params: { returnTo: RETURN_DESTINATIONS[reason] },
    });
  }, [onClose, navigation, reason]);

  const getReasonConfig = () => {
    switch (reason) {
      case 'checkout':
        return {
          title: t('gate.checkoutTitle'),
          subtitle: t('gate.checkoutSubtitle'),
          ctaText: t('gate.loginToOrder'),
          icon: 'shopping-cart',
        };
      case 'orders':
        return {
          title: t('gate.ordersTitle'),
          subtitle: t('gate.ordersSubtitle'),
          ctaText: t('gate.loginToViewOrders'),
          icon: 'list-alt',
        };
      case 'wallet':
        return {
          title: t('gate.walletTitle'),
          subtitle: t('gate.walletSubtitle'),
          ctaText: t('gate.loginToWallet'),
          icon: 'account-balance-wallet',
        };
      case 'address':
        return {
          title: t('gate.addressTitle'),
          subtitle: t('gate.addressSubtitle'),
          ctaText: t('gate.loginToAddress'),
          icon: 'location-on',
        };
    }
  };

  const config = getReasonConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.background, paddingBottom: space.xl + 20 }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={[styles.iconWrap, { backgroundColor: colors.primary + '15' }]}>
            <Icon name={config.icon} size={40} color={colors.primary} />
          </View>

          <Text style={styles.title}>{config.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{config.subtitle}</Text>

          {reason === 'checkout' && cartCount > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.cartBadgeText, { color: colors.primary }]}>
                🛒 {cartCount} {t('gate.itemsSaved')} · {cartTotal.toFixed(2)} {t('common.egp')}
              </Text>
            </View>
          )}

          <Button
            label={config.ctaText}
            onPress={handleLogin}
            variant="primary"
            style={styles.loginBtn}
          />

          <TouchableOpacity style={styles.dismissBtn} onPress={onClose}>
            <Text style={[styles.dismissText, { color: colors.textSecondary }]}>{t('gate.continueBrowsing')}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 24,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  cartBadge: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
  },
  cartBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginBtn: {
    width: '100%',
    marginBottom: 16,
  },
  dismissBtn: {
    paddingVertical: 12,
  },
  dismissText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
