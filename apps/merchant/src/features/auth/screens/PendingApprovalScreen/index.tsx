import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenTemplate, Text, Button } from '@dawwar/ui';
import { useTheme, space } from '@dawwar/theme';
import { useController } from './useController';

export function PendingApprovalScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.illustration}>{'⏳'}</Text>
        <Text variant="h2" style={styles.title}>{ctrl.t('merchant.pendingApproval.title')}</Text>
        <Text variant="body1" style={styles.body}>{ctrl.t('merchant.pendingApproval.subtitle')}</Text>
        
        <View style={styles.spacer} />

        <Button
          label={ctrl.t('common.retry')}
          onPress={ctrl.handleRefreshStatus}
          loading={ctrl.isRefreshing}
          style={styles.button}
        />
        <Button
          label={ctrl.t('merchant.pendingApproval.contactSupport')}
          variant="outline"
          onPress={ctrl.handleContactAdmin}
          style={styles.button}
        />
        <Button
          label={ctrl.t('merchant.profile.logout')}
          variant="ghost"
          onPress={ctrl.handleLogout}
          style={styles.logoutBtn}
        />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    fontSize: 80,
    marginBottom: space['2xl'],
  },
  title: {
    textAlign: 'center',
    marginBottom: space.md,
  },
  body: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 24,
  },
  spacer: {
    flex: 1,
  },
  button: {
    width: '100%',
    marginBottom: space.md,
  },
  logoutBtn: {
    width: '100%',
  },
});
