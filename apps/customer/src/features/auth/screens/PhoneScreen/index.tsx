import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { AppScreenTemplate } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { PhoneContent } from './components/PhoneContent';
import { useController } from './useController';

export function PhoneScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <AppScreenTemplate
      backgroundColor={colors.primary}
      statusBarBackgroundColor={colors.primary}
      statusBarStyle="light-content"
    >
      <PhoneContent
        colors={colors}
        brand={t('auth.splash_brand')}
        tagline={t('auth.customer_tagline')}
        phoneLabel={t('auth.phone_label')}
        phonePlaceholder={t('auth.phone_placeholder')}
        termsPrefix={t('auth.terms_prefix')}
        termsLink={t('auth.terms_link')}
        termsSuffix={t('auth.terms_suffix')}
        privacyLink={t('auth.privacy_link')}
        termsHint={t('auth.accept_terms_hint')}
        sandboxHint={t('auth.otp_sandbox_hint')}
        sendLabel={t('auth.send_otp')}
        sendingLabel={t('auth.sending')}
        phone={ctrl.phone}
        phoneError={ctrl.phoneError}
        termsAccepted={ctrl.termsAccepted}
        isLoading={ctrl.isLoading}
        isButtonDisabled={ctrl.isButtonDisabled}
        onPhoneChange={ctrl.handlePhoneChange}
        onTermsToggle={ctrl.handleTermsToggle}
        onTermsPress={ctrl.handleTermsPress}
        onPrivacyPress={ctrl.handlePrivacyPress}
        onSendOtp={ctrl.handleSendOtp}
      />
    </AppScreenTemplate>
  );
}
