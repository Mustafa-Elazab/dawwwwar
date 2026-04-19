import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScrollScreenTemplate, Header, Text, Avatar, ListItem, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { logout, selectUser } from '../../../../store/slices/auth.slice';
import { setShopOpen, selectIsShopOpen } from '../../../../store/slices/merchant.slice';
import { mockMerchants } from '@dawwar/mocks';

export function MerchantProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isOpen = useAppSelector(selectIsShopOpen);
  const merchant = mockMerchants.find((m) => m.userId === user?.id);

  const handleToggleOpen = useCallback(() => {
    dispatch(setShopOpen(!isOpen));
  }, [isOpen, dispatch]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      t('profile.logout_confirm_title'),
      t('profile.logout_confirm_body'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout_confirm_btn'), style: 'destructive', onPress: () => dispatch(logout()) },
      ],
    );
  }, [dispatch, t]);

  return (
    <ScrollScreenTemplate edges={['top']}>
      <Header title={t('profile.title')} />

      {/* Merchant info */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Avatar name={merchant?.businessName} size="lg" />
        <View style={{ flex: 1 }}>
          <Text variant="h4" color={colors.text}>{merchant?.businessName}</Text>
          <Text variant="caption" color={colors.textSecondary}>{merchant?.category}</Text>
          <Text variant="caption" color={colors.textSecondary}>★ {merchant?.rating}</Text>
        </View>
      </View>

      {/* Open/Close toggle — most important element for merchant */}
      <TouchableOpacity
        style={[
          styles.openToggle,
          { backgroundColor: isOpen ? colors.successBg : colors.errorBg, borderColor: isOpen ? colors.success : colors.error },
        ]}
        onPress={handleToggleOpen}
        activeOpacity={0.85}
      >
        <View style={[styles.statusDot, { backgroundColor: isOpen ? colors.success : colors.error }]} />
        <View style={{ flex: 1 }}>
          <Text variant="label" color={isOpen ? colors.success : colors.error} style={{ fontWeight: '700' }}>
            {t(isOpen ? 'merchant_app.shop_open' : 'merchant_app.shop_closed')}
          </Text>
        </View>
        <Icon name={isOpen ? 'toggle-switch' : 'toggle-switch-off'} size={32} color={isOpen ? colors.success : colors.error} />
      </TouchableOpacity>

      {/* Settings rows */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <ListItem
          title={t('profile.language')}
          leftElement={<Icon name="translate" size={22} color={colors.primary} />}
          showChevron
        />
        <ListItem
          title={t('profile.appearance')}
          leftElement={<Icon name="theme-light-dark" size={22} color={colors.primary} />}
          showChevron
        />
        <ListItem
          title={t('profile.logout')}
          leftElement={<Icon name="logout" size={22} color={colors.error} />}
          onPress={handleLogout}
        />
      </View>
    </ScrollScreenTemplate>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: space.base, gap: space.md, marginBottom: space.sm,
  },
  openToggle: {
    flexDirection: 'row', alignItems: 'center',
    margin: space.base, borderRadius: radius.xl,
    padding: space.base, gap: space.md,
    borderWidth: 1.5,
  },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  section: {
    margin: space.base, borderRadius: radius.lg, overflow: 'hidden',
  },
});
