import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../../../../../packages/ui/src/atoms/Text';
import { ScreenTemplate } from '../../../../../../../packages/ui/src/templates/ScreenTemplate';
import { AuthButton } from '../../components/AuthButton';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import { createStyles } from './styles';

export function PendingApprovalScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.illustration}>{'⏳'}</Text>
        <Text style={styles.title}>{ctrl.t('auth.pending_title')}</Text>
        <Text style={styles.body}>{ctrl.t('auth.pending_body')}</Text>
        <AuthButton
          label={ctrl.t('auth.refresh_status')}
          onPress={ctrl.handleRefreshStatus}
          loading={ctrl.isRefreshing}
          style={styles.contactBtn}
        />
        <AuthButton
          label={ctrl.t('auth.pending_contact')}
          variant="outline"
          onPress={ctrl.handleContactAdmin}
          style={styles.contactBtn}
        />
        <AuthButton
          label={ctrl.t('auth.logout')}
          variant="ghost"
          onPress={ctrl.handleLogout}
          style={styles.logoutBtn}
        />
      </View>
    </ScreenTemplate>
  );
}
