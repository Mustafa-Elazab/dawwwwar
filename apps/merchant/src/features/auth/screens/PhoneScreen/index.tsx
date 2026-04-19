import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { ScreenTemplate, Text, Button, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import { createStyles } from './styles';

export function PhoneScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  useEffect(() => {
    console.log('[PhoneScreen] Mounted');
  }, []);

  console.log('[PhoneScreen] Render:', { phone: ctrl.phone, isLoading: ctrl.isLoading, phoneError: ctrl.phoneError });

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <View style={styles.container}>

        {/* Logo area */}
        <View style={styles.logoArea}>
          <Text style={styles.logoText}>{'دوّار'}</Text>
          <Text style={styles.tagline}>{ctrl.t('home.location_sub')}</Text>
        </View>

        {/* Form title */}
        <Text style={styles.formTitle}>{ctrl.t('auth.phone_label')}</Text>

        {/* Phone input row */}
        <View style={[styles.phoneRow, ctrl.phoneError ? styles.phoneRowError : null]}>
          {/* Country code prefix — non-interactive */}
          <View style={styles.countryPrefix}>
            <Text style={styles.prefixFlag}>{'🇪🇬'}</Text>
            <Text style={styles.prefixCode}>{'+20'}</Text>
          </View>

          {/* Actual input */}
          <TextInput
            style={styles.phoneInput}
            value={ctrl.phone}
            onChangeText={ctrl.handlePhoneChange}
            placeholder={ctrl.t('auth.phone_placeholder')}
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
        <TouchableOpacity
          style={styles.termsRow}
          onPress={ctrl.handleTermsToggle}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, ctrl.termsAccepted && styles.checkboxChecked]}>
            {ctrl.termsAccepted && (
              <Icon name="check" size={14} color="#fff" />
            )}
          </View>
          <Text style={styles.termsText}>
            {ctrl.t('auth.terms_prefix')}
            <Text style={styles.termsLink}>{ctrl.t('auth.terms_link')}</Text>
            {ctrl.t('auth.terms_suffix')}
            <Text style={styles.termsLink}>{ctrl.t('auth.privacy_link')}</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        {/* Send OTP button */}
        <Button
          label={ctrl.isLoading ? ctrl.t('auth.sending') : ctrl.t('auth.send_otp')}
          onPress={ctrl.handleSendOtp}
          loading={ctrl.isLoading}
          disabled={ctrl.isButtonDisabled}
          fullWidth
          style={styles.sendButton}
        />

        {/* Sandbox hint */}
        <Text style={styles.hintText}>{ctrl.t('auth.otp_sandbox_hint')}</Text>

      </View>
    </ScreenTemplate>
  );
}
