import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { ScrollScreenTemplate, Text, Input, Button } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import { createStyles } from './styles';

export function RegisterScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t, control, handleSubmit, errors, isValid, isLoading, serverError, onSubmit, handleGoToLogin } = useController();

  return (
    <ScrollScreenTemplate edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('auth.register_title')}</Text>
        <Text style={styles.subtitle}>{t('auth.register_subtitle')}</Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.name_label')}
                placeholder="John Doe"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
                containerStyle={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.phone_label')}
                placeholder={t('auth.phone_placeholder')}
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.phone?.message}
                containerStyle={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.password_label')}
                placeholder="********"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                containerStyle={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.confirm_password_label')}
                placeholder="********"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
                containerStyle={styles.input}
              />
            )}
          />

          {serverError != null && (
            <Text style={{ color: colors.error, marginBottom: 8 }}>{serverError}</Text>
          )}

          <Button
            label={t('auth.signup_btn')}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            loading={isLoading}
            disabled={!isValid || isLoading}
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.already_account')}</Text>
          <TouchableOpacity onPress={handleGoToLogin}>
            <Text style={styles.footerLink}>{t('auth.login_btn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollScreenTemplate>
  );
}
