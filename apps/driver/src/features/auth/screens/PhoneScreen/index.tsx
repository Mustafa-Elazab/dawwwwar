import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../../../../../packages/ui/src/atoms/Icon';
import { Text } from '../../../../../../../packages/ui/src/atoms/Text';
import { AppScreenTemplate } from '../../../../../../../packages/ui/src/templates/AppScreenTemplate';
import { useTheme } from '@dawwar/theme';
import RTLTextInput from '../../../../components/RTLTextInput';
import { AuthButton } from '../../components/AuthButton';
import { useController } from './useController';
import { createStyles } from './styles';

export function PhoneScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <AppScreenTemplate
      backgroundColor={colors.primary}
      statusBarBackgroundColor={colors.primary}
      statusBarStyle="light-content"
    >
      <View style={styles.container}>
        <View style={styles.illustrationArea}>
          <Text style={styles.logoText}>{ctrl.t('auth.splash_brand')}</Text>
          <Text style={styles.tagline}>{ctrl.t('auth.as_driver_sub')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.formTitle}>{ctrl.t('auth.phone_label')}</Text>

          <View style={[styles.phoneRow, ctrl.phoneError ? styles.phoneRowError : null]}>
            <View style={styles.countryPrefix}>
              <Text style={styles.prefixFlag}>{'EG'}</Text>
              <Text style={styles.prefixCode}>{'+20'}</Text>
            </View>

            <RTLTextInput
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

          {ctrl.phoneError ? <Text style={styles.errorText}>{ctrl.phoneError}</Text> : null}

          <View style={styles.termsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={ctrl.handleTermsToggle}
              activeOpacity={0.8}
              testID="terms-checkbox"
            >
              <View style={[styles.checkbox, ctrl.termsAccepted && styles.checkboxChecked]}>
                {ctrl.termsAccepted ? (
                  <Icon name="check" size={14} color={colors.primaryText} />
                ) : null}
              </View>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              {ctrl.t('auth.terms_prefix')}
              <Text style={styles.termsLink}>{ctrl.t('auth.terms_link')}</Text>
              {ctrl.t('auth.terms_suffix')}
              <Text style={styles.termsLink}>{ctrl.t('auth.privacy_link')}</Text>
            </Text>
          </View>

          <View style={styles.spacer} />

          <AuthButton
            label={ctrl.isLoading ? ctrl.t('auth.sending') : ctrl.t('auth.send_otp')}
            onPress={ctrl.handleSendOtp}
            loading={ctrl.isLoading}
            disabled={ctrl.isButtonDisabled}
            style={[
              styles.sendButton,
              ctrl.isButtonDisabled && styles.sendButtonDisabled,
            ]}
          />

          {!ctrl.termsAccepted ? (
            <Text style={styles.termsHint}>{ctrl.t('auth.accept_terms_hint')}</Text>
          ) : null}
          <Text style={styles.hintText}>{ctrl.t('auth.otp_sandbox_hint')}</Text>
        </View>
      </View>
    </AppScreenTemplate>
  );
}
