import React from 'react';
import { View } from 'react-native';
import { ScrollScreenTemplate, Header, Text, Avatar } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { SettingsRow } from '../../components/SettingsRow';
import { useController } from './useController';
import { createStyles } from './styles';
import { PROFILE_ROUTES } from '../../../../navigation/routes';

export function ProfileScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScrollScreenTemplate
      edges={['top']}
      header={<Header title={ctrl.t('profile.title')} />}
    >
      {/* User info card */}
      <View style={styles.userCard}>
        <Avatar name={ctrl.user?.name} size="xl" />
        <Text style={styles.userName}>{ctrl.user?.name}</Text>
        <Text style={styles.userPhone}>{ctrl.user?.phone}</Text>
      </View>

      {/* Account section */}
      <Text style={styles.sectionLabel}>{ctrl.t('profile.section_account')}</Text>
      <View style={styles.sectionCard}>
        <SettingsRow
          icon="map-marker-outline"
          title={ctrl.t('profile.addresses')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.ADDRESSES)}
        />
      </View>

      {/* Preferences section */}
      <Text style={styles.sectionLabel}>{ctrl.t('profile.section_preferences')}</Text>
      <View style={styles.sectionCard}>
        <SettingsRow
          icon="translate"
          title={ctrl.t('profile.language')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.LANGUAGE)}
        />
        <SettingsRow
          icon="theme-light-dark"
          title={ctrl.t('profile.appearance')}
          onPress={() => ctrl.navigate(PROFILE_ROUTES.APPEARANCE)}
        />
      </View>

      {/* Support section */}
      <Text style={styles.sectionLabel}>{ctrl.t('profile.section_support')}</Text>
      <View style={styles.sectionCard}>
        <SettingsRow icon="whatsapp" title={ctrl.t('profile.contact_whatsapp')} iconColor="#25D366" />
        <SettingsRow icon="file-document-outline" title={ctrl.t('profile.terms')} />
        <SettingsRow icon="shield-outline" title={ctrl.t('profile.privacy')} />
      </View>

      {/* Logout */}
      <View style={styles.logoutRow}>
        <SettingsRow
          icon="logout"
          iconColor={colors.error}
          title={ctrl.t('profile.logout')}
          onPress={ctrl.handleLogout}
        />
      </View>

      <Text style={styles.versionText}>{ctrl.t('profile.version', { version: '1.0.0' })}</Text>
    </ScrollScreenTemplate>
  );
}
