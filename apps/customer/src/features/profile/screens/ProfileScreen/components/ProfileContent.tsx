import React from 'react';
import { ActivityIndicator, Switch, TouchableOpacity, View } from 'react-native';
import type { TFunction } from 'i18next';
import type { AppColors } from '@dawwar/theme';
import { Avatar, Icon, Text } from '@dawwar/ui';
import { SettingsRow } from '../../../components/SettingsRow';
import { PROFILE_ROUTES, WALLET_ROUTES } from '../../../../../navigation/routes';
import { createStyles } from '../styles';
import { ProfileLoginPrompt } from './ProfileLoginPrompt';

interface ProfileContentProps {
  colors: AppColors;
  controller: any;
  t: TFunction;
  languageLabel: string;
}

export function ProfileContent({
  colors,
  controller,
  t,
  languageLabel,
}: ProfileContentProps) {
  const styles = createStyles(colors);
  const ctrl = controller;

  return (
    <>
      {!ctrl.user ? (
        <View style={styles.loginCard}>
          <ProfileLoginPrompt
            colors={colors}
            onPress={ctrl.handleLogin}
            label={t('profile.login_register', 'Login / Register')}
          />
        </View>
      ) : null}

      {ctrl.user ? (
        <View style={styles.userCard}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={ctrl.handlePickImage}
            disabled={ctrl.isUploading}
          >
            <Avatar uri={ctrl.user?.avatar} name={ctrl.user?.name} size="xl" />
            <View style={styles.editIconContainer}>
              {ctrl.isUploading ? (
                <ActivityIndicator size="small" color={colors.primaryText} />
              ) : (
                <Icon name="camera-outline" size={16} color={colors.primaryText} />
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.userTextCol}>
            <Text style={styles.userName}>{ctrl.user?.name}</Text>
            <View style={styles.userMetaRow}>
              <Icon name="phone" size={12} color={colors.textTertiary} />
              <Text style={styles.userPhone}>{ctrl.user?.phone}</Text>
            </View>
            <View style={styles.userMetaRow}>
              <Icon name="email" size={12} color={colors.textTertiary} />
              <Text style={styles.userPhone}>
                {ctrl.user?.name ? `${ctrl.user.name.split(' ')[0].toLowerCase()}@dawwar.app` : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileEditBtn}
            onPress={() => ctrl.navigate(PROFILE_ROUTES.EDIT_PROFILE)}
          >
            <Icon name="pencil" size={22} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
      ) : null}

      {ctrl.user ? (
        <TouchableOpacity style={styles.logoutPill} onPress={ctrl.handleLogout}>
          <Icon name="logout" size={20} color={colors.primary} />
          <Text style={styles.logoutPillText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.sectionCard}>
        <SettingsRow
          icon="map-marker-outline"
          title={t('profile.my_locations', 'My Locations')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.ADDRESSES)}
        />
        <SettingsRow
          icon="ticket-percent-outline"
          title={t('profile.my_promotions', 'My Promotions')}
          onPress={() => {}}
        />
        <SettingsRow
          icon="wallet-outline"
          title={t('profile.payment_methods', 'Payment Methods')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.PAYMENT_METHODS)}
        />
        <SettingsRow
          icon="receipt-text-outline"
          title={t('profile.transactions', 'Transactions')}
          onPress={() => ctrl.navigate(WALLET_ROUTES.TRANSACTIONS)}
        />
        <SettingsRow
          icon="account-multiple-plus-outline"
          title={t('profile.invite_friends', 'Invite Friends')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.INVITE_FRIENDS)}
        />
      </View>

      <View style={styles.preferences}>
        <SettingsRow
          icon="translate"
          title={t('profile.language')}
          rightElement={<Text style={styles.languageChip}>{languageLabel}</Text>}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.LANGUAGE)}
        />
        <SettingsRow
          icon="bell-outline"
          title={t('profile.push_notification', 'Push Notification')}
          rightElement={
            <Switch
              value={ctrl.pushNotifications}
              onValueChange={ctrl.handleTogglePushNotifications}
              trackColor={{ true: colors.primaryLight, false: colors.border }}
              thumbColor={ctrl.pushNotifications ? colors.primary : colors.primaryText}
            />
          }
        />
        <SettingsRow
          icon="theme-light-dark"
          title={t('profile.dark_mode', 'Dark Mode')}
          rightElement={
            <Switch
              value={ctrl.isDarkMode}
              onValueChange={ctrl.handleToggleDarkMode}
              trackColor={{ true: colors.primaryLight, false: colors.border }}
              thumbColor={ctrl.isDarkMode ? colors.primary : colors.primaryText}
            />
          }
        />
      </View>

      <Text style={styles.versionText}>{t('profile.version', { version: '1.0.0' })}</Text>
    </>
  );
}
