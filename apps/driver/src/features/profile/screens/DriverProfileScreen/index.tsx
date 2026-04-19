import React from 'react';
import { View } from 'react-native';
import { ScrollScreenTemplate, Text, Avatar, ListItem, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { ThemeMode } from '@dawwar/types';
import { space } from '@dawwar/theme';
import { useController } from './useController';
import { createStyles } from './styles';

export function DriverProfileScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScrollScreenTemplate edges={['top']}>
      {/* Profile header */}
      <View style={styles.header}>
        <Avatar name={ctrl.user?.name} size="xl" />
        <Text style={styles.name}>{ctrl.user?.name}</Text>
        <Text style={styles.role}>{ctrl.t('auth.as_driver')}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>★ 4.8</Text>
          <Text variant="caption" color={colors.textSecondary}>(128 ratings)</Text>
        </View>
      </View>

      {/* Stats */}
      <Text style={styles.sectionLabel}>{ctrl.t('profile.section_account')}</Text>
      <View style={styles.section}>
        <ListItem
          title={ctrl.t('wallet.title')}
          subtitle={`${ctrl.balance} ${ctrl.t('common.egp')}`}
          leftElement={<Icon name="wallet-outline" size={22} color={colors.primary} />}
        />
        <ListItem
          title={ctrl.t('driver.vehicle_type.MOTORCYCLE')}
          subtitle="Motorcycle"
          leftElement={<Icon name="motorbike" size={22} color={colors.primary} />}
        />
      </View>

      {/* Preferences */}
      <Text style={styles.sectionLabel}>{ctrl.t('profile.section_preferences')}</Text>
      <View style={styles.section}>
        <ListItem
          title={ctrl.t('profile.language')}
          subtitle={ctrl.currentLanguage === 'ar' ? 'العربية' : 'English'}
          leftElement={<Icon name="translate" size={22} color={colors.primary} />}
          onPress={ctrl.handleToggleLanguage}
          showChevron
        />
        <ListItem
          title={ctrl.t('profile.appearance')}
          subtitle={ctrl.currentMode === ThemeMode.DARK ? ctrl.t('appearance.dark') : ctrl.t('appearance.light')}
          leftElement={<Icon name="theme-light-dark" size={22} color={colors.primary} />}
          onPress={ctrl.handleToggleTheme}
          showChevron
        />
      </View>

      {/* Logout */}
      <View style={[styles.section, { marginBottom: space.xl }]}>
        <ListItem
          title={ctrl.t('profile.logout')}
          leftElement={<Icon name="logout" size={22} color={colors.error} />}
          onPress={ctrl.handleLogout}
        />
      </View>
    </ScrollScreenTemplate>
  );
}
