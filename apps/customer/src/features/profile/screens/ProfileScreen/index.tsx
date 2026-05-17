import React, { useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Text, Avatar, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { SettingsRow } from '../../components/SettingsRow';
import { useController } from './useController';
import { createStyles } from './styles';
import { PROFILE_ROUTES } from '../../../../navigation/routes';

export function ProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <ScrollScreenTemplate
      edges={['top']}
      headerProps={{ 
        title: t('profile.title'),
        type: 'none'
      }}
      contentStyle={{ paddingBottom: 40 }}
    >
      {/* User info card */}
      <View style={styles.userCard}>
        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={ctrl.handlePickImage}
          disabled={ctrl.isUploading}
        >
          <Avatar uri={ctrl.user?.avatar} name={ctrl.user?.name} size="xl" />
          <View style={styles.editIconContainer}>
            {ctrl.isUploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="camera-outline" size={16} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{ctrl.user?.name}</Text>
        <Text style={styles.userPhone}>{ctrl.user?.phone}</Text>
      </View>

      {/* Account section */}
      <Text style={styles.sectionLabel}>{t('profile.section_account')}</Text>
      <View style={styles.sectionCard}>
        <SettingsRow
          icon="account-edit-outline"
          title={t('profile.edit_profile')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.EDIT_PROFILE)}
        />
        <SettingsRow
          icon="wallet-outline"
          title={t('wallet.title')}
          onPress={() => ctrl.navigate('WalletScreen' as any)}
        />
        <SettingsRow
          icon="map-marker-outline"
          title={t('profile.addresses')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.ADDRESSES)}
        />
      </View>

      {/* Preferences section */}
      <Text style={styles.sectionLabel}>{t('profile.section_preferences')}</Text>
      <View style={styles.sectionCard}>
        <SettingsRow
          icon="translate"
          title={t('profile.language')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.LANGUAGE)}
        />
        <SettingsRow
          icon="theme-light-dark"
          title={t('profile.appearance')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.APPEARANCE)}
        />
      </View>

      {/* Support section */}
      <Text style={styles.sectionLabel}>{t('profile.section_support')}</Text>
      <View style={styles.sectionCard}>
        <SettingsRow icon="whatsapp" title={t('profile.contact_whatsapp')} iconColor="#25D366" 
              onPress={() =>{}}
        />
        <SettingsRow 
          icon="file-document-outline" 
          title={t('profile.terms')} 
          onPress={() => ctrl.navigate(PROFILE_ROUTES.TERMS)}
        />
        <SettingsRow 
          icon="shield-outline" 
          title={t('profile.privacy')} 
          onPress={() => ctrl.navigate(PROFILE_ROUTES.PRIVACY)}
        />
      </View>

      {/* Logout */}
      <View style={styles.logoutRow}>
        <SettingsRow
          icon="logout"
          iconColor={colors.error}
          title={t('profile.logout')}
          onPress={ctrl.handleLogout}
        />
      </View>

      <Text style={styles.versionText}>{t('profile.version', { version: '1.0.0' })}</Text>
    </ScrollScreenTemplate>
  );
}
