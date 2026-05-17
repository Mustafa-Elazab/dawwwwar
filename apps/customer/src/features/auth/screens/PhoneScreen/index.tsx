import React, { useMemo } from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Button, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import RTLTextInput from '../../../../components/RTLTextInput';
import { useController } from './useController';
import { createStyles } from './styles';

export function PhoneScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <ScreenTemplate 
      backgroundColor={colors.primary}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <View style={styles.container}>
        {/* Top 40% Illustration/Branding area */}
        <View style={styles.illustrationArea}>
          <Text style={styles.logoText}>{'دوّار'}</Text>
          <Text style={styles.tagline}>{'كل اللي تحتاجه، في دقيقة'}</Text>
        </View>

        {/* Form Card (Bottom Sheet style) */}
        <View style={styles.card}>
          {/* Form title */}
          <Text style={styles.formTitle}>{t('auth.phone_label')}</Text>

          {/* Phone input row */}
          <View style={[styles.phoneRow, ctrl.phoneError ? styles.phoneRowError : null]}>
            {/* Country code prefix */}
            <View style={styles.countryPrefix}>
              <Text style={styles.prefixFlag}>{'🇪🇬'}</Text>
              <Text style={styles.prefixCode}>{'+20'}</Text>
            </View>

            {/* Actual input */}
            <RTLTextInput
              style={styles.phoneInput}
              value={ctrl.phone}
              onChangeText={ctrl.handlePhoneChange}
              placeholder={t('auth.phone_placeholder')}
              placeholderTextColor={colors.placeholder}
              keyboardType="phone-pad"
              maxLength={11}
              returnKeyType="done"
              onSubmitEditing={ctrl.handleSendOtp}
              autoFocus
            />
          </View>

          {/* Inline error */}
          {ctrl.phoneError != null && (
            <Text style={styles.errorText}>{ctrl.phoneError}</Text>
          )}

          {/* T&C checkbox */}
          <View style={styles.termsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={ctrl.handleTermsToggle}
              activeOpacity={0.8}
              testID="terms-checkbox"
            >
              <View style={[styles.checkbox, ctrl.termsAccepted && styles.checkboxChecked]}>
                {ctrl.termsAccepted && (
                  <Icon name="check" size={14} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
            
            <Text style={styles.termsText}>
              {t('auth.terms_prefix')}
              <Text style={styles.termsLink} onPress={ctrl.handleTermsPress}>{t('auth.terms_link')}</Text>
              {t('auth.terms_suffix')}
              <Text style={styles.termsLink} onPress={ctrl.handlePrivacyPress}>{t('auth.privacy_link')}</Text>
            </Text>
          </View>

          <View style={styles.spacer} />

          {/* Send OTP button */}
          <Button
            label={ctrl.isLoading ? t('auth.sending') : t('auth.send_otp')}
            onPress={ctrl.handleSendOtp}
            loading={ctrl.isLoading}
            disabled={ctrl.isButtonDisabled}
            fullWidth
            style={[
              styles.sendButton,
              ctrl.isButtonDisabled && { backgroundColor: colors.border, opacity: 0.8 }
            ]}
          />

          {/* Terms acceptance hint */}
          {!ctrl.termsAccepted && (
            <Text style={styles.termsHint}>
              {t('auth.accept_terms_hint')}
            </Text>
          )}

          {/* Sandbox hint */}
          <Text style={styles.hintText}>{t('auth.otp_sandbox_hint')}</Text>
        </View>
      </View>
    </ScreenTemplate>
  );
}
