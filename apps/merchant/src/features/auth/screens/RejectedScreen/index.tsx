import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenTemplate, Text, Button, Icon } from '@dawwar/ui';
import { useTheme, space } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch } from '../../../../store/hooks';
import { logout } from '../../../../store/slices/auth.slice';

export function RejectedScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
          <Icon name="close-circle" size={80} color={colors.error} />
        </View>
        <Text variant="h2" style={styles.title}>{t('auth.rejected_title')}</Text>
        <Text variant="body1" style={styles.body}>{t('auth.rejected_body')}</Text>
        <Button
          label={t('auth.logout')}
          variant="outline"
          onPress={() => dispatch(logout())}
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
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xl,
  },
  title: {
    marginBottom: space.sm,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.6)',
    marginBottom: space['2xl'],
  },
  logoutBtn: {
    width: '100%',
  },
});
