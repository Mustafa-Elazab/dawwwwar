import React from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../../../../../packages/ui/src/atoms/Text';
import { AppScreenTemplate } from '../../../../../../../packages/ui/src/templates/AppScreenTemplate';
import { useTheme } from '@dawwar/theme';
import { OtpInput } from '../../components/OtpInput';
import { AuthButton } from '../../components/AuthButton';
import { useController } from './useController';
import { createStyles } from './styles';

export function OtpScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <AppScreenTemplate
      headerProps={{
        title: ctrl.t('auth.verify_phone'),
        onBackPress: ctrl.handleBack,
      }}
      footer={
        <View style={styles.bottomAction}>
          <AuthButton
            label={ctrl.t('common.confirm', 'تأكيد')}
            onPress={() => ctrl.handleOtpChange(ctrl.digits)}
            disabled={ctrl.digits.length < 6 || ctrl.isLoading}
            loading={ctrl.isLoading}
            style={styles.confirmBtn}
          />
          <Text style={styles.hintText}>{ctrl.t('auth.otp_sandbox_hint')}</Text>
        </View>
      }
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {ctrl.t('auth.otp_subtitle')}{' '}
              <Text style={styles.phoneHighlight}>{ctrl.phone}</Text>
            </Text>
          </View>

          <Animated.View style={[styles.otpWrapper, { transform: [{ translateX: ctrl.shakeX }] }]}>
            <OtpInput
              value={ctrl.digits}
              onChange={ctrl.handleOtpChange}
              hasError={ctrl.otpError != null}
            />
            {ctrl.otpError ? <Text style={styles.errorText}>{ctrl.otpError}</Text> : null}
          </Animated.View>

          <View style={styles.timerContainer}>
            <View style={[styles.circleTimer, ctrl.isOtpExpired && styles.circleTimerExpired]}>
              <Text style={[styles.timerValue, ctrl.isOtpExpired && styles.timerValueExpired]}>
                {ctrl.isOtpExpired ? '0' : ctrl.timerSeconds}
              </Text>
            </View>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>{ctrl.t('auth.didnt_receive_code')}</Text>
              <TouchableOpacity
                style={styles.resendBtn}
                onPress={ctrl.handleResend}
                disabled={!ctrl.canResend}
              >
                <Text style={ctrl.canResend ? styles.resendActive : styles.resendDisabled}>
                  {ctrl.canResend
                    ? ctrl.t('auth.resend_otp')
                    : ctrl.t('auth.resend_in', { seconds: ctrl.resendSeconds })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </AppScreenTemplate>
  );
}
