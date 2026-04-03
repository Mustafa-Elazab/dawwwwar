import React from 'react';
import { View } from 'react-native';
import { ScreenTemplate, Text, Button } from '@dawwar/ui';
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
        <Button
          label={ctrl.t('auth.pending_contact')}
          variant="outline"
          onPress={ctrl.handleContactAdmin}
          style={styles.contactBtn}
        />
        <Button
          label={ctrl.t('auth.logout')}
          variant="ghost"
          onPress={ctrl.handleLogout}
          style={styles.logoutBtn}
        />
      </View>
    </ScreenTemplate>
  );
}
