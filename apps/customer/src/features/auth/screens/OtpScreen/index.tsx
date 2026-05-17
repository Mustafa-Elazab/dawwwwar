import React, { useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Animated, I18nManager } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Button, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { OtpInput } from '../../components/OtpInput';
import { useController } from './useController';
import { createStyles } from './styles';

export function OtpScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  return (
    <ScreenTemplate
      headerProps={{
        title: t('auth.verify_phone'),
        onBackPress: ctrl.handleBack,
      }}
      footer={
        <View style={styles.bottomAction}>
          <Button
            label={t('common.confirm', 'تأكيد')}
            onPress={() => ctrl.handleOtpChange(ctrl.digits)}
            disabled={ctrl.digits.length < 6 || ctrl.isLoading}
            loading={ctrl.isLoading}
            style={styles.confirmBtn}
            fullWidth
          />
          <Text style={styles.hintText}>{t('auth.otp_sandbox_hint')}</Text>
        </View>
      }
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {t('auth.otp_subtitle')}{' '}
              <Text style={styles.phoneHighlight}>{ctrl.phone}</Text>
            </Text>
          </View>

          {/* OTP boxes — wrapped in shake animation */}
          <Animated.View style={[styles.otpWrapper, { transform: [{ translateX: ctrl.shakeX }] }]}>
            <OtpInput
              value={ctrl.digits}
              onChange={ctrl.handleOtpChange}
              hasError={ctrl.otpError != null}
            />
            {ctrl.otpError != null && (
              <Text style={styles.errorText}>{ctrl.otpError}</Text>
            )}
          </Animated.View>

          {/* Circular Timer */}
          <View style={styles.timerContainer}>
            <View style={[styles.circleTimer, ctrl.isOtpExpired && styles.circleTimerExpired]}>
              <Text style={[styles.timerValue, ctrl.isOtpExpired && { color: colors.error }]}>
                {ctrl.isOtpExpired ? '0' : ctrl.timerSeconds}
              </Text>
            </View>
            
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>لم يصلك الرمز؟</Text>
              <TouchableOpacity
                style={styles.resendBtn}
                onPress={ctrl.handleResend}
                disabled={!ctrl.canResend}
              >
                <Text style={ctrl.canResend ? styles.resendActive : styles.resendDisabled}>
                  {ctrl.canResend
                    ? t('auth.resend_otp')
                    : `${t('auth.resend_in',{seconds:ctrl.resendSeconds})}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScreenTemplate>
  );
}
