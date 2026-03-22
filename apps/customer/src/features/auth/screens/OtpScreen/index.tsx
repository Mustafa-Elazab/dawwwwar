import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { ScrollScreenTemplate, Text, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { OtpInput } from '../../components/OtpInput';
import { useController } from './useController';
import { createStyles } from './styles';

export function OtpScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScrollScreenTemplate
      edges={['top', 'bottom']}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => { /* navigation.goBack() handled by stack */ }}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{ctrl.t('auth.otp_title')}</Text>
        <Text style={styles.subtitle}>
          {ctrl.t('auth.otp_subtitle')}
          <Text style={styles.phoneHighlight}>{ctrl.phone}</Text>
        </Text>

        {/* OTP boxes — wrapped in shake animation */}
        <Animated.View style={[styles.otpWrapper, ctrl.shakeStyle]}>
          <OtpInput
            value={ctrl.digits}
            onChange={ctrl.handleDigitChange}
            onBackspace={ctrl.handleBackspace}
            hasError={ctrl.otpError != null}
          />
          {ctrl.otpError != null && (
            <Text style={styles.errorText}>{ctrl.otpError}</Text>
          )}
        </Animated.View>

        {/* Loading indicator while verifying */}
        {ctrl.isLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}

        {/* Timer */}
        {!ctrl.isOtpExpired ? (
          <View style={styles.timerRow}>
            <Text style={[styles.timerText, ctrl.timerSeconds < 30 && { color: colors.error }]}>
              {ctrl.t('auth.otp_expires')} {ctrl.timerSeconds}s
            </Text>
          </View>
        ) : (
          <View style={styles.timerRow}>
            <Text style={[styles.timerText, { color: colors.error }]}>
              {ctrl.t('auth.otp_expired')}
            </Text>
          </View>
        )}

        {/* Resend button */}
        <TouchableOpacity
          style={styles.resendButton}
          onPress={ctrl.handleResend}
          disabled={!ctrl.canResend}
        >
          <Text style={ctrl.canResend ? styles.resendActive : styles.resendDisabled}>
            {ctrl.canResend
              ? ctrl.t('auth.resend_otp')
              : `${ctrl.t('auth.resend_in')} ${ctrl.resendSeconds}s`}
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollScreenTemplate>
  );
}
