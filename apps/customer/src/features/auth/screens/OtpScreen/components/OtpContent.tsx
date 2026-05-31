import React from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { OtpInput } from '../../../components/OtpInput';
import { createStyles } from '../styles';

interface OtpContentProps {
  colors: AppColors;
  subtitle: string;
  phone: string;
  digits: string;
  otpError: string | null;
  shakeX: Animated.Value;
  timerSeconds: number;
  isOtpExpired: boolean;
  didntReceiveLabel: string;
  resendLabel: string;
  resendInLabel: string;
  canResend: boolean;
  onOtpChange: (code: string) => void;
  onResend: () => void;
}

export function OtpContent({
  colors,
  subtitle,
  phone,
  digits,
  otpError,
  shakeX,
  timerSeconds,
  isOtpExpired,
  didntReceiveLabel,
  resendLabel,
  resendInLabel,
  canResend,
  onOtpChange,
  onResend,
}: OtpContentProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {subtitle}{' '}
            <Text style={styles.phoneHighlight}>{phone}</Text>
          </Text>
        </View>

        <Animated.View style={[styles.otpWrapper, { transform: [{ translateX: shakeX }] }]}>
          <OtpInput
            value={digits}
            onChange={onOtpChange}
            hasError={otpError != null}
          />
          {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
        </Animated.View>

        <View style={styles.timerContainer}>
          <View style={[styles.circleTimer, isOtpExpired && styles.circleTimerExpired]}>
            <Text style={[styles.timerValue, isOtpExpired && styles.timerValueExpired]}>
              {isOtpExpired ? '0' : timerSeconds}
            </Text>
          </View>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>{didntReceiveLabel}</Text>
            <TouchableOpacity
              style={styles.resendBtn}
              onPress={onResend}
              disabled={!canResend}
            >
              <Text style={canResend ? styles.resendActive : styles.resendDisabled}>
                {canResend ? resendLabel : resendInLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
