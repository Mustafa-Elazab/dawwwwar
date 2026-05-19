import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScreenTemplate, Text, Button } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { useTheme, space, radius } from '@dawwar/theme';
import { useNavigation } from '@react-navigation/native';
import { AUTH_ROUTES } from '../../../../navigation/routes';

export function GuestProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    navigation.navigate('Auth', { screen: AUTH_ROUTES.PHONE });
  };

  return (
    <ScreenTemplate edges={['top']}>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Text style={{ fontSize: 60 }}>👋</Text>
        </View>

        <Text variant="h2" style={styles.title}>{t('guest.welcomeTitle')}</Text>
        <Text variant="body1" style={styles.subtitle}>{t('guest.welcomeSubtitle')}</Text>

        <Button
          label={t('guest.login')}
          onPress={handleLogin}
          style={styles.button}
          fullWidth
        />

        <TouchableOpacity 
          style={styles.registerLink}
          onPress={handleLogin}
        >
          <Text style={[styles.registerText, { color: colors.textSecondary }]}>
            {t('guest.createAccount')}
          </Text>
        </TouchableOpacity>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: space.sm,
  },
  subtitle: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.6)',
    marginBottom: space['2xl'],
    lineHeight: 22,
  },
  button: {
    height: 56,
    borderRadius: radius.lg,
  },
  registerLink: {
    marginTop: space.lg,
    padding: space.sm,
  },
  registerText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
