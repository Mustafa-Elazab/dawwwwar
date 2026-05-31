import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { AppScreenTemplate } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { OtpContent } from './components/OtpContent';
import { OtpFooter } from './components/OtpFooter';
import { useController } from './useController';

export function OtpScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();
  return (
    <AppScreenTemplate
      headerProps={{
        title: t('auth.verify_phone'),
        onBackPress: ctrl.handleBack,
      }}
      footer={
        <OtpFooter
          colors={colors}
          confirmLabel={t('common.confirm', 'تأكيد')}
          sandboxHint={t('auth.otp_sandbox_hint')}
          disabled={ctrl.digits.length < 6 || ctrl.isLoading}
          loading={ctrl.isLoading}
          onConfirm={() => ctrl.handleOtpChange(ctrl.digits)}
        />
      }
    >
      <OtpContent
        colors={colors}
        subtitle={t('auth.otp_subtitle')}
        phone={ctrl.phone}
        digits={ctrl.digits}
        otpError={ctrl.otpError}
        shakeX={ctrl.shakeX}
        timerSeconds={ctrl.timerSeconds}
        isOtpExpired={ctrl.isOtpExpired}
        didntReceiveLabel={t('auth.didnt_receive_code')}
        resendLabel={t('auth.resend_otp')}
        resendInLabel={t('auth.resend_in', { seconds: ctrl.resendSeconds })}
        canResend={ctrl.canResend}
        onOtpChange={ctrl.handleOtpChange}
        onResend={ctrl.handleResend}
      />
    </AppScreenTemplate>
  );
}
