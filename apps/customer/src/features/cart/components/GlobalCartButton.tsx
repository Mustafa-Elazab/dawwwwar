import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../store/hooks';
import { selectCartCount, selectCartTotal } from '../../../store/slices/cart.slice';
import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { MODAL_ROUTES } from '../../../navigation/routes';

export function GlobalCartButton() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);

  if (cartCount === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate(MODAL_ROUTES.CART)}
      >
        <View style={styles.left}>
          <View style={[styles.badge, { backgroundColor: colors.surface }]}>
            <Text variant="caption" style={{ color: colors.primary, fontWeight: '700' }}>
              {cartCount}
            </Text>
          </View>
          <Text variant="body1" style={{ color: '#fff', fontWeight: '600' }}>
            View Cart
          </Text>
        </View>
        <Text variant="body1" style={{ color: '#fff', fontWeight: '700' }}>
          {cartTotal.toFixed(2)} EGP
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70, // Above the tab bar (60 + 10 margin)
    left: 16,
    right: 16,
    zIndex: 999,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
