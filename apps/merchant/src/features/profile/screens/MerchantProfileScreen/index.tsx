import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScrollScreenTemplate, Header, Text, Avatar, ListItem, Icon } from '@dawwar/ui';
import { useTheme, space, radius, AppColors } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { useUpdateMerchant, useMyMerchant } from '@dawwar/api-client';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { logout, selectUser } from '../../../../store/slices/auth.slice';
import Toast from 'react-native-toast-message';

export function MerchantProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const { data: merchantRes } = useMyMerchant();
  const merchant = merchantRes?.data;
  const updateMerchantMutation = useUpdateMerchant();

  const isOpen = merchant?.isOpen ?? false;

  const handleToggleOpen = useCallback(async () => {
    if (!merchant) return;
    try {
      await updateMerchantMutation.mutateAsync({
        id: merchant.id,
        updates: { isOpen: !isOpen },
      });
      Toast.show({
        type: 'success',
        text1: t('merchant.store.savedSuccess'),
      });
    } catch {
      Toast.show({ type: 'error', text1: t('common.errorTryAgain') });
    }
  }, [merchant, isOpen, updateMerchantMutation, t]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      t('merchant.profile.logout'),
      t('merchant.profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('merchant.profile.logout'), style: 'destructive', onPress: () => dispatch(logout()) },
      ],
    );
  }, [dispatch, t]);

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollScreenTemplate edges={['top']}>
      <Header title={t('merchant.profile.title')} />

      {/* Merchant info */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Avatar name={merchant?.businessName || user?.name || 'Merchant'} size="lg" />
        <View style={{ flex: 1 }}>
          <Text variant="h4" color={colors.text}>{merchant?.businessName || user?.name || 'Merchant'}</Text>
          <Text variant="caption" color={colors.textSecondary}>{user?.phone}</Text>
        </View>
      </View>

      {/* Open/Close toggle */}
      <TouchableOpacity
        style={[
          styles.openToggle,
          { 
            backgroundColor: isOpen ? colors.success + '10' : colors.error + '10', 
            borderColor: isOpen ? colors.success : colors.error 
          },
        ]}
        onPress={handleToggleOpen}
        disabled={updateMerchantMutation.isPending}
        activeOpacity={0.85}
      >
        <View style={[styles.statusDot, { backgroundColor: isOpen ? colors.success : colors.error }]} />
        <View style={{ flex: 1 }}>
          <Text variant="label" color={isOpen ? colors.success : colors.error} style={{ fontWeight: '700' }}>
            {t(isOpen ? 'merchant.store.isOpen' : 'merchant.store.isClosed')}
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
          title={t('merchant.profile.logout')}
          leftElement={<Icon name="logout" size={22} color={colors.error} />}
          onPress={handleLogout}
        />
      </View>
    </ScrollScreenTemplate>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
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
