import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Button, AnimatedPressable } from '@dawwar/ui';
import { easings, microInteractions, motion, useTheme } from '@dawwar/theme';
import { OtpInput } from '../../components/OtpInput';
import { useController } from './useController';
import { createStyles } from './styles';

const TIMER_SIZE = 72;
const TIMER_RADIUS = 28;
const TIMER_STROKE = 3;
const TIMER_SECONDS = 30;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

export function OtpScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  const timerProgress = ctrl.canResend ? 0 : Math.max(ctrl.resendSeconds, 0) / TIMER_SECONDS;
  const dashOffset = TIMER_CIRCUMFERENCE * (1 - timerProgress);

  const enter = useSharedValue(0);
  useEffect(() => {
    enter.value = withTiming(1, { duration: motion.pageEnterMs, easing: easings.standard });
  }, [enter]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 16 }],
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ctrl.shakeX.value }],
  }));

  return (
    <ScreenTemplate
      headerProps={{
        title: t('auth.verify_phone'),
        onBackPress: ctrl.handleBack,
      }}
      footer={
        <View style={styles.bottomAction}>
          <Button
            label={t('common.confirm')}
            onPress={() => ctrl.handleOtpChange(ctrl.digits)}
            disabled={ctrl.digits.length < 6 || ctrl.isLoading}
            loading={ctrl.isLoading}
            style={styles.confirmBtn}
            fullWidth
          />
          {__DEV__ ? <Text style={styles.hintText}>{t('auth.otp_sandbox_hint')}</Text> : null}
        </View>
      }
    >
      <View style={styles.container}>
        <Animated.View style={[styles.content, contentStyle]}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {t('auth.otp_subtitle')} <Text style={styles.phoneHighlight}>{ctrl.phone}</Text>
            </Text>
          </View>

          <Animated.View style={[styles.otpWrapper, shakeStyle]}>
            <OtpInput
              value={ctrl.digits}
              onChange={ctrl.handleOtpChange}
              hasError={ctrl.otpError != null}
            />
            {ctrl.otpError != null ? <Text style={styles.errorText}>{ctrl.otpError}</Text> : null}
          </Animated.View>

          <View style={styles.timerContainer}>
            <View style={styles.circleTimerWrap}>
              <Svg width={TIMER_SIZE} height={TIMER_SIZE}>
                <Circle
                  cx={TIMER_SIZE / 2}
                  cy={TIMER_SIZE / 2}
                  r={TIMER_RADIUS}
                  stroke="#242424"
                  strokeWidth={TIMER_STROKE}
                  fill="none"
                />
                <Circle
                  cx={TIMER_SIZE / 2}
                  cy={TIMER_SIZE / 2}
                  r={TIMER_RADIUS}
                  stroke="#1DB954"
                  strokeWidth={TIMER_STROKE}
                  fill="none"
                  strokeDasharray={`${TIMER_CIRCUMFERENCE} ${TIMER_CIRCUMFERENCE}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})`}
                />
              </Svg>
              <Text style={styles.timerValue}>{ctrl.canResend ? '0' : `${ctrl.resendSeconds}`}</Text>
            </View>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>{t('auth.didnt_receive_code')}</Text>
              <AnimatedPressable
                style={styles.resendBtn}
                onPress={ctrl.handleResend}
                disabled={!ctrl.canResend}
                pressScale={microInteractions.pressScale}
                pressOpacity={microInteractions.pressOpacity}
                pressTranslateY={1}
              >
                <Text style={ctrl.canResend ? styles.resendActive : styles.resendDisabled}>
                  {ctrl.canResend
                    ? t('auth.resend_otp')
                    : `${t('auth.resend_in', { seconds: ctrl.resendSeconds })}`}
                </Text>
              </AnimatedPressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </ScreenTemplate>
  );
}
