import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { useController } from './useController';
import { createStyles } from './styles';
import { Button, ScreenTemplate, Text } from '@dawwar/ui';

export function AuthSelectionScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const { handleLogin, handleSignup } = useController();

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>DAWWAR</Text>
        </View>

        <Text style={styles.welcomeText}>{t('auth.auth_selection_title')}</Text>
        <Text style={styles.subtitleText}>
          {t('auth.auth_selection_subtitle')}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            label={t('auth.login_btn')}
            onPress={handleLogin}
            variant="primary"
            style={styles.loginButton}
          />
          <Button
            label={t('auth.signup_btn')}
            onPress={handleSignup}
            variant="outline"
            style={styles.signupButton}
          />
        </View>
      </View>
    </ScreenTemplate>
  );
}
