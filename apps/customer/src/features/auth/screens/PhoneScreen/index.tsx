import React, { useEffect } from 'react';
import { View, StatusBar, I18nManager } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Button, Icon, AnimatedPressable } from '@dawwar/ui';
import { easings, microInteractions, motion, useTheme } from '@dawwar/theme';
import RTLTextInput from '../../../../components/RTLTextInput';
import { useController } from './useController';
import { createStyles } from './styles';

export function PhoneScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const [isPhoneFocused, setPhoneFocused] = React.useState(false);

  const enter = useSharedValue(0);
  const float = useSharedValue(0);

  useEffect(() => {
    enter.value = withTiming(1, { duration: motion.pageEnterMs, easing: easings.standard });
    float.value = withRepeat(
      withTiming(1, { duration: motion.splashFloatMs, easing: easings.standard }),
      -1,
      true,
    );
  }, [enter, float]);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 16 + float.value * -4 }],
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 22 }],
  }));

  return (
    <ScreenTemplate backgroundColor={colors.background}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.container}>
        <Animated.View style={[styles.atmosphere, heroStyle]}>
          <View style={styles.orbPrimary} />
          <View style={styles.orbSecondary} />
        </Animated.View>

        <Animated.View style={[styles.hero, heroStyle]}>
          <View style={styles.logoShell}>
            <Icon name="moped" size={56} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>{t('common.app_name')}</Text>
          <Text style={[styles.tagline, I18nManager.isRTL && styles.taglineRtl]}>
            {t('auth.auth_selection_subtitle')}
          </Text>
        </Animated.View>

        {/* Form Card (Bottom Sheet style) */}
        <Animated.View style={[styles.card, sheetStyle]}>
          {/* Form title */}
          <Text style={styles.formTitle}>{t('auth.enterPhone')}</Text>
          <Text style={styles.formSubtitle}>{t('auth.phone_subtitle')}</Text>

          {/* Phone input row */}
          <View
            style={[
              styles.phoneRow,
              isPhoneFocused && styles.phoneRowFocused,
              ctrl.phoneError ? styles.phoneRowError : null,
            ]}
          >
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
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              autoFocus
            />
          </View>

          {/* Inline error */}
          {ctrl.phoneError != null && (
            <Text style={styles.errorText}>{ctrl.phoneError}</Text>
          )}

          {/* T&C checkbox */}
          <View style={styles.termsRow}>
            <AnimatedPressable
              style={styles.checkboxContainer}
              onPress={ctrl.handleTermsToggle}
              pressScale={microInteractions.pressScale}
              pressOpacity={microInteractions.pressOpacity}
              pressTranslateY={1}
              testID="terms-checkbox"
            >
              <View style={[styles.checkbox, ctrl.termsAccepted && styles.checkboxChecked]}>
                {ctrl.termsAccepted && (
                  <Icon name="check" size={14} color="#fff" />
                )}
              </View>
            </AnimatedPressable>
            
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
            style={[styles.sendButton, ctrl.isButtonDisabled && styles.sendButtonDisabled]}
          />

          {/* Terms acceptance hint */}
          {!ctrl.termsAccepted && (
            <Text style={styles.termsHint}>
              {t('auth.accept_terms_hint')}
            </Text>
          )}

          {/* Sandbox hint */}
          {__DEV__ ? <Text style={styles.hintText}>{t('auth.otp_sandbox_hint')}</Text> : null}
        </Animated.View>
      </View>
    </ScreenTemplate>
  );
}
